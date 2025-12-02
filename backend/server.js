import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import pool from "./db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

console.log("🔄 System initializing...");

dotenv.config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- DB HELPER ---
async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ==========================================
// AUTH & USER ROUTES
// ==========================================

app.post("/register", async (req, res) => {
  try {
    const { email, username, password, conpassword } = req.body;
    if (!email || !username || !password || !conpassword) {
      return res.status(400).json({ message: "Please provide all fields." });
    }
    if (password !== conpassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const existing = await query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ message: "Email or Username already registered." });
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
    const { identifier, password } = req.body;

    if (!identifier || !password)
      return res.status(400).json({ message: "Missing fields" });

    const rows = await query(
      "SELECT id, email, username, password, role FROM users WHERE email = ? OR username = ?",
      [identifier, identifier]
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

// --- PASSWORD RESET ---
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
      to: email,
      subject: "Reset Password - MyJemparingan",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FFF6EA;">
          <h2 style="color: #0B132B;">Reset Password</h2>
          <p>Halo <strong>${user.username}</strong>,</p>
          <p>Klik tombol di bawah ini untuk membuat password baru:</p>
          <a href="${resetLink}" style="background-color: #0B132B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset link sent successfully." });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Server error sending email" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    return res.status(400).json({ message: "Token/PW required" });

  try {
    const users = await query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()",
      [token]
    );
    if (users.length === 0)
      return res.status(400).json({ message: "Invalid/Expired token" });

    const user = users[0];
    const hashed = await bcrypt.hash(newPassword, 10);
    await query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
      [hashed, user.id]
    );
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset PW Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/change-password-logged-in", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const users = await query("SELECT * FROM users WHERE id = ?", [userId]);
    if (users.length === 0)
      return res.status(404).json({ message: "User not found" });
    const user = users[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password lama salah!" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change PW Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==========================================
// REGULAR USER EVENT ROUTES
// ==========================================

app.get("/event/:eventId/user-status/:userId", async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const sql = `
      SELECT p.id, b.name as bandul_name 
      FROM participants p
      JOIN bandul b ON p.bandul_id = b.id
      WHERE b.event_id = ? AND p.user_id = ?
    `;
    const rows = await query(sql, [eventId, userId]);

    if (rows.length > 0) {
      res.json({ isRegistered: true, data: rows[0] });
    } else {
      res.json({ isRegistered: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error checking status" });
  }
});

app.post("/join-event", async (req, res) => {
  try {
    const { userId, bandulId, eventId } = req.body;

    const checkSql = `
      SELECT p.id FROM participants p
      JOIN bandul b ON p.bandul_id = b.id
      WHERE b.event_id = ? AND p.user_id = ?
    `;
    const existing = await query(checkSql, [eventId, userId]);

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Anda sudah terdaftar di acara ini." });
    }

    await query("INSERT INTO participants (bandul_id, user_id) VALUES (?, ?)", [
      bandulId,
      userId,
    ]);

    res.json({ success: true, message: "Berhasil mendaftar!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Gagal mendaftar. Pastikan bandul valid." });
  }
});

app.get("/user/:userId/joined-events", async (req, res) => {
  try {
    const { userId } = req.params;
    // Explicitly select columns to avoid ID ambiguity
    const sql = `
      SELECT 
        e.id as eventId, 
        e.title, e.date, e.category, e.banner, e.status,
        b.name as bandul_name
      FROM events e
      JOIN bandul b ON e.id = b.event_id
      JOIN participants p ON b.id = p.bandul_id
      WHERE p.user_id = ?
      ORDER BY e.date DESC
    `;
    const rows = await query(sql, [userId]);
    // console.log("Sending joined events for user", userId, ":", rows);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching joined events" });
  }
});

// ==========================================
// JEMPARINGAN GAMEPLAY ROUTES
// ==========================================

app.get("/event/:eventId/bandul", async (req, res) => {
  try {
    const { eventId } = req.params;
    const rows = await query("SELECT * FROM bandul WHERE event_id = ?", [
      eventId,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bandul" });
  }
});

app.get("/bandul/:bandulId/participants", async (req, res) => {
  try {
    const { bandulId } = req.params;
    const { rambahan } = req.query;

    const sql = `
      SELECT 
        p.id, 
        u.username AS name, 
        u.id AS user_id,
        s.arrow1, s.arrow2, s.arrow3, s.arrow4, s.total_score
      FROM participants p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN scores s ON p.id = s.participant_id AND s.rambahan = ?
      WHERE p.bandul_id = ?
    `;

    const rows = await query(sql, [rambahan, bandulId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching participants" });
  }
});

app.post("/score", async (req, res) => {
  try {
    const { participant_id, rambahan, arrow1, arrow2, arrow3, arrow4 } =
      req.body;

    const total = arrow1 + arrow2 + arrow3 + arrow4;

    const sql = `
      INSERT INTO scores (participant_id, rambahan, arrow1, arrow2, arrow3, arrow4, total_score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      arrow1 = VALUES(arrow1), arrow2 = VALUES(arrow2), 
      arrow3 = VALUES(arrow3), arrow4 = VALUES(arrow4), 
      total_score = VALUES(total_score)
    `;

    await query(sql, [
      participant_id,
      rambahan,
      arrow1,
      arrow2,
      arrow3,
      arrow4,
      total,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving score" });
  }
});

app.get("/event/:eventId/leaderboard", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { type, bandulId, rambahan } = req.query;

    let sql = "";
    let params = [];

    const selectPart = `
      SELECT 
        u.username AS name, 
        b.name as bandul_name,
    `;

    if (type === "rambahan") {
      sql =
        selectPart +
        `
          COALESCE(s.arrow1, 0) as a1, COALESCE(s.arrow2, 0) as a2, 
          COALESCE(s.arrow3, 0) as a3, COALESCE(s.arrow4, 0) as a4,
          COALESCE(s.total_score, 0) as total,
          (CASE WHEN s.arrow1 > 0 THEN 1 ELSE 0 END + 
           CASE WHEN s.arrow2 > 0 THEN 1 ELSE 0 END + 
           CASE WHEN s.arrow3 > 0 THEN 1 ELSE 0 END + 
           CASE WHEN s.arrow4 > 0 THEN 1 ELSE 0 END) as hits
        FROM participants p
        JOIN users u ON p.user_id = u.id
        JOIN bandul b ON p.bandul_id = b.id
        LEFT JOIN scores s ON p.id = s.participant_id AND s.rambahan = ?
        WHERE b.event_id = ?
      `;
      params = [rambahan, eventId];
    } else {
      sql =
        selectPart +
        `
          COALESCE(SUM(s.total_score), 0) as total,
          SUM(CASE WHEN s.arrow1 > 0 THEN 1 ELSE 0 END + 
              CASE WHEN s.arrow2 > 0 THEN 1 ELSE 0 END + 
              CASE WHEN s.arrow3 > 0 THEN 1 ELSE 0 END + 
              CASE WHEN s.arrow4 > 0 THEN 1 ELSE 0 END) as hits
        FROM participants p
        JOIN users u ON p.user_id = u.id
        JOIN bandul b ON p.bandul_id = b.id
        LEFT JOIN scores s ON p.id = s.participant_id
        WHERE b.event_id = ?
      `;
      params = [eventId];
    }

    if (bandulId && bandulId !== "all") {
      sql += " AND p.bandul_id = ?";
      params.push(bandulId);
    }

    if (type !== "rambahan") {
      sql += " GROUP BY p.id, u.username, b.name";
    }

    sql += " ORDER BY total DESC, hits DESC";

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

// ==========================================
// EVENT MANAGEMENT ROUTES
// ==========================================

app.post("/events", async (req, res) => {
  try {
    const { title, date, category, banner, created_by } = req.body;
    if (!title || !date || !category) {
      return res.status(400).json({ message: "Incomplete data" });
    }

    // 1. Insert Event
    const sql = `
      INSERT INTO events (title, date, category, banner, created_by, status)
      VALUES (?, ?, ?, ?, ?, 'preparation')
    `;
    const result = await query(sql, [
      title,
      date,
      category,
      banner,
      created_by,
    ]);
    const eventId = result.insertId;

    // 2. Create 5 Default Banduls (A - E)
    const bandulNames = ["A", "B", "C", "D", "E"];
    const bandulPromises = bandulNames.map((name) =>
      query(
        "INSERT INTO bandul (event_id, name, status) VALUES (?, ?, 'active')",
        [eventId, `Bandul ${name}`]
      )
    );
    await Promise.all(bandulPromises);

    return res.json({ success: true, eventId: eventId });
  } catch (err) {
    console.error("Event creation error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/event/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await query("UPDATE events SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating status" });
  }
});

app.put("/bandul/:id/lock", async (req, res) => {
  try {
    const { id } = req.params;
    await query("UPDATE bandul SET is_locked = 1 WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error locking bandul" });
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

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error("❌ Server failed to start:", err);
  }
});
