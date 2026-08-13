This documents how to investigate and resolve likely payment-integration problems, such as failed Checkout Session creation, invalid keys, declined payments, missing webhooks, invalid webhook signatures, duplicate events, and database-update failures.


| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| ClickPay | Error | null |  |
| StripePending | null/Error | null/Error |  |
| PaymentAttempt | Pending/Error | Due/Error |  |
| PaymentAttempt | Paid | Void/Refund |  |
| PaymentAttempt | PaymentFailed | Auth/Void/Refund |  |
