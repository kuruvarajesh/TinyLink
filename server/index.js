// ============================================
// server/index.js
// ============================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import errorHandler from './middleware/errorHandler.js';
import db from './config/database.js';
import Link from './models/Link.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const startTime = Date.now();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/healthz', async (req, res) => {
  try {
    await db.query('SELECT 1');
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    res.status(200).json({
      ok: true,
      version: "1.0",
      uptime: uptimeSeconds,
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      version: "1.0",
      error: "Database connection failed"
    });
  }
});

// API Routes
app.use('/api', apiRoutes);

// Redirect handler - MUST be before static files
app.get('/:code([A-Za-z0-9]{6,8})', async (req, res, next) => {
  try {
    const { code } = req.params;
    const link = await Link.findByCode(code);
    
    if (link) {
      await Link.incrementClicks(code);
      return res.redirect(302, link.original_url);
    }
    // If not found, pass to next handler (React app will show 404)
    next();
  } catch (error) {
    next(error);
  }
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// React app catch-all (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
db.initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

export default app;
