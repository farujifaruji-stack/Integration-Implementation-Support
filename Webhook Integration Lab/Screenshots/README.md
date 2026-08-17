## Test evidence

| Scenario | Evidence |
|---|---|
| Basic webhook request sent from Postman | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/01-basic-webhook-request-postman.png) |
| Basic webhook received by the receiver | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/02-basic-webhook-received-receiver.png) |
| Signed webhook request sent from Postman | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/03-signed-webhook-request-postman.png) |
| Webhook signature verified by the receiver | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/04-signed-webhook-verified-receiver.png) |
| Invalid webhook signature rejected with `401 Unauthorized` | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/05-invalid-webhook-signature-401.png) |
| Duplicate webhook event ignored by the receiver | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/06-duplicate-webhook-ignored-receiver.png) |
| Webhook delivery failure returned `502 Bad Gateway` | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/07-webhook-delivery-failed-502.png) |
| Failed webhook delivery retried successfully | [View screenshot](https://github.com/farujifaruji-stack/Integration-Implementation-Support/blob/main/Webhook%20Integration%20Lab/Screenshots/08-webhook-delivery-retry-succeeded.png) |
