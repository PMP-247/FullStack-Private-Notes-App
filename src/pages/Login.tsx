import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Logged in successfully!');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Login</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-600 outline-none transition"
              placeholder="name@company.com"
              value={email}
            
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-red-600 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white font-bold py-2 rounded hover:bg-slate-800 transition duration-200 mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;