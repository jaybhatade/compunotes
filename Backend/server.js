const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const session = require('express-session');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// Set up session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

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

  // Get all batches
  app.get("/api/get-batches", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Batches");
      res.json(rows);
    } catch (err) {
      handleErrors(res, err, "Error fetching batches");
    }
  });

  // Create a new batch
  app.post("/api/create-batch", async (req, res) => {
    try {
      const { BatchName } = req.body;
      if (!BatchName) {
        return res.status(400).json({ error: "BatchName is required" });
      }

      const [existingBatch] = await pool.query("SELECT * FROM Batches WHERE BatchName = ?", [BatchName]);
      
      if (existingBatch.length > 0) {
        return res.status(409).json({ error: "Batch already exists" });
      }
      
      const [result] = await pool.query("INSERT INTO Batches (BatchName) VALUES (?)", [BatchName]);
      res.status(201).json({ BatchID: result.insertId, BatchName });
    } catch (err) {
      handleErrors(res, err, "Error creating batch");
    }
  });

  // Update a batch
  app.put("/api/update-batch/:BatchID", async (req, res) => {
    try {
      const { BatchID } = req.params;
      const { BatchName } = req.body;

      if (!BatchName) {
        return res.status(400).json({ error: "BatchName is required" });
      }
      
      const [existingBatch] = await pool.query("SELECT * FROM Batches WHERE BatchName = ? AND BatchID != ?", [BatchName, BatchID]);
      
      if (existingBatch.length > 0) {
        return res.status(409).json({ error: "Batch name already in use" });
      }
      
      const [result] = await pool.query("UPDATE Batches SET BatchName = ? WHERE BatchID = ?", [BatchName, BatchID]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Batch not found" });
      }
      
      res.json({ message: "Batch updated successfully", BatchID, BatchName });
    } catch (err) {
      handleErrors(res, err, "Error updating batch");
    }
  });

  app.delete("/api/delete-batch/:BatchID", async (req, res) => {
    const connection = await pool.getConnection();
  
    try {
      const { BatchID } = req.params;
  
      await connection.beginTransaction();
  
      // Delete related records in Notes
      const [notesResult] = await connection.query("DELETE FROM Notes WHERE BatchID = ?", [BatchID]);
      console.log(`Deleted ${notesResult.affectedRows} related Notes for BatchID ${BatchID}`);
  
      // Delete related records in BatchMembers
      const [batchMembersResult] = await connection.query("DELETE FROM BatchMembers WHERE BatchID = ?", [BatchID]);
      console.log(`Deleted ${batchMembersResult.affectedRows} related BatchMembers for BatchID ${BatchID}`);
  
      // Delete the Batch
      const [batchResult] = await connection.query("DELETE FROM Batches WHERE BatchID = ?", [BatchID]);
  
      if (batchResult.affectedRows === 0) {
        await connection.rollback();
        console.warn(`Batch with BatchID ${BatchID} not found, rollback initiated.`);
        return res.status(404).json({ message: "Batch not found" });
      }
  
      await connection.commit();
      console.log(`Batch with BatchID ${BatchID} and all related records deleted successfully.`);
      res.json({ message: "Batch and related records deleted successfully" });
    } catch (error) {
      await connection.rollback();
      console.error('Error deleting batch:', error);
      res.status(500).json({ message: "Error deleting batch", error: error.message });
    } finally {
      connection.release();
    }
  });
  

// Get all batches
app.get("/api/v1/batches/get-all-batches", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Batches");
    res.json(rows);
  } catch (err) {
    handleErrors(res, err, "Error fetching batches");
  }
});


