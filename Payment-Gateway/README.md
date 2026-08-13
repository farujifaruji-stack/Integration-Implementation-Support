# Payment Gateway Integration & Go-Live

A technical implementation portfolio project for ShopSphere, a fictional online store integrating Stripe-hosted Checkout for card payments.

## Project Goal

Enable ShopSphere customers to pay securely by card through Stripe.

The integration creates a Stripe Checkout Session, redirects the customer to Stripe’s hosted payment page, receives payment updates through webhooks, and updates ShopSphere order and payment records.

## Payment Flow

```text
Customer clicks Pay
        ↓
ShopSphere creates payment and order records
        ↓
ShopSphere creates a Stripe Checkout Session
        ↓
Customer is redirected to Stripe-hosted Checkout
        ↓
Customer completes, fails, or cancels payment
        ↓
Stripe sends a webhook to ShopSphere
        ↓
ShopSphere verifies the webhook and updates order/payment status
        ↓
Customer receives a confirmation, error, or cancellation message
```

## Key Requirements

- Card payments are processed through Stripe.
- Minimum purchase amount: `$10`.
- Maximum purchase amount: `$8,000`.
- Currency: USD.
- Successful payments update the order to `Paid`.
- Failed payments update the order to `PaymentFailed`.
- Canceled orders follow the cancellation, void, or refund process.
- Card details are handled by Stripe and are not stored by ShopSphere.

## Technology

- Stripe Checkout
- Stripe Webhooks
- Node.js
- HTML
- REST APIs
- JSON
- GitHub
- Jira

## Documentation

| Document | Description |
|---|---|
| [Business Requirements](business-requirements.md) | Business goals, payment rules, and requirements. |
| [Payment Flow](payment-flow.md) | Customer and backend payment flow. |
| [Technical Design](technical-design.md) | Architecture, database updates, security, and error handling. |
| [API Configuration](api-configuration.md) | Stripe API connection and Checkout Session configuration. |
| [Webhook Configuration](webhook-configuration.md) | Webhook events, signature verification, and local testing. |
| [Test Plan](test-plan.md) | Planned payment, webhook, and database test cases. |
| [UAT Results](uat-results.md) | Actual test results and evidence after implementation. |
| [Troubleshooting](troubleshooting.md) | Investigation steps for common payment issues. |
| [Go-Live Checklist](go-live-checklist.md) | Production readiness checklist. |
| [Rollback Plan](rollback-plan.md) | Actions for critical production issues. |
| [Monitoring Runbook](monitoring-runbook.md) | Post-launch monitoring and escalation process. |
| [Handover Document](handover-document.md) | Support and operations handover details. |

## Project Structure

```text
Payment-Gateway/
├── jira/
├── logs/
├── screenshots/
├── README.md
├── api-configuration.md
├── business-requirements.md
├── go-live-checklist.md
├── handover-document.md
├── monitoring-runbook.md
├── payment-flow.md
├── rollback-plan.md
├── technical-design.md
├── test-plan.md
├── troubleshooting.md
├── uat-results.md
└── webhook-configuration.md
```

## Implementation Status

- [x] Business requirements documented
- [x] Payment flow documented
- [x] Technical design documented
- [x] API configuration documented
- [x] Webhook configuration documented
- [x] Test plan documented
- [x] Troubleshooting guide documented
- [x] Go-live, rollback, monitoring, and handover documentation created
- [ ] Node.js application implemented
- [ ] Stripe test mode configured
- [ ] Webhook tested locally
- [ ] UAT results completed
- [ ] Logs and screenshots added
- [ ] Jira cases added

## Disclaimer

This is a simulated portfolio project created for learning and demonstration purposes. No real customer, payment, card, or production credentials are included.
