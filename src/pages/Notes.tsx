import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  /**
   * 1. FETCH ALL NOTES
   */
  const fetchNotes = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load notes');
      }
    } catch (err) {
      setError('Connection error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate, API_URL]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /**
   * 2. ADD A NEW NOTE
   */
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
        credentials: 'include',
      });

      if (response.ok) {
        setNewNote('');
        fetchNotes(); 
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  /**
   * 3. DELETE A NOTE
   */
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchNotes();
      } else {
        console.error('Failed to delete note');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  /**
   * 4. LOGOUT
   */
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium animate-pulse">Loading your private notes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">My Private Notes</h1>
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleAddNote} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a new note..."
              className="flex-1 rounded-md border-0 py-2 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm"
            />
            <button
              type="submit"
              className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Add
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500">No notes yet. Add your first one above!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="group bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 transition-all flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-slate-800 leading-relaxed">{note.content}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-4 font-semibold">
                    {new Date(note.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
                <button 
                  onClick={() => handleDeleteNote(note.id)}
                  className="ml-4 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-600 transition-all"
                  title="Delete note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;