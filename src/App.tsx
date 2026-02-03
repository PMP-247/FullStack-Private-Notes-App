import React, { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';

/**
 * --- PROTECTED ROUTE INTERFACE ---
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * --- PROTECTED ROUTE COMPONENT ---
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const checkAuth = async () => {
      try {
     
        const res = await fetch(`${API_URL}/api/notes`, {
          credentials: 'include',
        });
        
     
        setIsAuthenticated(res.ok);
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [API_URL]);


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

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * --- MAIN APP COMPONENT ---
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;