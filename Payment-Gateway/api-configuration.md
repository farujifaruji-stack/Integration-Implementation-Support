# API Configuration

This document explains how the ShopSphere Node.js app connects to Stripe, including the API base, authentication method, required keys, Checkout Session request, and expected response.

## API Base

```text
https://api.stripe.com
```

## Authentication Method

The Node.js Stripe SDK authenticates API requests using the Stripe Secret key.

## Required Keys

- **Secret key:** Used by the Node.js server to create Checkout Sessions and call Stripe APIs.
- **Publishable key:** Used by the browser with Stripe.js when required.

> **Note:** Actual key values are stored locally in environment variables and are never committed to GitHub.

## Checkout Session Request

When a customer clicks **Pay**, the Node.js server creates a Stripe Checkout Session.

```http
POST https://api.stripe.com/v1/checkout/sessions
Authorization: Bearer sk_test_your_secret_key
Content-Type: application/x-www-form-urlencoded
```

### Request Body

```text
mode=payment
line_items[0][price_data][currency]=order_currency
line_items[0][price_data][unit_amount]=order_amount_in_cents
line_items[0][price_data][product_data][name]=order_description
line_items[0][quantity]=1
client_reference_id=order_id
success_url=https://shopsphere.example/success?session_id={CHECKOUT_SESSION_ID}
cancel_url=https://shopsphere.example/cancel
```

## Expected Response

Stripe returns a Checkout Session object containing:

- A Checkout Session ID, such as `cs_test_...`
- A hosted Stripe Checkout URL
- The Checkout Session status
- The client reference ID for the ShopSphere order

The Node.js app stores the Checkout Session ID in the `OrderPayments` table and redirects the customer to the hosted Stripe Checkout URL.
