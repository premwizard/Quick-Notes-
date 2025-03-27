const express = require("express");
const cors = require("cors");
const { connectToDB, getDB } = require("./db/mongo");
require("dotenv").config();
const { ObjectId } = require("mongodb"); // move it to top for reuse

const app = express();
app.use(cors());
app.use(express.json());

connectToDB().then(() => {
  const db = getDB();
  const notes = db.collection("notes");

  // Get all notes
  app.get("/api/notes", async (req, res) => {
    const allNotes = await notes.find().toArray();
    res.json(allNotes);
  });

  app.get("/", (req, res) => {
    res.send("Backend is running ✅");
  });
  

  // Add new note
  app.post("/api/notes", async (req, res) => {
    const newNote = req.body;
    const result = await notes.insertOne(newNote);
    res.json(result);
  });

  // Delete a note by ID (with ObjectId validation)
  app.delete("/api/notes/:id", async (req, res) => {
    const id = req.params.id;

    // ✅ Check if it's a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
      const result = await notes.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.json({ message: "Note deleted successfully" });
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
});
