const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig).promise();

const dbQuery = async (query, params = []) => {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (err) {
    console.error("Database error:", err);
    throw err;
  }
};

const handleErrors = (res, err, errorMessage) => {
  console.error(errorMessage, err);
  res.status(500).json({ error: errorMessage, details: err.message });
};

// Notes endpoints
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await dbQuery("SELECT * FROM Notes");
    res.json(notes);
  } catch (err) {
    handleErrors(res, err, "Error fetching notes");
  }
});

app.post("/api/notes", async (req, res) => {
  const { title, content, videoLink, category, batchId } = req.body;
  try {
    const result = await dbQuery(
      "INSERT INTO Notes (Title, Content, VideoLink, Category, BatchID) VALUES (?, ?, ?, ?, ?)",
      [title, content, videoLink, category, batchId]
    );
    res
      .status(201)
      .json({ message: "Note created successfully", noteId: result.insertId });
  } catch (err) {
    handleErrors(res, err, "Error creating note");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content, videoLink, category, batchId } = req.body;
  try {
    const result = await dbQuery(
      "UPDATE Notes SET Title = ?, Content = ?, VideoLink = ?, Category = ?, BatchID = ? WHERE NoteID = ?",
      [title, content, videoLink, category, batchId, req.params.id]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Note not found" });
    } else {
      res.json({ message: "Note updated successfully" });
    }
  } catch (err) {
    handleErrors(res, err, "Error updating note");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const result = await dbQuery("DELETE FROM Notes WHERE NoteID = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Note not found" });
    } else {
      res.json({ message: "Note deleted successfully" });
    }
  } catch (err) {
    handleErrors(res, err, "Error deleting note");
  }
});

// Users endpoints
app.get("/api/users", async (req, res) => {
  try {
    const users = await dbQuery(
      "SELECT UserID, Username, FirstName, LastName, Role FROM Users"
    );
    res.json(users);
  } catch (err) {
    handleErrors(res, err, "Error fetching users");
  }
});

// Batches endpoints
app.get("/api/batches", async (req, res) => {
  try {
    const batches = await dbQuery("SELECT * FROM Batches");
    res.json(batches);
  } catch (err) {
    handleErrors(res, err, "Error fetching batches");
  }
});

app.get("/api/batches", async (req, res) => {
  try {
    const results = await dbQuery("SELECT * FROM Batches");
    res.json(results);
  } catch (err) {
    handleErrors(res, err, "Error retrieving batches");
  }
});

app.get("/api/batches/:batchID", async (req, res) => {
  const { batchID } = req.params;
  try {
    const result = await dbQuery("SELECT * FROM Batches WHERE BatchID = ?", [
      batchID,
    ]);
    res.json(result);
  } catch (err) {
    handleErrors(res, err, "Error retrieving batch details");
  }
});

app.get("/api/batches/details/:batchId", async (req, res) => {
  const { batchId } = req.params;

  try {
    // Query to get batch details
    const batchQuery = "SELECT * FROM Batches WHERE BatchID = ?";
    const batchResult = await dbQuery(batchQuery, [batchId]);

    if (batchResult.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    // Query to get notes for the batch
    const notesQuery = "SELECT * FROM Notes WHERE BatchID = ?";
    const notesResult = await dbQuery(notesQuery, [batchId]);

    res.json({
      batch: batchResult[0],
      notes: notesResult,
    });
  } catch (err) {
    console.error("Database query error:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve batch details and notes" });
  }
});

app.post("/api/batches", async (req, res) => {
  try {
    const { BatchName } = req.body;

    if (!BatchName) {
      return res.status(400).json({ error: "BatchName is required" });
    }

    // Check if the batch already exists
    const existingBatches = await dbQuery(
      "SELECT * FROM Batches WHERE BatchName = ?",
      [BatchName]
    );

    if (existingBatches.length > 0) {
      return res.status(409).json({ error: "Batch already exists" });
    }

    // Insert new batch
    await dbQuery("INSERT INTO Batches (BatchName) VALUES (?)", [BatchName]);

    res.status(201).json({ message: "Batch created successfully" });
  } catch (err) {
    handleErrors(res, err, "Error creating batch");
  }
});


// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await dbQuery("SELECT * FROM Users");
    res.json(users);
  } catch (err) {
    handleErrors(res, err, "Error fetching users");
  }
});

// Get batch details with associated notes
app.get("/api/batches/details/:batchId", async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const query = `
      SELECT b.BatchID, b.BatchName, n.NoteID, n.Title, n.Content
      FROM Batches b
      LEFT JOIN Notes n ON b.BatchID = n.BatchID
      WHERE b.BatchID = ?
    `;
    const results = await dbQuery(query, [batchId]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    
    const batch = {
      BatchID: results[0].BatchID,
      BatchName: results[0].BatchName,
      Notes: results.map(row => ({
        NoteID: row.NoteID,
        Title: row.Title,
        Content: row.Content
      })).filter(note => note.NoteID !== null)
    };
    
    res.json(batch);
  } catch (err) {
    handleErrors(res, err, "Error fetching batch details");
  }
});

// Get note details
app.get("/api/notes/:noteId", async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const query = "SELECT * FROM Notes WHERE NoteID = ?";
    const results = await dbQuery(query, [noteId]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(results[0]);
  } catch (err) {
    handleErrors(res, err, "Error fetching note details");
  }
});

// Create a new note
app.post("/api/notes", async (req, res) => {
  try {
    const { BatchID, Title, Content } = req.body;
    const query = "INSERT INTO Notes (BatchID, Title, Content) VALUES (?, ?, ?)";
    const result = await dbQuery(query, [BatchID, Title, Content]);
    
    const newNote = {
      NoteID: result.insertId,
      BatchID,
      Title,
      Content
    };
    
    res.status(201).json(newNote);
  } catch (err) {
    handleErrors(res, err, "Error creating note");
  }
});

// Update an existing note
app.put("/api/notes/:noteId", async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { Title, Content } = req.body;
    const query = "UPDATE Notes SET Title = ?, Content = ? WHERE NoteID = ?";
    await dbQuery(query, [Title, Content, noteId]);
    
    const updatedNote = { NoteID: noteId, Title, Content };
    res.json(updatedNote);
  } catch (err) {
    handleErrors(res, err, "Error updating note");
  }
});

// Delete a note
app.delete("/api/notes/:noteId", async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const query = "DELETE FROM Notes WHERE NoteID = ?";
    await dbQuery(query, [noteId]);
    
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    handleErrors(res, err, "Error deleting note");
  }
});

// Add a new user
app.post("/api/users", async (req, res) => {
  try {
    const {
      Username,
      Password,
      PhoneNumber,
      Email,
      FirstName,
      LastName,
      Role,
      ProfileIcon,
    } = req.body;
    const result = await dbQuery(
      "INSERT INTO Users (Username, Password, PhoneNumber, Email, FirstName, LastName, Role, ProfileIcon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        Username,
        Password,
        PhoneNumber,
        Email,
        FirstName,
        LastName,
        Role,
        ProfileIcon,
      ]
    );
    res
      .status(201)
      .json({ message: "User added successfully", userId: result.insertId });
  } catch (err) {
    handleErrors(res, err, "Error adding user");
  }
});

// Delete a user by ID
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbQuery("DELETE FROM Users WHERE UserID = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    handleErrors(res, err, "Error deleting user");
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const users = await dbQuery("SELECT * FROM Users WHERE Username = ?", [
      Username,
    ]);

    if (users.length > 0) {
      const user = users[0];
      if (Password === user.Password) {
        // Direct comparison without hashing
        res.json({ Role: user.Role });
      } else {
        res.status(401).json({ error: "Invalid Username or Password" });
      }
    } else {
      res.status(401).json({ error: "Invalid Username or Password" });
    }
  } catch (err) {
    handleErrors(res, err, "Error during login");
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(500)
    .json({ error: "An unexpected error occurred", details: err.message });
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
