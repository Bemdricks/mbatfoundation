import mongoose, { Schema } from 'mongoose';

const donationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paystack_reference: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const campSchema = new Schema(
  {
    event: { type: String, required: true },
    full_name: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    age_group: { type: String, required: true },
    position: { type: String, default: '' },
    experience: { type: String, required: true },
    guardian_name: { type: String, default: '' },
    guardian_phone: { type: String, default: '' },
    tshirt_size: { type: String, required: true },
    medical_notes: { type: String, default: '' },
    fee_amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    paystack_reference: { type: String, required: true, unique: true },
    payment_status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

export const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
export const CampRegistration =
  mongoose.models.CampRegistration || mongoose.model('CampRegistration', campSchema);
export const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactSchema);
