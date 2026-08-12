# Test Plan

This document defines the payment scenarios to test later: successful payment, declined card, cancelled checkout, invalid webhook signature, duplicate webhook, and failed database update.

| What to test | Expected result | Actual result (pass/fail) |
|---|---|---|
| Successful payment | Payment and order details are saved in the `Orders` and `OrderPayments` tables. | |
| Successful payment | A confirmation message is displayed to the customer. | |
| Successful payment | A receipt is sent to the customer’s email. | |
| Declined card | A message is displayed to the customer asking them to retry. | |
| Declined card | Payment and order details are saved in the `Orders` and `OrderPayments` tables with a failed status. | |
| Cancelled checkout | The customer is redirected to the cancel page. | |
| Cancelled checkout | Payment and order details are saved in the `Orders` and `OrderPayments` tables with the appropriate status. | |
| Invalid webhook signature | The server rejects the webhook and does not update the order or payment record. | |
| Invalid webhook signature | The signature-validation failure is saved in logs. | |
| Duplicate webhook | The event is processed only once; no duplicate payment records or status changes are created. | |
| Failed database update | The failure is saved in logs with the payment and order IDs. | |
| Failed database update | The database update is retried or sent for manual reconciliation. | |
