#  PrivateNotes App

A full-stack, secure personal note-taking application designed for privacy and speed. Built with the **MERN** logic (using Supabase as the backend), this app features complete user authentication and protected database access.

## 🚀 Technical Highlights

- **Frontend:** React 18 with TypeScript and Vite.
- **Styling:** Tailwind CSS v4.0 for modern, high-performance UI components.
- **Backend:** Node.js & Express handling session-based authentication.
- **Database:** Supabase with **Row Level Security (RLS)** to ensure users can only access their own notes.
- **Security:** Implemented **HttpOnly Cookies** and CORS configuration to protect against XSS and unauthorized API access.

---

##  Architecture

The app follows a decoupled architecture where the frontend and backend communicate via a REST API on separate ports:
- **Client:** `http://localhost:5173`
- **Server:** `http://localhost:5001`


##  Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- A Supabase Project

### 2. Environment Variables
Create a `.env` file in the server root:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key