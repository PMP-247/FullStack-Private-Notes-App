import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// In your local project, these imports work because the files exist in src/pages/
// In this preview, we'll ensure the code is robust.
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notes', {
          credentials: 'include',
        });
       
        setIsAuthenticated(res.status !== 401);
      } catch (err) {

        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Public Authentication Routes */}
        <Route path="/login" element={<LoginWithFallback />} />
        <Route path="/register" element={<RegisterWithFallback />} />
        
        {/* Protected Private Route */}
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <NotesWithFallback />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all: Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

/**
 * Fallback components to ensure the preview compiles even if 
 * the physical files aren't detected in this specific environment.
 */
function LoginWithFallback() {
  return typeof Login !== 'undefined' ? <Login /> : <div className="p-8">Login Component (Verify src/pages/Login.tsx)</div>;
}

function RegisterWithFallback() {
  return typeof Register !== 'undefined' ? <Register /> : <div className="p-8">Register Component (Verify src/pages/Register.tsx)</div>;
}

function NotesWithFallback() {
  return typeof Notes !== 'undefined' ? <Notes /> : <div className="p-8">Notes Component (Verify src/pages/Notes.tsx)</div>;
}

export default App;