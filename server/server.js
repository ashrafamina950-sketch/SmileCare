import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import crudRouter from './routes/crud.js';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import messageRoutes from './routes/messages.js';
import reviewRoutes from './routes/reviews.js';
import { Service, Doctor } from './models/index.js';
import { notFound, errorHandler } from './middleware/auth.js';

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('Missing JWT_SECRET or MONGO_URI in .env (copy .env.example to .env)');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/services', crudRouter(Service, { publicFilter: { active: true }, sort: { createdAt: 1 } }));
app.use('/api/doctors', crudRouter(Doctor, { publicFilter: { active: true }, sort: { createdAt: 1 } }));
app.use('/api/reviews', reviewRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)));
