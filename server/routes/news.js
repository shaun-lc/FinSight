import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Placeholder news feed. Swap in a real news provider (e.g. NewsAPI) when ready.
router.get('/', async (req, res) => {
  const articles = [
    {
      title: 'Markets rally as inflation data cools',
      source: 'FinSight Wire',
      publishedAt: new Date().toISOString(),
      summary: 'Placeholder article summary pending integration with a live news provider.',
      url: 'https://example.com/news/markets-rally',
    },
    {
      title: 'Tech sector leads gains amid earnings season',
      source: 'FinSight Wire',
      publishedAt: new Date().toISOString(),
      summary: 'Placeholder article summary pending integration with a live news provider.',
      url: 'https://example.com/news/tech-earnings',
    },
  ];

  res.json(articles);
});

export default router;
