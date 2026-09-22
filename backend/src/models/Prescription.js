import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  medicineName: { type: String, required: true, trim: true },
  dosage: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  frequency: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
  instructions: { type: String, default: '', trim: true },
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, required: true, unique: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorName: { type: String, required: true, trim: true },
  patientName: { type: String, required: true, trim: true },
  patientEmail: { type: String, trim: true, lowercase: true, default: '' },
  patientPhone: { type: String, trim: true, default: '' },
  medicines: { type: [medicineSchema], validate: [(value) => value.length > 0, 'At least one medicine is required'] },
  notes: { type: String, default: '', trim: true },
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
