# AI-assisted investigation: signed events silently treated as duplicates

Personal learning project using synthetic support-ticket events. No customer incident, production data, or measured business impact is claimed.

## Result

Two different signed events without an `id` received successful responses from the original receiver. The first was accepted; the second was ignored as a duplicate. The fix rejects malformed event envelopes before accessing the duplicate-tracking set.

| Same regression suite | Passed | Failed |
| --- | ---: | ---: |
| Original receiver | 3 | 12 |
| Fixed receiver | 15 | 0 |

See `before-tests.txt` and `after-tests.txt` for captured local execution output.

## Source and scope

Original file: [receiver/server.js](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/receiver/server.js). GitHub displayed file commit `e2509a73066af3a1032b5b4a9ea1471f03f64ba3` during review. `original-server.cjs` preserves the source read from GitHub for repeatable before/after comparison.

This is an extension of the existing Express receiver, not a replacement application. The sender, dependencies, signature verification, successful-response format, and valid-event retry behavior remain unchanged.

## Incident-style scenario

A simulated upstream integration sends two different `ticket.created` payloads with no event ID. Both payloads have valid HMAC signatures. A sender observing HTTP 200 could mark both deliveries successful even though the receiver ignores the second event. This is a potential silent-loss failure mode, not evidence that the existing sender actually emits malformed events.

Synthetic input:

```json
{"type":"ticket.created","data":{"ticket_id":"SIM-1001"}}
```

The next payload changes the ticket ID to `SIM-1002` but still omits the event ID.

Observed original responses:

```json
{"statusCode":200,"body":{"received":true,"verified":true}}
{"statusCode":200,"body":{"received":true,"verified":true,"duplicate":true}}
```

## Investigation and root cause

1. Read the receiver's signature check, JSON parsing, and deduplication sequence.
2. Hypothesis: missing IDs share a single deduplication key.
3. Run two distinct, correctly signed, missing-ID events through the original route handler.
4. Observe the first success and the second duplicate success in the captured output.
5. Trace `event.id`: both evaluate to `undefined`. `processedEventIds.add(undefined)` makes the subsequent `.has(undefined)` true.

A valid signature establishes payload authenticity; it does not establish schema validity. The missing validation lets invalid input mutate deduplication state. Signed `null` and malformed JSON also fail before producing a deliberate client-error response.

## Fix and trade-offs

Parse JSON inside a guarded block, then require a non-null, non-array object and a non-empty string ID before any deduplication lookup or mutation. Return HTTP 400 for invalid input. Keep the exact valid ID as the key; do not silently trim or rewrite upstream identifiers.

This deliberately changes the contract for numeric or empty IDs: they are now rejected. An upstream integration using numeric IDs must migrate to string IDs. Signature verification still happens first, so unauthenticated malformed requests receive 401.

Suggested priority: investigate promptly if observed in an integration, because success responses can conceal dropped events. Confirm prevalence, affected customers, and producer behavior before assigning operational severity. No frequency or customer count was measured here.

## Reproduce locally

Requires Node.js 22 or later. From the `Webhook Integration Lab` directory:

```sh
node --test investigation/receiver.test.cjs
```

Expected: 15 pass, zero fail. No dependency installation is needed for this route-level suite.

To run the same expectations against the original receiver in PowerShell:

```powershell
$env:BASELINE='1'
node --test investigation/receiver.test.cjs
Remove-Item Env:BASELINE
```

Expected baseline: 12 failures and 3 passes. The failures are intentional evidence, not a passing build. On macOS/Linux use `BASELINE=1 node --test investigation/receiver.test.cjs`.

The harness loads the actual source in a Node VM and supplies minimal Express registration and dotenv stubs. It invokes the registered handler with signed raw bytes. It verifies handler behavior and processing logs, not actual HTTP transport, Express middleware, deployment, or a database write. The original lab only logs received events; this project does not claim to reproduce duplicate database records.

## Coverage

- Two distinct tickets with missing IDs.
- Null, empty, whitespace-only, numeric, object, and array IDs.
- Malformed JSON and non-object envelopes.
- Valid delivery, duplicate retry, and distinct valid IDs.
- Invalid signature before parsing.
- Invalid input corrected and retried.

## Remaining limitations

The in-memory Set resets on restart, grows without retention limits, and is not shared across receiver processes. Durable idempotency and atomic processing are separate follow-ups. Full event-schema validation, content-type handling, timestamp/replay policy, and HTTP integration tests remain out of scope. A successful unit-level test does not establish production readiness.

## AI contribution and learning record

The user selected the existing personal repository and requested an AI-assisted investigation. Codex inspected the source, proposed the missing-ID hypothesis, wrote the regression tests and fix, executed them locally, and drafted this documentation. The test outputs provide evidence for the hypothesis; they are not a human code review.

Before presenting this as hands-on interview experience, the project owner should run the suite, inspect the diff, explain the failure and fix, and complete the learning checklist below. Those steps are not claimed as completed.

- [ ] Run both versions and explain why the original returns `duplicate: true`.
- [ ] Explain why HMAC verification cannot replace schema validation.
- [ ] Explain why HTTP 400 is preferable to HTTP 200 for these payloads.
- [ ] Explain why this fix does not prevent duplicate processing after restart.
- [ ] Review and publish the change through a pull request.

Accurate description after completing those steps: “In a personal webhook lab, I used AI assistance to investigate invalid-event handling, reproduce the issue with regression tests, and review a validation fix.” Do not describe this as production AI-agent experience.
