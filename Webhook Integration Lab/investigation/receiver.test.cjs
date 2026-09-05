const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

// Execute the real route handler. Only the Express wiring and dotenv are stubbed.
// These are route-level tests, not HTTP or Express middleware integration tests.
const sourcePath = process.env.BASELINE === '1'
  ? resolve(__dirname, 'original-server.cjs')
  : resolve(__dirname, '../receiver/server.js');
function receiver() {
  let handler;
  const logs = [];
  const express = () => ({
    post(path, middleware, fn) { assert.equal(path, '/webhooks/tickets'); handler = fn; },
    listen() {},
  });
  express.raw = () => () => {};
  const secret = 'synthetic-test-secret-not-a-production-credential';
  vm.runInNewContext(readFileSync(sourcePath, 'utf8'), {
    require(name) {
      if (name === 'express') return express;
      if (name === 'dotenv') return { config() {} };
      if (name === 'crypto') return crypto;
      throw new Error('Unexpected dependency: ' + name);
    },
    Buffer, process: { env: { WEBHOOK_SECRET: secret } },
    console: { log(...args) { logs.push(args); } },
  }, { filename: sourcePath });
  return {
    send(payload, signature) {
      const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
      const signed = signature ?? crypto.createHmac('sha256', secret).update(raw).digest('hex');
      const response = { statusCode: 200, body: null };
      handler({ body: Buffer.from(raw), headers: { 'x-webhook-signature': signed } }, {
        status(code) { response.statusCode = code; return this; },
        json(body) { response.body = body; return this; },
      });
      return response;
    }, logs,
  };
}

test('two different tickets without event IDs are both rejected, never acknowledged as duplicates', () => {
  const r = receiver();
  const first = r.send({ type: 'ticket.created', data: { ticket_id: 'SIM-1001' } });
  const second = r.send({ type: 'ticket.created', data: { ticket_id: 'SIM-1002' } });
  console.log(JSON.stringify({ scenario: 'missing IDs', first, second }));
  assert.equal(first.statusCode, 400);
  assert.equal(second.statusCode, 400);
  assert.equal(r.logs.some(line => line[0] === 'Verified webhook received:'), false);
});

for (const id of [null, '', '   ', 42, {}, []]) {
  test('reject invalid event ID: ' + JSON.stringify(id), () => {
    assert.equal(receiver().send({ id }).statusCode, 400);
  });
}
for (const raw of ['{broken', 'null', '[]', '"text"']) {
  test('reject invalid JSON or non-object envelope: ' + raw, () => {
    assert.equal(receiver().send(raw).statusCode, 400);
  });
}
test('valid event is accepted and retry is acknowledged without processing twice', () => {
  const r = receiver();
  const event = { id: 'evt-synthetic-1', type: 'ticket.created', data: { ticket_id: 'SIM-1001' } };
  assert.equal(r.send(event).statusCode, 200);
  assert.equal(r.send(event).body.duplicate, true);
  assert.equal(r.logs.filter(line => line[0] === 'Verified webhook received:').length, 1);
});
test('distinct valid IDs remain independent', () => {
  const r = receiver();
  assert.equal(r.send({ id: 'evt-A' }).body.duplicate, undefined);
  assert.equal(r.send({ id: 'evt-B' }).body.duplicate, undefined);
});
test('invalid signature is rejected before JSON parsing', () => {
  assert.equal(receiver().send('{broken', '0'.repeat(64)).statusCode, 401);
});
test('rejected event can be corrected and retried successfully', () => {
  const r = receiver();
  assert.equal(r.send({ id: '' }).statusCode, 400);
  assert.equal(r.send({ id: 'evt-corrected' }).statusCode, 200);
});
