# Troubleshooting

This document explains how to investigate and resolve likely payment-integration problems, such as failed Checkout Session creation, invalid keys, declined payments, missing webhooks, invalid webhook signatures, duplicate events, and database-update failures.

## Status Mismatch Checks

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| ClickPay | Error | `null` | The customer encountered an error before or during redirecting to Stripe. |
| StripePending | `null` / Error | `null` / Error | Something went wrong, the customer got an error, or the status did not update. |
| PaymentAttempt | Pending / Error | Due / Error | Something went wrong, the customer got an error, or something went wrong during authorization. |
| PaymentAttempt | Paid | Void / Refund | The order status does not match the payment status. |
| PaymentAttempt | PaymentFailed | Auth / Void / Refund | The order status does not match the payment status. |
| * | Refunded | Anything but Refund | The order status does not match the payment status. |
| * | Canceled | Anything but Canceled, Void, or Failed | The order status does not match the payment status. |

## Failed Checkout Session Creation

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| ClickPay | Error | `null` | The customer encountered an error before or during redirecting to Stripe. |
| StripePending | Pending | - | The Checkout Session ID was not updated in the database. |

### What to Check

- Check the Stripe API response and status code.
- Check that the order amount is valid.
- Check that the currency is valid.
- Check that the Stripe Secret key is available in the environment variables.
- Check that the `CheckoutSessionId` was saved after Stripe created the session.
- Check application logs for the order ID and error message.

## Invalid Keys

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| ClickPay | Error | `null` | Stripe rejected the request because the Secret key is missing, invalid, expired, or from the wrong environment. |

### What to Check

- Check that the Secret key is stored in the environment variables.
- Check that a test key is used in test mode.
- Check that a live key is used only in live mode.
- Check that the key was not copied with extra spaces or missing characters.
- Check the Stripe API response and application logs.

## Declined Payments

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| PaymentAttempt | Error | Declined | The order was marked as an error after the payment was declined. |

### What to Check

- Check the Stripe payment status and decline reason.
- Check that the payment record contains the Stripe Payment ID.
- Check that the order was not marked as Paid.
- Check that the customer received a message asking them to try again.
- Check logs for the order ID, payment ID, and failure reason.

## Missing Webhooks

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| StripePending | Pending | Due | Stripe completed or failed the payment, but the webhook did not reach the application. |

### What to Check

- Check that the webhook endpoint URL is correct.
- Check that the Node.js app is running.
- Check the Stripe Dashboard or Stripe CLI for webhook delivery attempts.
- Check the endpoint response status.
- Check application logs for incoming webhook requests.
- Retry the webhook event after the endpoint issue is fixed.

## Invalid Webhook Signatures

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| StripePending | Pending | Due | The webhook was received but rejected because the signature could not be verified. |

### What to Check

- Check that the webhook signing secret is correct.
- Check that the webhook signing secret belongs to the correct environment.
- Check that the raw webhook request body is used for signature verification.
- Check application logs for the signature validation error.
- Do not update the order or payment status when signature validation fails.

## Duplicate Events

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| * | Any | Any | Stripe sent the same webhook event more than once. The event must not update the order or payment record twice. |

### What to Check

- Check the Stripe Event ID.
- Check whether the Event ID was already saved in the database.
- Check that the webhook handler ignores events that were already processed.
- Check that no duplicate payment records or receipts were created.

## Database-Update Failures

| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| Webhook received | Pending | Auth / Failed | Stripe sent the payment result, but the application could not update the database. |

### What to Check

- Check database connection and database error logs.
- Check that the order ID and Stripe IDs match an existing payment record.
- Check that final statuses are not being overwritten.
- Check that the failure reason was saved in logs.
- Retry the database update or send the case for manual support and reconciliation.
