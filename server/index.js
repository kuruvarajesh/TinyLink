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

// Production: Serve static files and handle redirects
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  // Redirect handler (before React catch-all)
  app.get('/:code([A-Za-z0-9]{6,8})', async (req, res, next) => {
    try {
      const { code } = req.params;
      const link = await Link.findByCode(code);
      if (link) {
        await Link.incrementClicks(code);
        return res.redirect(302, link.original_url);
      }
      next();
    } catch (error) {
      next(error);
    }
  });

  // React app catch-all
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // Development: Redirect handler only
  app.get('/:code([A-Za-z0-9]{6,8})', async (req, res, next) => {
    try {
      const { code } = req.params;
      const link = await Link.findByCode(code);
      if (link) {
        await Link.incrementClicks(code);
        return res.redirect(302, link.original_url);
      }
      res.status(404).json({ error: 'Link not found' });
    } catch (error) {
      next(error);
    }
  });
}

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
