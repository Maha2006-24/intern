import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';
import { isMongoConnected } from '../config/db.js';

export async function doctorLogin(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  if (!isMongoConnected()) return res.status(503).json({ error: 'Doctor login requires a MongoDB connection' });
  try {
    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor || !(await doctor.comparePassword(password))) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ sub: doctor._id.toString(), role: 'doctor', name: doctor.name }, process.env.JWT_SECRET || 'change-this-development-secret', { expiresIn: '8h' });
    return res.json({ role: 'doctor', token, user: { id: doctor._id, name: doctor.name, email: doctor.email, role: 'doctor' } });
  } catch (error) { return res.status(500).json({ error: error.message }); }
}
