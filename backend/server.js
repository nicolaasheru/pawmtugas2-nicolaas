const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // Import cors
const User = require("./models/User");

const app = express();
require("dotenv").config();
// Middleware untuk membaca data JSON
app.use(express.json());

app.use(cors());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("Error connecting to MongoDB Atlas:", err);
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!token) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    console.log("Verifying Token with SECRET_KEY:", process.env.SECRET_KEY);
    console.log("Token to Verify:", token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Endpoint untuk Register (mendaftar user baru)
app.post("/register", async (req, res) => {
  const {name, email, password } = req.body;

  try {
    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Endpoint untuk Login (verifikasi user)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Membuat JWT token
    console.log("Signing Token with SECRET_KEY:", process.env.SECRET_KEY);
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token ,
      userId : user.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/upgrade-level", authenticate, async (req, res) => {
  const { level } = req.body;

  if (!level || typeof level !== "number" || level <= 0) {
    return res.status(400).json({ message: "Invalid level provided" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { level },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Level upgraded successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/user-progress", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ level: user.level });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Jalankan server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
