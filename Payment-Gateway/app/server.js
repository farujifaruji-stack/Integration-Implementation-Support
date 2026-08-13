// This test secret API key is a placeholder. Don't include personal details in requests with this key.
// To see your test secret API key in code samples, log in to your Stripe account.
// You can also find your test secret key at https://dashboard.stripe.com/test/apikeys
// Don't put any keys in code. See https://docs.stripe.com/keys-best-practices.
const stripe = require('stripe')('sk_test_51U2y7c2dYITctivNj2Eg2VJzOR7e1UoAXwMX8TjhbY4410XWqtb8wiYOGIZLneUSCKDGHznywRr4OudpoiSARiQZ00wFIgKYwd');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
    integration_identifier: '{{INTEGRATION_ID}}',
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));