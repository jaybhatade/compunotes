const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000, // 10 seconds
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Promisify for Node.js async/await.
const promisePool = pool.promise();

// Helper function for database queries
const dbQuery = async (query, params = []) => {
  try {
    const [results] = await promisePool.query(query, params);
    return results;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
};

// Helper function for handling errors
const handleErrors = (res, err, errorMessage) => {
  console.error(errorMessage, err);
  res.status(500).json({ error: errorMessage, details: err.message });
};

// GET endpoints for fetching data
app.get("/api/topics", async (req, res) => {
  try {
    const topics = await dbQuery("SELECT * FROM Topics");
    res.json(topics);
  } catch (err) {
    handleErrors(res, err, "Error fetching topics");
  }
});

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await dbQuery("SELECT * FROM Notes");
    res.json(notes);
  } catch (err) {
    handleErrors(res, err, "Error fetching notes");
  }
});

app.get("/api/tags", async (req, res) => {
  try {
    const tags = await dbQuery("SELECT * FROM Tags");
    res.json(tags);
  } catch (err) {
    handleErrors(res, err, "Error fetching tags");
  }
});

app.get("/api/note-tags", async (req, res) => {
  try {
    const noteTags = await dbQuery("SELECT * FROM NoteTags");
    res.json(noteTags);
  } catch (err) {
    handleErrors(res, err, "Error fetching note tags");
  }
});

// POST endpoints for creating new entries
app.post("/api/topics", async (req, res) => {
  const { topicName, description } = req.body;
  if (!topicName) {
    return res.status(400).json({ error: "Topic name is required" });
  }
  try {
    const result = await dbQuery(
      "INSERT INTO Topics (TopicName, Description) VALUES (?, ?)",
      [topicName, description]
    );
    res.status(201).json({ message: "Topic added successfully", id: result.insertId });
  } catch (err) {
    handleErrors(res, err, "Error creating topic");
  }
});

app.post("/api/notes", async (req, res) => {
  const { topicId, title, content, videoLink } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  try {
    const result = await dbQuery(
      "INSERT INTO Notes (TopicID, Title, Content, VideoLink) VALUES (?, ?, ?, ?)",
      [topicId, title, content, videoLink]
    );
    res.status(201).json({ message: "Note added successfully", id: result.insertId });
  } catch (err) {
    handleErrors(res, err, "Error creating note");
  }
});

app.post("/api/tags", async (req, res) => {
  const { tagName } = req.body;
  if (!tagName) {
    return res.status(400).json({ error: "Tag name is required" });
  }
  try {
    const result = await dbQuery(
      "INSERT INTO Tags (TagName) VALUES (?)",
      [tagName]
    );
    res.status(201).json({ message: "Tag added successfully", id: result.insertId });
  } catch (err) {
    handleErrors(res, err, "Error creating tag");
  }
});

app.post("/api/note-tags", async (req, res) => {
  const { noteId, tagId } = req.body;
  if (!noteId || !tagId) {
    return res.status(400).json({ error: "Note ID and Tag ID are required" });
  }
  try {
    await dbQuery(
      "INSERT INTO NoteTags (NoteID, TagID) VALUES (?, ?)",
      [noteId, tagId]
    );
    res.status(201).json({ message: "Note-Tag relation added successfully" });
  } catch (err) {
    handleErrors(res, err, "Error creating note-tag relation");
  }
});

// DELETE endpoint for notes
app.delete("/api/notes/:id", async (req, res) => {
  const noteId = req.params.id;
  try {
    // First, delete related entries in NoteTags
    await dbQuery("DELETE FROM NoteTags WHERE NoteID = ?", [noteId]);
    
    // Then delete the note
    const result = await dbQuery("DELETE FROM Notes WHERE NoteID = ?", [noteId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    handleErrors(res, err, "Error deleting note");
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred", details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  pool.end((err) => {
    if (err) {
      console.error("Error closing MySQL connection pool", err);
    } else {
      console.log("MySQL connection pool closed");
    }
    process.exit(err ? 1 : 0);
  });
});