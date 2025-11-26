import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool from "./db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

console.log("🔄 System initializing...");

dotenv.config();

// --- CRITICAL DEBUGGING: Check .env loading ---
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  console.error("❌ FATAL ERROR: GMAIL_USER or GMAIL_PASS is missing.");
  console.error("👉 Make sure you have a .env file in the 'backend' folder.");
} else {
  console.log("✅ Gmail credentials loaded for:", process.env.GMAIL_USER);
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
  })
);

// DB Helper
async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// --- EMAIL CONFIGURATION (GMAIL) ---
// This uses Gmail's official servers. It requires an App Password.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your 16-char App Password (no spaces)
  },
});

// --- AUTH ROUTES ---

app.post("/register", async (req, res) => {
  try {
    const { email, username, password, conpassword } = req.body;
    if (!email || !username || !password || !conpassword) {
      return res.status(400).json({ message: "Please provide all fields." });
    }
    if (password !== conpassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const existing = await query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashed]
    );

    return res.json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const rows = await query(
      "SELECT id, email, username, password, role FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// --- FORGOT PASSWORD (REAL INBOX) ---
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const users = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res
        .status(200)
        .json({ message: "If email exists, reset link sent." });
    }

    const user = users[0];

    const token = crypto.randomBytes(20).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await query(
      "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
      [token, expires, email]
    );

    const resetLink = `http://localhost:5173/change-password?token=${token}`;

    const mailOptions = {
      from: `"MyJemparingan Support" <${process.env.GMAIL_USER}>`,
      to: email, // This will go to the REAL inbox
      subject: "Reset Password - MyJemparingan",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FFF6EA;">
          <h2 style="color: #0B132B;">Reset Password</h2>
          <p>Halo <strong>${user.username}</strong>,</p>
          <p>Kami menerima permintaan untuk mereset password Anda.</p>
          <p>Klik tombol di bawah ini untuk membuat password baru:</p>
          <a href="${resetLink}" style="background-color: #0B132B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          <p style="margin-top: 15px; font-size: 12px; color: #666;">Link ini berlaku selama 1 jam.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);

    res.status(200).json({ message: "Reset link sent successfully." });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Server error sending email" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password required" });
  }

  try {
    const users = await query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    const user = users[0];

    const hashed = await bcrypt.hash(newPassword, 10);

    await query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashed, user.id]
    );

    res.json({ message: "Password successfully reset! Please login." });
  } catch (err) {
    console.error("Reset PW Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- EVENT ROUTES ---
app.post("/events", async (req, res) => {
  try {
    const { title, date, category, banner, created_by } = req.body;
    if (!title || !date || !category) {
      return res.status(400).json({ message: "Incomplete data" });
    }
    const sql = `
      INSERT INTO events (title, date, category, banner, created_by, status)
    VALUES (?, ?, ?, ?, ?, 'uncompleted')
    `;
    const result = await query(sql, [
      title,
      date,
      category,
      banner,
      created_by,
    ]);
    return res.json({ success: true, eventId: result.insertId });
  } catch (err) {
    console.error("Event creation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM events ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/event/:id", async (req, res) => {
  const { id } = req.params;
  const rows = await query("SELECT * FROM events WHERE id = ?", [id]);
  if (rows.length === 0)
    return res.status(404).json({ message: "Event not found" });
  res.json(rows[0]);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error("👉 Kill the terminal (Ctrl+C) or restart VS Code.");
  } else {
    console.error("❌ Server failed to start:", err);
  }
});
