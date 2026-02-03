import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
<<<<<<< Updated upstream
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
=======
import noteRoutes from './routes/notes.js';

const app = express();

// UPDATED CORS: Allow both local development and your Vercel production domain
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL // We will add this to your .env and Vercel settings
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
>>>>>>> Stashed changes

app.use(express.json());
app.use(cookieParser());

<<<<<<< Updated upstream
// Connect your routes
app.use('/auth', authRoutes);
app.use('/api', noteRoutes); // This tells the server to look in notes.js for /api/notes

app.get('/', (req, res) => res.send('Server is alive!'));

const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server active on port ${PORT}`));
=======
// UPDATED ROUTES: Aligning with the frontend's /api prefix
app.use('/api/auth', authRoutes); // Frontend now calls /api/auth/login
app.use('/api', noteRoutes);      // Frontend now calls /api/notes

app.get('/', (req, res) => res.send('Server is alive!'));

// Vercel handles the port automatically in production
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));
>>>>>>> Stashed changes

export default app;