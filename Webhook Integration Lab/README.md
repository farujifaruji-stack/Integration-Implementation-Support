# Webhook Integration Lab

A hands-on webhook integration project that demonstrates how to create, send, receive, secure, log, and retry support-ticket webhook events.

## Project purpose

This project simulates two systems communicating through webhooks:

- **Sender:** creates a support-ticket event and delivers it to a configured webhook endpoint.
- **Receiver:** receives the event, verifies its signature, prevents duplicate processing, and returns a response.

## Event flow

```text
Postman creates a ticket
        ↓
Sender creates a ticket.created event
        ↓
Sender signs and sends the webhook
        ↓
Receiver verifies the signature
        ↓
Receiver processes or rejects the event
        ↓
Sender records the delivery result
```

## Features implemented

- Creates `ticket.created` webhook events
- Sends JSON webhook payloads with HTTP `POST`
- Generates unique event IDs
- Signs events with HMAC SHA-256
- Verifies the webhook signature in the receiver
- Rejects invalid signatures with `401 Unauthorized`
- Prevents duplicate event processing
- Records delivery status, attempts, errors, and response status
- Retries failed deliveries manually

## Project structure

```text
Webhook Integration Lab/
├── sender/
│   ├── server.js
│   ├── package.json
│   └── .env
├── receiver/
│   ├── server.js
│   ├── package.json
│   └── .env
├── screenshots/
├── .gitignore
└── README.md
```

## API endpoints

| System | Method | Endpoint | Purpose |
|---|---|---|---|
| Sender | POST | `/tickets` | Creates a ticket event and sends a webhook |
| Sender | GET | `/webhook-deliveries` | Returns delivery records |
| Sender | POST | `/webhook-deliveries/:deliveryId/retry` | Retries a failed delivery |
| Receiver | POST | `/webhooks/tickets` | Receives and verifies a webhook |

## Example ticket request

```json
{
  "ticket_id": "TICK-1001",
  "subject": "Customer cannot log in",
  "priority": "high",
  "status": "open"
}
```

## Testing completed

| Scenario | Expected result |
|---|---|
| Valid signed webhook | Receiver verifies the signature and returns `200 OK` |
| Invalid signature | Receiver rejects the event with `401 Unauthorized` |
| Duplicate event | Receiver ignores the repeated event ID |
| Failed delivery | Sender records the failed delivery |
| Retry delivery | Sender retries the saved delivery after the receiver is available |

## Security

The webhook secret is stored locally in `.env` files and is excluded from GitHub using `.gitignore`.

> This project uses local development values only. No production secrets are included.
