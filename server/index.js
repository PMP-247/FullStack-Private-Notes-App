import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js'; // Added this line

const app = express();

app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(cookieParser());

// Connect your routes
app.use('/auth', authRoutes);
app.use('/api', noteRoutes); // This tells the server to look in notes.js for /api/notes

app.get('/', (req, res) => res.send('Server is alive!'));

const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server active on port ${PORT}`));

export default app;