# Go-Live Checklist

This checklist confirms that the payment integration is ready to move from Stripe test mode to live mode.

## Testing

- [ ] All planned test cases completed
- [ ] Successful-payment flow passed
- [ ] Declined-payment flow passed
- [ ] Cancelled-checkout flow passed
- [ ] Webhook signature verification passed
- [ ] Duplicate-webhook handling passed
- [ ] Database-update failure handling tested

## Configuration and Security

- [ ] Stripe live Secret key is configured securely
- [ ] Stripe live Publishable key is configured securely
- [ ] Production webhook endpoint is configured
- [ ] Production webhook signing secret is configured securely
- [ ] Test keys are removed from the production environment
- [ ] No keys, passwords, or sensitive data are committed to GitHub
- [ ] Production success and cancel URLs are configured

## Monitoring and Support

- [ ] Logs are saved for every action in the payment flow
- [ ] Payment and webhook failures are monitored
- [ ] A dedicated support email address is set up for client payment issues
- [ ] Support team has access to the troubleshooting documentation
- [ ] Support contacts and escalation process are confirmed

## Rollback Readiness

- [ ] Rollback plan is documented and approved
- [ ] Payment feature can be disabled if a critical issue occurs
- [ ] Team knows who can disable the payment feature
