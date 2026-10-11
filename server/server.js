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
dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/holdings', holdingsRoutes);
app.use('/api/prices', pricesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/risk', riskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

async function start() {
  try {
    await connectDB();
    await PriceCache.syncIndexes(); // drops the old unique symbol index, builds the compound one
    app.listen(PORT, () => {
      console.log(`FinSight server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