// Get students in a specific batch
app.get("/api/v1/batches/:BatchID/get-batch-students", async (req, res) => {
  const { BatchID } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT u.UserID, u.FirstName, u.LastName
      FROM Users u
      JOIN BatchMembers bm ON u.UserID = bm.UserID
      WHERE bm.BatchID = ? AND bm.Role = 'student'
    `, [BatchID]);
    res.json(rows);
  } catch (err) {
    handleErrors(res, err, "Error fetching students in batch");
  }
});


// Add a student to a batch
app.post("/api/v1/batches/:BatchID/add-student-to-batch", async (req, res) => {
  const { BatchID } = req.params;
  const { UserID } = req.body;
  try {
    await pool.query(`
      INSERT INTO BatchMembers (UserID, BatchID, Role)
      VALUES (?, ?, 'student')
    `, [UserID, BatchID]);
    res.status(201).json({ message: "Student added to batch" });
  } catch (err) {
    handleErrors(res, err, "Error adding student to batch");
  }
});


// Remove a student from a batch
app.delete("/api/v1/batches/:BatchID/remove-student-from-batch/:UserID", async (req, res) => {
  const { BatchID, UserID } = req.params;
  try {
    await pool.query(`
      DELETE FROM BatchMembers
      WHERE BatchID = ? AND UserID = ? AND Role = 'student'
    `, [BatchID, UserID]);
    res.status(200).json({ message: "Student removed from batch" });
  } catch (err) {
    handleErrors(res, err, "Error removing student from batch");
  }
});


// Get all users with the role of 'student'
app.get("/api/v1/users/get-all-students", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT UserID, FirstName, LastName
      FROM Users
      WHERE Role = 'student'
    `);
    res.json(rows);
  } catch (err) {
    handleErrors(res, err, "Error fetching students");
  }
});

// Updated Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { Username, Password } = req.body;
    const users = await dbQuery('SELECT * FROM Users WHERE Username = ?', [Username]);

    if (users.length > 0) {
      const user = users[0];
      if (Password === user.Password) { // Note: In production, use proper password hashing
        // Store user data in session
        req.session.user = {
          UserID: user.UserID,
          Username: user.Username,
          Role: user.Role
        };
        res.json({ 
          message: 'Login successful',
          user: {
            UserID: user.UserID,
            Username: user.Username,
            Role: user.Role
          }
        });
      } else {
        res.status(401).json({ error: 'Invalid Username or Password' });
      }
    } else {
      res.status(401).json({ error: 'Invalid Username or Password' });
    }
  } catch (err) {
    handleErrors(res, err, 'Error during login');
  }
});

