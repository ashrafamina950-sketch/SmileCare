import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const Admin = model(
  'Admin',
  new Schema(
    {
      name: { type: String, default: 'Admin' },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
    },
    { timestamps: true }
  )
);

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: 'tooth' },
    price: { type: String, default: '' },
    duration: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
serviceSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) this.slug = slugify(this.title);
  next();
});
export const Service = model('Service', serviceSchema);

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    title: { type: String, default: 'Dentist' },
    specialization: { type: String, default: '' },
    experience: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    photo: { type: String, default: '' },
    availableDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
doctorSchema.pre('validate', function (next) {
  if (this.name && (!this.slug || this.isModified('name'))) this.slug = slugify(this.name);
  next();
});
export const Doctor = model('Doctor', doctorSchema);

export const Review = model(
  'Review',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      treatment: { type: String, default: '' },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String, required: true, maxlength: 600 },
      approved: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

export const Appointment = model(
  'Appointment',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true },
      service: { type: String, default: '' },
      doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', default: null },
      date: { type: Date, required: true },
      time: { type: String, required: true },
      notes: { type: String, default: '' },
      status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled', 'completed'],
        default: 'pending',
      },
    },
    { timestamps: true }
  )
);

export const Message = model(
  'Message',
  new Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      subject: { type: String, default: '' },
      message: { type: String, required: true },
      read: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);
