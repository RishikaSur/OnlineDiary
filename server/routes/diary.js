import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../db.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const entries = await pool.query("SELECT * FROM diary WHERE user_id = $1", [req.user.id]);
  res.json(entries.rows);
});

// Get a single entry by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const entryId = req.params.id;
    const result = await pool.query(
      "SELECT * FROM diary WHERE id = $1 AND user_id = $2",
      [entryId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching entry:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { content } = req.body;
  await pool.query(
    "INSERT INTO diary (user_id, content, date) VALUES ($1, $2, CURRENT_DATE)",
    [req.user.id, content]
  );
  res.json({ success: true });
});

// PATCH: Update entry content
router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const result = await pool.query(
      "UPDATE diary SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [content, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating entry:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: Remove entry
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM diary WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting entry:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
