const router = require("express").Router();
const Stripe = require("stripe");
// Add a dummy key for testing if env is missing
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51O1_dummy_key_for_testing_12345");
const { verifyToken } = require("../middleware/auth");

router.post("/create-payment-intent", verifyToken, async (req, res) => {
    try {
        const { items, totalPrice } = req.body;

        // Stripe expects amount in cents
        const amountInCents = Math.round(totalPrice * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            // In a real app, you would pass the customer email, handle webhooks etc.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
