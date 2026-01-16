import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';       // Ensure these paths match your files
import Register from './pages/Register'; // Ensure these paths match your files

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirects any user landing on "/" directly to "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Main Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

       
      </Routes>
    </BrowserRouter>
  );
}

export default App;