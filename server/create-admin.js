// Creates or updates the admin login WITHOUT touching services, doctors, reviews or appointments.
// Usage: npm run create-admin   (reads ADMIN_EMAIL / ADMIN_PHONE / ADMIN_PASSWORD from .env)
import 'dotenv/config';
import mongoose from 'mongoose';
import { upsertAdmin } from './utils/admin.js';

try {
  await mongoose.connect(process.env.MONGO_URI);
  const a = await upsertAdmin({
    email: process.env.ADMIN_EMAIL,
    phone: process.env.ADMIN_PHONE,
    password: process.env.ADMIN_PASSWORD,
  });
  console.log(`Admin ready. Log in with: ${[a.email, a.phone].filter(Boolean).join(' or ')}`);
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
