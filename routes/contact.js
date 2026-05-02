const router = require("express").Router();
const Contact = require("../models/Contact");

// SUBMIT CONTACT FORM
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }

        const newContact = new Contact({
            name,
            email,
            message,
        });

        const savedContact = await newContact.save();
        return res.status(201).json({
            message: "Contact form submitted successfully.",
            contact: savedContact,
        });
    } catch (err) {
        console.error("Contact submission error:", err);
        return res.status(500).json({ message: "Server error during contact submission." });
    }
});

// GET ALL CONTACTS (Admin only - optional)
router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;