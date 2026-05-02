const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();
        const { password: pwd, ...userWithoutPassword } = savedUser._doc;

        // Generate token for auto-login
        const token = jwt.sign(
            { id: savedUser._id, isAdmin: savedUser.isAdmin },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "3d" }
        );

        return res.status(201).json({
            message: "User registered successfully.",
            user: userWithoutPassword,
            token,
        });
    } catch (err) {
        console.error("Register error:", err);
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email is already registered." });
        }
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Server error during registration." });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Wrong credentials." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Wrong credentials." });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "3d" }
        );

        const { password: pwd, ...others } = user._doc;
        return res.status(200).json({ ...others, token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;
