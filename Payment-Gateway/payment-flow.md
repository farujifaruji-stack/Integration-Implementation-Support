# Payment Flow

## Overview

This document describes what happens from the moment a customer clicks **Pay** until the order is marked as paid or failed.

## Payment Process

1. The customer clicks **Pay**.
2. `FlowStep` is updated to `ClickedPay` in the database.
3. `OrderStatus` is updated to `Pending` in the database.
4. An API request is sent to Stripe to authorize the payment.
5. `FlowStep` is updated to `StripePending` in the database.
6. Stripe sends a webhook event with the payment status: successful or failed.
7. `OrderStatus` is updated to `Paid` or `Payment Failed` in the database.
8. `FlowStep` is updated to `Authed` or `AuthFailed` in the database.

## Customer Message

### Successful payment

```text
Payment was successful.
```

### Failed payment

```text
Payment failed. Please try again.
```
