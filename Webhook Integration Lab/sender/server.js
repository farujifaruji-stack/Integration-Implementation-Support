// Loads WEBHOOK_SECRET from the local .env file.
require('dotenv').config();

const express = require('express');
const { randomUUID, createHmac } = require('crypto');

const app = express();

app.use(express.json());

const RECEIVER_URL = 'http://localhost:5000/webhooks/tickets';

// Stores delivery records while the sender is running.
const deliveryLogs = [];

// Sends one signed webhook delivery and updates its log record.
async function deliverWebhook(delivery) {
  const payload = JSON.stringify(delivery.event);

  const signature = createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  delivery.attempts += 1;
  delivery.last_attempt_at = new Date().toISOString();

  try {
    const receiverResponse = await fetch(RECEIVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
      },
      body: payload,
    });

    delivery.response_status = receiverResponse.status;

    if (receiverResponse.ok) {
      delivery.status = 'delivered';
      delivery.error = null;
    } else {
      delivery.status = 'failed';
      delivery.error = `Receiver returned HTTP ${receiverResponse.status}`;
    }
  } catch (error) {
    delivery.status = 'failed';
    delivery.response_status = null;
    delivery.error = error.message;
  }

  return delivery;
}

// Creates a ticket event and sends its webhook.
app.post('/tickets', async (req, res) => {
  const event = {
    // event_id is optional and is useful for duplicate-event testing.
    id: req.body.event_id || randomUUID(),
    type: 'ticket.created',
    created_at: new Date().toISOString(),
    data: req.body,
  };

  const delivery = {
    id: randomUUID(),
    event,
    status: 'pending',
    attempts: 0,
    created_at: new Date().toISOString(),
    last_attempt_at: null,
    response_status: null,
    error: null,
  };

  deliveryLogs.push(delivery);

  await deliverWebhook(delivery);

  res.status(delivery.status === 'delivered' ? 201 : 502).json({
    message:
      delivery.status === 'delivered'
        ? 'Ticket created and webhook delivered.'
        : 'Ticket created, but webhook delivery failed.',
    delivery,
  });
});

// Shows all webhook-delivery records.
app.get('/webhook-deliveries', (req, res) => {
  res.json(deliveryLogs);
});

// Retries one failed webhook delivery by delivery ID.
app.post('/webhook-deliveries/:deliveryId/retry', async (req, res) => {
  const delivery = deliveryLogs.find(
    (item) => item.id === req.params.deliveryId
  );

  if (!delivery) {
    return res.status(404).json({
      message: 'Delivery record not found.',
    });
  }

  await deliverWebhook(delivery);

  res.json({
    message:
      delivery.status === 'delivered'
        ? 'Webhook retry succeeded.'
        : 'Webhook retry failed.',
    delivery,
  });
});

app.listen(4000, () => {
  console.log('Sender is running at http://localhost:4000');
});