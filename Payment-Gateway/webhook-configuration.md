# Webhook Configuration

This document explains how Stripe sends payment events to the ShopSphere app, how the app verifies and processes these events, and how the webhook is tested locally.

## Webhook Flow

```text
Customer completes payment
        ↓
Stripe sends an HTTP POST request to the webhook endpoint
        ↓
ShopSphere verifies the Stripe signature
        ↓
ShopSphere updates the order and payment records
        ↓
ShopSphere returns a successful HTTP response to Stripe
        ↓
ShopSphere sends the customer receipt or order-confirmation details
```

## Webhook Endpoint

```http
POST /webhooks/payment
Content-Type: application/json
```

Stripe sends JSON event data to this endpoint. The event includes an event ID, event type, and Checkout Session/payment details.

## Events Handled

| Stripe event | Action |
|---|---|
| `checkout.session.completed` | Confirm payment and update the order to `Paid`. |
| `checkout.session.async_payment_failed` | Update the order to `PaymentFailed`. |
| `payment_intent.payment_failed` | Save the payment failure reason for troubleshooting. |

## Webhook Processing

The server must:

1. Receive the Stripe webhook.
2. Verify its signature with the webhook signing secret.
3. Check the event ID to prevent duplicate processing.
4. Match the Checkout Session or order reference to the correct order.
5. Update the payment and order records.
6. Return a `2xx` response after successful processing.

## Basic Node.js Example

```js
app.post("/webhooks/payment", express.raw({ type: "application/json" }), (req, res) => {
  const signature = req.headers["stripe-signature"];

  // Verify the event using the webhook signing secret.
  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SIGNING_SECRET
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Use session.client_reference_id to find the ShopSphere order.
    // Update the order and payment records to Paid.
    console.log(`Order ${session.client_reference_id} was paid.`);
  }

  res.sendStatus(200);
});
```

## Local Testing

1. Run the ShopSphere Node.js app locally.
2. Use the Stripe CLI to forward Stripe events to the local webhook endpoint.
3. Copy the webhook signing secret produced by the Stripe CLI into the local environment variables.
4. Complete a test payment.
5. Verify the webhook event, database updates, and logs.

## Production Rules

- **Verify signatures:** Do not trust webhook data until the Stripe signature is verified.
- **Handle duplicates:** Store the Stripe event ID and process each event only once.
- **Respond quickly:** Return a `2xx` response promptly; log or process longer tasks safely afterward.
- **Use webhooks for final status:** The webhook—not the customer’s return page—is the reliable source for the final payment result.

## Key Concept

An API request is when ShopSphere asks Stripe for information or creates a Checkout Session. A webhook is when Stripe sends ShopSphere a payment update automatically.
