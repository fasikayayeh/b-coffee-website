const router = require("express").Router();
const Coffee = require("../models/Coffee");
const { verifyAdmin } = require("../middleware/auth");

// CREATE COFFEE (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
    const newCoffee = new Coffee(req.body);
    try {
        const savedCoffee = await newCoffee.save();
        res.status(201).json(savedCoffee);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE COFFEE (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
    try {
        const updatedCoffee = await Coffee.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedCoffee);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE COFFEE (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
    try {
        await Coffee.findByIdAndDelete(req.params.id);
        res.status(200).json("Coffee has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET COFFEE
router.get("/find/:id", async (req, res) => {
    try {
        const coffee = await Coffee.findById(req.params.id);
        res.status(200).json(coffee);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL COFFEE
router.get("/", async (req, res) => {
    const qCategory = req.query.category;
    try {
        let coffees;

        if (qCategory) {
            coffees = await Coffee.find({
                category: {
                    $in: [qCategory],
                },
            });
        } else {
            coffees = await Coffee.find();
        }

        res.status(200).json(coffees);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
