import express from 'express';

import { getSupabaseWithAuth } from '../supabaseClient.js';

const router = express.Router();


router.get('/notes', async (req, res) => {
  const token = req.cookies['sb-access-token'];
  console.log("Checking token:", token ? "Token received ✅" : "No token found ❌");
  if (!token) return res.status(401).json({ error: 'Not authenticated' });


  try {
    const supabaseAuth = getSupabaseWithAuth(token);
    const { data, error } = await supabaseAuth
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/notes', async (req, res) => {
  const token = req.cookies['sb-access-token'];
  const { content } = req.body;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const supabaseAuth = getSupabaseWithAuth(token);
    const { data, error } = await supabaseAuth
      .from('notes')
      .insert([{ content }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/notes/:id', async (req, res) => {
  const token = req.cookies['sb-access-token'];
  const { id } = req.params;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const supabaseAuth = getSupabaseWithAuth(token);
    const { error } = await supabaseAuth
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;