// App.jsx
import React, { useEffect, useState } from "react";
import "./index.css";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API = "http://localhost:5000/api/notes";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setNotes(data);
  };

  const addNote = async () => {
    if (newNote.trim() === "") return;

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newNote }),
    });

    setNewNote("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const startEditing = (id, text) => {
    setEditingNoteId(id);
    setEditedText(text);
  };

  const saveEditedNote = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editedText }),
    });

    setEditingNoteId(null);
    setEditedText("");
    fetchNotes();
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNote();
    }
  };

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  return (
    <div className="app">
      <header>
        <h1>Quick Notes</h1>
        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞" : "🌙"}
        </button>
      </header>

      <input
        className="search-bar"
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="input-bar">
        <input
          type="text"
          placeholder="Add a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={addNote}>Add</button>
      </div>

      <div className="notes-list">
        {filteredNotes.map((note) => (
          <div className="note" key={note._id}>
            {editingNoteId === note._id ? (
              <div className="edit-section">
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <button onClick={() => saveEditedNote(note._id)}>Save</button>
              </div>
            ) : (
              <>
                <p>{note.text}</p>
                <div className="note-actions">
                  <button onClick={() => startEditing(note._id, note.text)}>Edit</button>
                  <button onClick={() => deleteNote(note._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
