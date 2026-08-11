This file lists what the system needs technically: Stripe test account, API keys, webhook endpoint, database fields, and security requirements.

Stripe setup

We are creating a Stripe-hosted checkout page
https://docs.stripe.com/checkout/quickstart?lang=node
When the customer clicks on pay, the customer will be redirected to Stripe page, after the customer completes or cancels the payment, Stripe will send us a webhook with the status of the payment.
The webhook is what updates the order as Paid or Payment Failed


API keys
Public key: It is used by the browser. used in Stripe.js

Private key: Used only by Node.js to create checkout session and call Stripe APIs.

Webhook key: Used only by Node.js server to confirm that the webhook really came from Stripe.



webhook endpoint

- The endpoint route, for example /webhooks/stripe
- That Stripe sends it a POST request
- Which payment events it handles: successful payment and failed payment
- That it verifies Stripe’s webhook signature using the webhook signing secret
- That it updates the correct order in the database
- That it returns a successful HTTP response to Stripe after processing the event
- That failed processing is logged and can be retried


database updates
- The id of the order from Orders table in the DB is sent in the request to Stripe, and it is sent back in the webhook from Stripe.
- Which fields change during each stage of payment
- Orders table will be updated:
* 
- The possible payment/order states
- When each state changes
- How the Stripe payment or checkout ID is stored so the webhook is matched to the correct order
- What happens if the same webhook is sent more than once
- What is saved for auditing and troubleshooting, such as timestamps or failure rea



security




error handling
