# Technical Design

This file lists what the system needs technically: Stripe test account, API keys, webhook endpoint, database fields, and security requirements.

## Stripe Setup

We are creating a Stripe-hosted checkout page:  
https://docs.stripe.com/checkout/quickstart?lang=node

When the customer clicks on Pay, the customer will be redirected to Stripe’s page. After the customer completes or cancels the payment, Stripe will send a webhook with the payment status.

The webhook updates the order as `Paid` or `Payment Failed`.

## API Keys

**Publishable key:** Used by the browser in Stripe.js.

**Secret key:** Used only by Node.js to create Checkout Sessions and call Stripe APIs.

**Webhook signing secret:** Used only by the Node.js server to confirm that the webhook really came from Stripe.

## Webhook Endpoint

- The endpoint route, for example `/webhooks/stripe`
- Stripe sends it a `POST` request
- It handles successful-payment and failed-payment events
- It verifies Stripe’s webhook signature using the webhook signing secret
- It updates the correct order in the database
- It returns a successful HTTP response to Stripe after processing the event
- Failed processing is logged and can be retried

## Database Updates

- The ID of the order from the `Orders` table is sent to Stripe as metadata or a client reference, then returned in the webhook with the payment IDs.
- The `Orders` and `OrderPayments` tables are updated:

| Stage | Table | Action | Field | Value |
|---|---|---|---|---|
| Click on `Pay` | Orders | Update | FlowStep | `ClickPay` |
| Click on `Pay` | Orders | Update | OrderStatus | `null` |
| Click on `Pay` | Orders | Update | DateUpdated | `Date.Now` |
| Click on `Pay` | OrderPayments | Create | ID | `ID_Value` |
| Click on `Pay` | OrderPayments | Create | DateCreated | `Date.Now` |
| Click on `Pay` | OrderPayments | Create | DateUpdated | `null` |
| Click on `Pay` | OrderPayments | Create | PaymentStatus | `null` |
| Click on `Pay` | OrderPayments | Create | Last4Digits | `null` |
| Click on `Pay` | OrderPayments | Create | OrderId | `Orders_Id` |
| Click on `Pay` | OrderPayments | Create | StripePaymentId | `null` |
| Click on `Pay` | OrderPayments | Create | CheckoutSessionId | `null` |
| Redirect to Stripe | Orders | Update | FlowStep | `StripePending` |
| Redirect to Stripe | Orders | Update | OrderStatus | `Pending` |
| Redirect to Stripe | Orders | Update | DateUpdated | `Date.Now` |
| Redirect to Stripe | OrderPayments | Update | CheckoutSessionId | `CKO_Session_Id` |
| Redirect to Stripe | OrderPayments | Update | PaymentStatus | `Due` |
| Redirect to Stripe | OrderPayments | Update | DateUpdated | `Date.Now` |
| Payment Attempt | Orders | Update | FlowStep | `PaymentAttempt` |
| Payment Attempt | Orders | Update | OrderStatus | `Pending` |
| Payment Attempt | Orders | Update | DateUpdated | `Date.Now` |
| Payment Attempt | OrderPayments | Update | Last4Digits | `Last_4_Digits` |
| Payment Attempt | OrderPayments | Update | PaymentStatus | `AuthChallenged` / `Failed` |
| Payment Attempt | OrderPayments | Update | StripePaymentId | `Stripe_Payment_Id` |
| Payment Attempt | OrderPayments | Update | DateUpdated | `Date.Now` |
| Webhook received and processed | Orders | Update | FlowStep | `PaymentAttempt` |
| Webhook received and processed | Orders | Update | OrderStatus | `Paid` / `PaymentFailed` |
| Webhook received and processed | Orders | Update | DateUpdated | `Date.Now` |
| Webhook received and processed | OrderPayments | Update | PaymentStatus | `Auth` / `Failed` |
| Webhook received and processed | OrderPayments | Update | DateUpdated | `Date.Now` |

> **Note:** This table documents the backend processing stages. Final payment-status updates occur after the Stripe webhook is received and processed.

- **Order status:** `null`, `Pending`, `Paid`, `PaymentFailed`, `canceled`
- **Payment status:** `null`, `Due`, `AuthChallenged`, `Auth`, `Failed`,`canceled`
- There are defined final statuses that are not allowed to change.

## Audit and Troubleshooting Data

| Data | Purpose |
|---|---|
| `DateCreated` | Records when the payment record was created. |
| `DateUpdated` | Records when the payment record was last updated. |
| `OrderId` | Links the payment record to the correct order. |
| `StripePaymentId` | Links the record to the Stripe payment. |
| `CheckoutSessionId` | Links the record to the Stripe Checkout Session. |
| `StripeEventId` | Identifies the webhook event and prevents duplicate processing. |
| `PaymentStatus` | Shows the current payment status. |
| `FlowStep` | Shows the latest backend processing stage. |
| `Last4Digits` | Identifies the card used without storing full card details. |
| `FailureReason` | Stores the reason when a payment or webhook process fails. |

## Security

- Keep Stripe keys out of code and GitHub
- Separate test and live credentials, keys, and passwords
- Protect the communication between the app and Stripe
- Verify that incoming webhooks are genuinely from Stripe
- Avoid collecting or storing card details
- Validate payment amounts and order data on the server
- Prevent duplicate payment processing
- Limit access to payment configuration and logs
- Avoid exposing sensitive data in error messages, logs, or screenshots

## Error Handling

### How the system detects errors

Use cases, status codes, and general error handling at multiple levels: code, API, webhook, and database.

### What happens to the order/payment record

All available error data is saved. Existing payment and order records are updated with the relevant failure status or failure reason.

### What the customer sees

A specific error message or a general error page.

### What is logged for troubleshooting

All database data is used for troubleshooting. Every backend or frontend action is saved in logs. Sensitive data is censored.

### Retry or manual support

If the failure is caused by too many requests, the system retries. If the system sends a request to Stripe and does not receive a response, the system retries.
