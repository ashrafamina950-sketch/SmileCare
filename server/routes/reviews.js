import { Router } from 'express';
import { Review } from '../models/index.js';
import { protect } from '../middleware/auth.js';
import crudRouter from './crud.js';

const router = Router();

// Public: submit a review (saved as pending until an admin approves it)
router.post('/submit', async (req, res, next) => {
  try {
    const { name, treatment, rating, comment } = req.body;
    await Review.create({ name, treatment, rating, comment, approved: false });
    res.status(201).json({ message: 'Thank you! Your review will appear after approval.' });
  } catch (e) {
    next(e);
  }
});

// Everything else: public list shows approved only; admin can manage
router.use('/', crudRouter(Review, { publicFilter: { approved: true } }));

export default router;
