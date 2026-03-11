const router = require("express").Router();
const Review = require("../models/Review");
const { verifyToken } = require("../middleware/auth");

// CREATE REVIEW
router.post("/", verifyToken, async (req, res) => {
    try {
        // Check if user already reviewed this coffee
        const existingReview = await Review.findOne({
            userId: req.user.id,
            coffeeId: req.body.coffeeId,
        });

        if (existingReview) {
            return res.status(400).json("You have already reviewed this coffee.");
        }

        const newReview = new Review({
            ...req.body,
            userId: req.user.id,
        });

        const savedReview = await newReview.save();

        // Populate user details for returning
        const populatedReview = await savedReview.populate('userId', 'name');
        res.status(201).json(populatedReview);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET REVIEWS FOR A COFFEE
router.get("/:coffeeId", async (req, res) => {
    try {
        const reviews = await Review.find({ coffeeId: req.params.coffeeId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE REVIEW
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json("Review not found");

        if (review.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json("You can only delete your own reviews");
        }

        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json("Review deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
