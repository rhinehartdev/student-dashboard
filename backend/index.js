const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a student
app.post("/students", (req, res) => {
  const { name, section, grade, status } = req.body;
  db.query(
    "INSERT INTO students (name, section, grade, status) VALUES (?, ?, ?, ?)",
    [name, section, grade, status],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Student added!", id: result.insertId });
    }
  );
});

// Update a student
app.put("/students/:id", (req, res) => {
  const { name, section, grade, status } = req.body;
  db.query(
    "UPDATE students SET name = ?, section = ?, grade = ?, status = ? WHERE id = ?",
    [name, section, grade, status, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Student updated!" });
    }
  );
});

// Delete a student
app.delete("/students/:id", (req, res) => {
  db.query("DELETE FROM students WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Student deleted!" });
  });
});

app.listen(3001, () =>
  console.log("✅ Backend running on http://localhost:3001")
);
