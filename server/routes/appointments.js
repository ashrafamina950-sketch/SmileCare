import { Router } from 'express';
import { Appointment } from '../models/index.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public: book an appointment
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, service, doctor, date, time, notes } = req.body;
    const day = new Date(date);
    if (Number.isNaN(day.getTime())) return res.status(400).json({ message: 'Invalid date' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return res.status(400).json({ message: 'Date cannot be in the past' });

    // Prevent double booking of the same doctor + slot
    if (doctor) {
      const clash = await Appointment.findOne({
        doctor,
        date: day,
        time,
        status: { $in: ['pending', 'approved'] },
      });
      if (clash) return res.status(409).json({ message: 'This time slot is already booked. Please choose another.' });
    }

    const appt = await Appointment.create({
      name,
      email,
      phone,
      service,
      doctor: doctor || null,
      date: day,
      time,
      notes,
    });
    res.status(201).json({ message: 'Appointment request received', id: appt._id });
  } catch (e) {
    next(e);
  }
});

// Public: which slots are taken for a doctor on a date
router.get('/slots', async (req, res, next) => {
  try {
    const { doctor, date } = req.query;
    if (!doctor || !date) return res.json([]);
    const taken = await Appointment.find({
      doctor,
      date: new Date(date),
      status: { $in: ['pending', 'approved'] },
    }).select('time');
    res.json(taken.map((a) => a.time));
  } catch (e) {
    next(e);
  }
});

// Admin
router.get('/stats', protect, async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const [total, pending, approved, today, recent] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'approved' }),
      Appointment.countDocuments({ date: { $gte: start, $lt: end }, status: { $ne: 'cancelled' } }),
      Appointment.find().sort({ createdAt: -1 }).limit(5).populate('doctor', 'name'),
    ]);
    const patients = (await Appointment.distinct('email')).length;
    res.json({ total, pending, approved, today, patients, recent });
  } catch (e) {
    next(e);
  }
});

router.get('/', protect, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    res.json(await Appointment.find(filter).sort({ date: -1, createdAt: -1 }).populate('doctor', 'name'));
  } catch (e) {
    next(e);
  }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const allowed = ['status', 'date', 'time', 'notes'];
    const update = {};
    allowed.forEach((k) => req.body[k] !== undefined && (update[k] = req.body[k]));
    const appt = await Appointment.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate('doctor', 'name');
    if (!appt) return res.status(404).json({ message: 'Not found' });
    res.json(appt);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', protect, async (req, res, next) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) {
    next(e);
  }
});

export default router;
