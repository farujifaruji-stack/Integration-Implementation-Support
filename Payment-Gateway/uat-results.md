# UAT Results

Completed test results for the Stripe payment integration.

| What to test | Expected result | Actual result | Test date | Evidence |
|---|---|---|---|---|
| Successful payment | Stripe Checkout accepts a valid test card and completes the payment. | **Pass** — Test payment completed successfully. | 16/08/2026 | Add successful Checkout screenshot |
| Successful payment | A confirmation message is displayed to the customer. | **Pass** — Customer was redirected to `success.html`. | 16/08/2026 | Add success-page screenshot |
| Successful payment webhook | Stripe sends `checkout.session.completed` to the local webhook endpoint. | **Pass** — Webhook was received and returned HTTP `200`. | 16/08/2026 | Add Node and Stripe CLI screenshots |
| Declined card | Stripe declines the payment and displays an error to the customer. | **Pass** — Stripe displayed the declined-card message. | 16/08/2026 | Add declined-payment screenshot |
| Refund | A completed test payment can be refunded. | **Pass** — Full $20.00 test payment was refunded in Stripe Dashboard. | 16/08/2026 | Add refunded-payment screenshot |
| Manual authorization | Payment is authorized without being captured automatically. | **Pass** — Manual-capture Checkout flow was tested. | 16/08/2026 | Add authorized-payment screenshot |
| Capture payment | An authorized payment can be captured. | **Pass** — Authorized payment was captured in Stripe Dashboard. | 16/08/2026 | Add captured-payment screenshot |
| Void payment | An authorized payment can be cancelled before capture. | **Pass** — Authorized payment was cancelled/voided in Stripe Dashboard. | 16/08/2026 | Add voided-payment screenshot |
| Database updates | Order and payment records are updated in `Orders` and `OrderPayments`. | **Not implemented** — This portfolio version does not include a database. | — | — |
| Email receipt | A receipt is sent to the customer’s email. | **Not tested** — Email receipts were not configured. | — | — |
| Cancelled checkout | Customer is redirected to a dedicated cancel page. | **Not tested** — A dedicated cancel page was not implemented. | — | — |
| Invalid webhook signature | Server rejects an invalid signature and logs the failure. | **Not tested** — Signature-failure scenario was not simulated. | — | — |
| Duplicate webhook | Event is processed only once. | **Not implemented** — Duplicate-event handling was not added. | — | — |
| Database-update failure | Failed database update is logged and retried. | **Not implemented** — This portfolio version does not include a database. | — | — |
