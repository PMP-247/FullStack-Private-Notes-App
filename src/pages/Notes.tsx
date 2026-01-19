import React, { useState, useEffect } from "react";

interface Note {
  id: string | number;
  content: string;
  created_at: string;
  user_id: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: newNote }),
      });

      if (res.ok) {
        setNewNote("");
        fetchNotes();
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My <span className="text-red-600">Notes</span>
          </h1>
          <button className="text-sm font-semibold text-slate-500 hover:text-red-600">
            Sign Out
          </button>
        </header>
        <form onSubmit={addNote} className="mb-8 flex gap-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a private note..."
            className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-red-600"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Add
          </button>
        </form>
        //* Notes List */
        {loading ? (
          <p className="text-center text-slate-500">
            Loading your secure notes...
          </p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-slate-700">{note.content}</p>
                <span className="text-xs text-slate-400">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-center text-slate-400 mt-10">
                No notes found. Start by adding one above!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
