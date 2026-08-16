require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();

const YOUR_DOMAIN = 'http://localhost:4242';

// Stripe must receive the original request body to verify its signature.
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log('Payment succeeded');
    console.log('Checkout Session ID:', session.id);
    console.log('Payment Intent ID:', session.payment_intent);

    // Later, this is where ShopSphere updates the order as Paid.
  }

  res.sendStatus(200);
});

// Serves checkout.html, success.html, and other public files.
app.use(express.static('public'));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1U470bGVdCMLp32LEON34Eju',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/checkout.html`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.log('Checkout Session creation failed:', error.message);
    res.status(500).send('Unable to start checkout.');
  }
});

app.listen(4242, () => console.log('Running on port 4242'));