# Monitoring Runbook

This document explains how the ShopSphere payment integration is monitored after go-live.

## What to Monitor

- Successful payments
- Failed or declined payments
- Cancelled checkouts
- Checkout Session creation failures
- Webhook deliveries
- Invalid webhook signatures
- Duplicate webhook events
- Database-update failures
- Pending orders that are not updated
- Refund and void requests
- Customer payment-support tickets

## Monitoring Data

| Area | What to Check | Expected Result |
|---|---|---|
| Orders | `OrderStatus` | Orders move from `Pending` to `Paid`, `PaymentFailed`, `Canceled`, or `Refunded`. |
| Payments | `PaymentStatus` | Payment records show the correct current payment status. |
| Checkout Sessions | `CheckoutSessionId` | A Checkout Session ID is saved for each payment attempt. |
| Stripe Payments | `StripePaymentId` | Stripe payment IDs are saved when available. |
| Webhooks | `StripeEventId` | Each webhook event is processed only once. |
| Logs | Error messages and timestamps | Errors are logged with order and payment IDs where available. |
| Support | Payment-related tickets | Customer issues are reviewed and linked to the correct order. |

## Daily Checks

- [ ] Review failed and declined payment attempts.
- [ ] Review pending orders older than the expected payment time.
- [ ] Review webhook failures and invalid signature errors.
- [ ] Review database-update failures.
- [ ] Review duplicate webhook events.
- [ ] Review new payment-support tickets.
- [ ] Confirm that
