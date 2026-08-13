This documents how to investigate and resolve likely payment-integration problems, such as failed Checkout Session creation, invalid keys, declined payments, missing webhooks, invalid webhook signatures, duplicate events, and database-update failures.


| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| ClickPay | Error | null | The customer encountered an error before/during redirecting to Stripe |
| StripePending | null/Error | null/Error | Something went wrong that customer got an error, or the status didn't update |
| PaymentAttempt | Pending/Error | Due/Error | Something went wrong that customer got an error, or something went wrong in authorizing |
| PaymentAttempt | Paid | Void/Refund | The order status doesn't match the payment status |
| PaymentAttempt | PaymentFailed | Auth/Void/Refund | The order status doesn't match the payment status |
| * | Refunded | Anything but 'Refund' | The order status doesn't match the payment status |
| * | Canceled | Anything but: Canceled, Void, Failed | The order status doesn't match the payment status |

Failed Checkout Session creation
| FlowStep | OrderStatus | PaymentStatus | Explanation |
|---|---|---|---|
| ClickPay | Error | null | The customer encountered an error before/during redirecting to Stripe |
| StripePending | Pending | - | The checkout session id is not updated in the DB | 

Invalid keys


Declined payments

Missing webhooks

Invalid webhook signatures

Duplicate events

Database-update failures
