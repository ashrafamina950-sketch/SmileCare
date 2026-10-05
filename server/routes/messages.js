import { Router } from 'express';
import { Message } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public: send a contact message
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    await Message.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent. We will get back to you soon.' });
  } catch (e) {
    next(e);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    res.json(await Message.find().sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: !!req.body.read }, { new: true });
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json(msg);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
});

export default router;
