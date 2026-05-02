require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, req.body);
    next();
});

// Routes
const authRoutes = require("./routes/auth");
const coffeeRoutes = require("./routes/coffee");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");
const userRoutes = require("./routes/users");
const reviewRoutes = require("./routes/reviews");
const contactRoutes = require("./routes/contact");

app.use("/api/auth", authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/coffeoshop", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error: ", err));

app.get("/", (req, res) => {
    res.send("Coffee Shop Full-Stack Website API is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


