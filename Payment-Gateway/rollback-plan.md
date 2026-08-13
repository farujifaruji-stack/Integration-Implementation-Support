# Rollback Plan

This document explains what the team does if a critical production problem happens after the payment integration goes live.

## When to Disable Payments

Payments must be disabled if any of the following issues occur:

- Duplicate charges are reported.
- Many customers cannot complete payments.
- Orders are marked as `Paid` without a successful Stripe payment.
- Successful Stripe payments do not update the order status.
- A security issue is identified.
- Webhook events are not being processed correctly.

## How to Prevent New Charges

- Disable the **Pay** button in ShopSphere.
- Stop the application from creating new Stripe Checkout Sessions.
- Display a maintenance message to customers.
- Keep existing order and payment records available for support and investigation.
- Do not delete payment records during the rollback.

## How to Handle Pending Orders

- Identify all orders with `Pending`, `PaymentAttempt`, or incomplete payment statuses.
- Check the matching Checkout Session and Payment ID in Stripe.
- Confirm whether the payment succeeded, failed, was cancelled, voided, or refunded.
- Update the `Orders` and `OrderPayments` records with the correct final status.
- Escalate orders that cannot be reconciled automatically.
- Contact affected customers when required.

## Responsibilities

| Role | Responsibility |
|---|---|
| Implementation Owner | Coordinates rollback actions and communicates the issue status. |
| Developer / On-Call Engineer | Disables payments, investigates the technical issue, and applies the fix. |
| Support Lead | Handles customer communication and tracks affected orders. |
| Business Approver | Approves disabling payments and approving the return to service. |

## How to Return Safely to Service

1. Identify and fix the root cause.
2. Review and reconcile all affected pending orders.
3. Test the fix in Stripe test mode.
4. Rerun the related payment, webhook, and database-update tests.
5. Confirm that no duplicate charges or incorrect order updates occur.
6. Receive approval from the business approver.
7. Enable the Pay button and Checkout Session creation.
8. Monitor payments, webhooks, logs, and customer support tickets closely after re-enabling the service.

## Rollback Completion Checklist

- [ ] Payments are disabled when required.
- [ ] New Checkout Sessions cannot be created.
- [ ] Pending orders are identified.
- [ ] Affected payments are reconciled with Stripe.
- [ ] The root cause is fixed.
- [ ] Related tests have passed.
- [ ] Business approval was received.
- [ ] Payments are enabled again.
- [ ] Post-rollback monitoring is active.
