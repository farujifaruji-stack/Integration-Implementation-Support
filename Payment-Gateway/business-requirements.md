# Business Requirements

## Project Goal

Implement Stripe card payments for the ShopSphere online store.

## Requirements

- The shop must accept card payments through Stripe.
- The minimum purchase amount is **$10**.
- The maximum purchase amount is **$8,000**.
- If a payment succeeds in Stripe, the order status must update to `Paid` in the database and the customer must see a payment-success message.
- If a payment fails, the order status must update to `Payment Failed` in the database and the customer must see a message asking them to retry.
- The system must not store customer card details. Stripe handles payment-card data securely.
- The integration must use Stripe test mode during development and testing.
- The shop must support payments in USD.
- The customer must receive an order-confirmation message after a successful payment.
- A failed payment must not create a completed order or charge the customer.
