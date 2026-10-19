import cors from 'cors'; //Cross origin Resource sharing, react runs on 5173 port, and server runs on 5000; allows communications
import dotenv from 'dotenv';
import express from 'express'; //handles HTTPS requests
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import holdingsRoutes from './routes/holdings.js';
import newsRoutes from './routes/news.js';
import PriceCache from './models/PriceCache.js';
import pricesRoutes from './routes/prices.js';
import riskRoutes from './routes/risk.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigin = process.env.FRONTEND_URL || (isProduction ? undefined : 'http://localhost:5173');

if (isProduction && !allowedOrigin) {
  console.error('FRONTEND_URL must be set in production');
  process.exit(1);
}

// Behind a reverse proxy the client IP comes from X-Forwarded-For; needed for per-IP rate limits.
if (isProduction) app.set('trust proxy', 1);

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/holdings', apiLimiter, holdingsRoutes);
app.use('/api/prices', apiLimiter, pricesRoutes);
app.use('/api/news', apiLimiter, newsRoutes);
app.use('/api/risk', apiLimiter, riskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

async function start() {
  try {
    await connectDB();
    await PriceCache.syncIndexes(); // drops the old unique symbol index, builds the compound one
    app.listen(PORT);
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
