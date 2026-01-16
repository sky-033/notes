


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import connectDB from "./database/db.js";
import User from "./models/user.model.js";
import Note from "./models/notes.model.js";
import authenticateToken from "./utilities.js";

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://notes-chi-henna.vercel.app",
  "https://notes-jmulnyunx-sujals-projects-5583469b.vercel.app",

];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / Postman / Thunder Client
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ REQUIRED FOR PREFLIGHT REQUESTS
app.options("*", cors());

/* =======================
   ROUTES
======================= */

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

/* ---------- AUTH ---------- */

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      error: false,
      message: "Account created successfully",
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and password are required",
    });
  }
  
  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      error: false,
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

/* ---------- USER ---------- */

app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    res.json({ error: false, user });
  } catch (err) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

/* ---------- NOTES ---------- */

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: true,
      message: "Title and content are required",
    });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: req.user.userId,
    });

    await note.save();

    res.status(201).json({
      error: false,
      message: "Note added successfully",
      note,
    });
  } catch (err) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({
      isPinned: -1,
    });

    res.json({ error: false, notes });
  } catch (err) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

/* =======================
   SERVER
======================= */

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
});