// Updated Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      handleErrors(res, err, 'Error during logout');
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logged out successfully' });
    }
  });
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// Updated Get user profile endpoint
app.get('/api/v2/profile', isAuthenticated, async (req, res) => {
  try {
    const { UserID } = req.session.user;
    const users = await dbQuery('SELECT * FROM Users WHERE UserID = ?', [UserID]);

    if (users.length > 0) {
      const user = users[0];
      // Remove sensitive information
      delete user.Password;
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    handleErrors(res, err, 'Error fetching user profile');
  }
});

// Updated Update user profile endpoint
app.put('/api/v2/profile', isAuthenticated, async (req, res) => {
  try {
    const { UserID } = req.session.user;
    const { FirstName, LastName, Email, PhoneNumber } = req.body;

    const result = await dbQuery(
      'UPDATE Users SET FirstName = ?, LastName = ?, Email = ?, PhoneNumber = ? WHERE UserID = ?',
      [FirstName, LastName, Email, PhoneNumber, UserID]
    );

    if (result.affectedRows > 0) {
      res.json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    handleErrors(res, err, 'Error updating user profile');
  }
});


// Fetch batches linked to the logged-in user
app.get('/api/v3/batches', isAuthenticated, async (req, res) => {
  try {
    const { UserID, Username, Role } = req.session.user;
    
    const query = `
      SELECT DISTINCT Batches.BatchID, Batches.BatchName
      FROM BatchMembers
      JOIN Users ON BatchMembers.UserID = Users.UserID
      JOIN Batches ON BatchMembers.BatchID = Batches.BatchID
      WHERE Users.UserID = ? AND Users.Username = ? AND Users.Role = ?
    `;
    
    const batches = await dbQuery(query, [UserID, Username, Role]);
    res.json(batches);
  } catch (error) {
    handleErrors(res, error, 'Error fetching batches');
  }
});

app.get('/api/v3/student-notes', isAuthenticated, async (req, res) => {
  try {
    const { UserID, Username, Role } = req.session.user;
    
    const query = `
      SELECT DISTINCT Notes.NoteID, Notes.Title, Notes.Content, Notes.BatchID
      FROM Notes
      JOIN Batches ON Notes.BatchID = Batches.BatchID
      JOIN BatchMembers ON Batches.BatchID = BatchMembers.BatchID
      WHERE BatchMembers.UserID = ? AND BatchMembers.Role = 'student'
      ORDER BY Notes.CreatedAt DESC
    `;
    
    const notes = await dbQuery(query, [UserID]);
    res.json(notes);
  } catch (error) {
    handleErrors(res, error, 'Error fetching notes');
  }
});

app.get('/api/v4/student-notes', isAuthenticated, async (req, res) => {
  try {
    const { UserID, Username, Role } = req.session.user;

    const query = `
      SELECT DISTINCT Notes.NoteID, Notes.Title, Notes.Content, Notes.VideoLink, Notes.BatchID
      FROM Notes
      JOIN Batches ON Notes.BatchID = Batches.BatchID
      JOIN BatchMembers ON Batches.BatchID = BatchMembers.BatchID
      WHERE BatchMembers.UserID = ? AND BatchMembers.Role = 'student'
      ORDER BY Notes.CreatedAt DESC
    `;

    const notes = await dbQuery(query, [UserID]);
    res.json(notes);
  } catch (error) {
    handleErrors(res, error, 'Error fetching notes');
  }
});


// Fetch Categories
app.get('/api/v4/notes/categories', isAuthenticated, async (req, res) => {
  try {
    const { UserID, Role } = req.session.user; // Get user details from session

    // Ensure the user is a student to fetch their batch-specific categories
    if (Role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized access. Only students can view categories.' });
    }

    // SQL query to fetch distinct categories from the batches where the user is a member
    const query = `
      SELECT DISTINCT Notes.Category
      FROM Notes
      JOIN Batches ON Notes.BatchID = Batches.BatchID
      JOIN BatchMembers ON Batches.BatchID = BatchMembers.BatchID
      WHERE BatchMembers.UserID = ? AND BatchMembers.Role = 'student'
      AND Notes.Category IS NOT NULL
    `;

    const categories = await dbQuery(query, [UserID]);

    // If no categories are found, return a message
    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found for your batches' });
    }

    // Return the list of categories
    res.json(categories);
  } catch (err) {
    // Error handling
    handleErrors(res, err, 'Error fetching categories');
  }
});

// Fetch Filtered Caterory Notes 
app.get('/api/v4/category/notes', isAuthenticated, async (req, res) => {
  try {
    const { UserID, Role } = req.session.user;

    // Ensure the user is a student
    if (Role !== 'student') {
      return res.status(403).json({ error: 'Unauthorized access. Only students can view notes.' });
    }

    // Base SQL query to fetch notes for the student
    let query = `
      SELECT DISTINCT Notes.NoteID, Notes.Title, Notes.Content, Notes.BatchID, Notes.Category
      FROM Notes
      JOIN Batches ON Notes.BatchID = Batches.BatchID
      JOIN BatchMembers ON Batches.BatchID = BatchMembers.BatchID
      WHERE BatchMembers.UserID = ? AND BatchMembers.Role = 'student'
    `;

    const queryParams = [UserID];

   

    query += ' ORDER BY Notes.CreatedAt DESC';

    // Execute the query with the constructed query string and parameters
    const categoryNotes = await dbQuery(query, queryParams);

    // Return the notes in the response
    res.json(categoryNotes);
  } catch (categoryNotes) {
    handleErrors(res, error, 'Error fetching student notes');
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
