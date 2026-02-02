import React, { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Page components located in src/pages/
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';

/**
 * --- PROTECTED ROUTE INTERFACE ---
 * Using 'type' in the import above fixed the error 1484.
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * --- PROTECTED ROUTE COMPONENT ---
 * Gatekeeper component that checks the server for a valid session cookie.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Querying the backend on Port 5001
        const res = await fetch('http://localhost:5001/api/notes', {
          credentials: 'include',
        });
        
        // res.ok is true if status is 200-299
        setIsAuthenticated(res.ok);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Show spinner during the network handshake
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Final gate: show children (Notes) or send back to Login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * --- MAIN APP COMPONENT ---
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Landing */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Private Route */}
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;