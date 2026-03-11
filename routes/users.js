const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// GET USER PROFILE
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json("User not found");

        // Get user's orders
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({ user, orders });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL USERS (Admin only)
router.get("/", verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ADMIN STATS (Admin only)
router.get("/stats", verifyAdmin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        res.status(200).json({
            totalOrders,
            totalUsers,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
