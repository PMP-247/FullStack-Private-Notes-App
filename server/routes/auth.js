import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();


const setAuthCookies = (res, session) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, 
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 * 1000, 
  };

  res.cookie('sb-access-token', session.access_token, cookieOptions);
  res.cookie('sb-refresh-token', session.refresh_token, cookieOptions);
};

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });
    
    if (data.session) {
      setAuthCookies(res, data.session);
      return res.status(201).json({ message: 'Registration successful', user: data.user });
    }

    res.status(201).json({ 
      message: 'Registration successful. Please check your email for a confirmation link.', 
      user: data.user 
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: error.message });

    if (data.session) {
      setAuthCookies(res, data.session);
    }

    res.status(200).json({ message: 'Login successful', user: data.user });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// LOGOUT ROUTE
router.post('/logout', (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };

  res.clearCookie('sb-access-token', cookieOptions);
  res.clearCookie('sb-refresh-token', cookieOptions);
  
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;