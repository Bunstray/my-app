import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // adjust to your frontend dev URL (vite default)
  })
);

async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

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
      return res.status(404).json({ message: "User not found" }); //test

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// CREATE EVENT (Admin Only)
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

    // ✔ correct single response
    return res.json({
      success: true,
      eventId: result.insertId,
    });
  } catch (err) {
    console.error("Event creation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET ALL EVENTS
app.get("/events", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM events ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Events error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET EVENT BY ID
app.get("/event/:id", async (req, res) => {
  const { id } = req.params;
  const rows = await query("SELECT * FROM events WHERE id = ?", [id]);

  if (rows.length === 0)
    return res.status(404).json({ message: "Event not found" });

  res.json(rows[0]);
});
