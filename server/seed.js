import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Admin, Service, Doctor, Review } from './models/index.js';

const services = [
  {
    title: 'Preventive Care',
    icon: 'shield',
    shortDescription: 'Routine checkups, cleanings & oral hygiene advice',
    description:
      'Regular checkups and professional cleanings catch problems early and keep your teeth and gums healthy. Our preventive visits include a full oral exam, digital X-rays when needed, scaling and polishing, and personalised advice on brushing and flossing.',
    price: 'From $60',
    duration: '45 min',
  },
  {
    title: 'Teeth Whitening',
    icon: 'sparkle',
    shortDescription: 'Professional whitening for a brighter, radiant smile',
    description:
      'Our in-clinic whitening removes years of stains from coffee, tea and daily life. Most patients see results several shades brighter in a single visit, with gentle gels that protect your enamel and keep sensitivity low.',
    price: 'From $180',
    duration: '60 min',
  },
  {
    title: 'Orthodontics',
    icon: 'braces',
    shortDescription: 'Clear aligners & braces for perfect alignment',
    description:
      'Straighter teeth are easier to clean and look great. We offer traditional braces and clear aligners, with a 3D scan and treatment plan so you know exactly what to expect from the first appointment.',
    price: 'Consultation free',
    duration: '30 min consult',
  },
  {
    title: 'Dental Implants',
    icon: 'implant',
    shortDescription: 'Durable implants restoring function and natural look',
    description:
      'Implants replace missing teeth with a permanent, natural-looking solution. We plan each case with 3D imaging and use modern techniques that keep the procedure comfortable and recovery quick.',
    price: 'From $900',
    duration: '90 min',
  },
];

const doctors = [
  {
    name: 'Dr. James Lee',
    title: 'DDS',
    specialization: 'Cosmetic & Restorative Dentistry',
    experience: 12,
    bio: 'Dr. James Lee specializes in cosmetic and restorative dentistry. He is passionate about providing gentle, pain-free treatments using the latest technology to ensure every patient feels comfortable and cared for.',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    name: 'Dr. Sara Khan',
    title: 'BDS, MSc',
    specialization: 'Orthodontics',
    experience: 9,
    bio: 'Dr. Sara Khan focuses on orthodontics for children and adults, helping patients achieve straight, healthy smiles with braces and clear aligners.',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
  },
];

const reviews = [
  { name: 'Sarah Lopez', treatment: 'Teeth Whitening', rating: 5, comment: 'I was anxious about my teeth for years, but the team made me feel so comfortable. The whitening results are amazing!' },
  { name: 'Michael Chen', treatment: 'Orthodontics', rating: 5, comment: 'The clear aligners were seamless and Dr. Lee was so supportive. My smile is now perfectly straight!' },
  { name: 'Aisha Rahman', treatment: 'Preventive Care', rating: 4, comment: 'Clean clinic, friendly staff and no waiting. Booking online was very easy.' },
].map((r) => ({ ...r, approved: true }));

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([Service.deleteMany(), Doctor.deleteMany(), Review.deleteMany()]);
  for (const s of services) await Service.create(s);
  for (const d of doctors) await Doctor.create(d);
  await Review.insertMany(reviews);

  const email = (process.env.ADMIN_EMAIL || 'admin@smilecare.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  await Admin.deleteMany({ email });
  await Admin.create({ name: 'Admin', email, password: await bcrypt.hash(password, 10) });

  console.log(`Seeded. Admin login: ${email} / ${password}`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
