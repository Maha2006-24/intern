import Prescription from '../models/Prescription.js';
import { isMongoConnected } from '../config/db.js';

const id = () => `RX-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
const clean = (m = {}) => ({ medicineName: String(m.medicineName || '').trim(), dosage: String(m.dosage || '').trim(), quantity: Number(m.quantity), frequency: String(m.frequency || '').trim(), duration: String(m.duration || '').trim(), instructions: String(m.instructions || '').trim() });
const unavailable = (res) => { if (isMongoConnected()) return false; res.status(503).json({ error: 'Prescription service requires a MongoDB connection' }); return true; };

export async function createPrescription(req, res) {
  if (unavailable(res)) return;
  const payload = { patientName: String(req.body.patientName || '').trim(), patientEmail: String(req.body.patientEmail || '').trim().toLowerCase(), patientPhone: String(req.body.patientPhone || '').trim(), medicines: (req.body.medicines || []).map(clean), notes: String(req.body.notes || '').trim() };
  if (!payload.patientName || (!payload.patientEmail && !payload.patientPhone)) return res.status(400).json({ error: 'Patient name and email or phone are required' });
  if (!payload.medicines.length || payload.medicines.some((m) => !m.medicineName || !m.dosage || !m.frequency || !m.duration || !Number.isFinite(m.quantity) || m.quantity < 1)) return res.status(400).json({ error: 'Each medicine needs a name, dosage, quantity, frequency, and duration' });
  try { return res.status(201).json(await Prescription.create({ ...payload, prescriptionId: id(), doctorId: req.user.id, doctorName: req.user.name })); }
  catch (error) { return res.status(400).json({ error: error.message }); }
}

export async function getPrescription(req, res) {
  if (unavailable(res)) return;
  try { const item = await Prescription.findOne({ prescriptionId: String(req.params.prescriptionId || '').trim().toUpperCase() }); return item ? res.json(item) : res.status(404).json({ error: 'Prescription not found. Please check the Prescription ID and try again.' }); }
  catch (error) { return res.status(400).json({ error: error.message }); }
}

export async function listPrescriptions(req, res) {
  if (unavailable(res)) return;
  const search = String(req.query.search || '').trim();
  const filter = { doctorId: req.user.id };
  if (search) filter.$or = ['prescriptionId', 'patientName', 'patientEmail', 'patientPhone'].map((field) => ({ [field]: new RegExp(search, 'i') }));
  try { return res.json(await Prescription.find(filter).sort({ createdAt: -1 })); }
  catch (error) { return res.status(500).json({ error: error.message }); }
}
