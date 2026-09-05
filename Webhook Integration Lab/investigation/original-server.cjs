// Loads WEBHOOK_SECRET from the local .env file.
require('dotenv').config();

const express = require('express');

// createHmac recreates the expected signature.
// timingSafeEqual compares signatures safely.
const { createHmac, timingSafeEqual } = require('crypto');

const app = express();
// Stores event IDs already processed while this receiver is running.
const processedEventIds = new Set();

// This route receives signed webhook events.
// express.raw is required because the signature must be verified
// against the original body exactly as the sender sent it.
app.post(
  '/webhooks/tickets',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    // Converts the raw request body to text.
    const payload = req.body.toString('utf8');

    // Reads the signature sent by the sender.
    const receivedSignature = req.headers['x-webhook-signature'];

    // Creates the signature the receiver expects from this payload.
    const expectedSignature = createHmac('sha256', process.env.WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');

    // Rejects the event when the signature is missing or incorrect.
    if (
      !receivedSignature ||
      receivedSignature.length !== expectedSignature.length ||
      !timingSafeEqual(
        Buffer.from(receivedSignature),
        Buffer.from(expectedSignature)
      )
    ) {
      console.log('Webhook rejected: invalid signature.');

      return res.status(401).json({
        message: 'Invalid webhook signature.',
      });
    }

    // Converts the verified JSON payload back into an object.
    const event = JSON.parse(payload);

// Stops a repeated event from being processed twice.
if (processedEventIds.has(event.id)) {
  console.log('Duplicate webhook ignored:', event.id);

  return res.status(200).json({
    received: true,
    verified: true,
    duplicate: true,
  });
}

// Records this event ID before processing it.
processedEventIds.add(event.id);

    console.log('Verified webhook received:');
    console.log(event);

    // Tells the sender that delivery and verification succeeded.
    res.status(200).json({
      received: true,
      verified: true,
    });
  }
);

app.listen(5000, () => {
  console.log('Receiver is running at http://localhost:5000');
});