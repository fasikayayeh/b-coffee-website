const router = require("express").Router();
const Order = require("../models/Order");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// CREATE
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order({ ...req.body, userId: req.user.id });

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE (Admin only to update status, like to "Shipped")
router.put("/:id", verifyAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER ORDERS
router.get("/find/:userId", verifyToken, async (req, res) => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
        try {
            const orders = await Order.find({ userId: req.params.userId });
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only view your own orders");
    }
});

// GET ALL ORDERS (Admin only)
router.get("/", verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
