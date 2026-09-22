import { Router } from 'express';
import { createPrescription, getPrescription, listPrescriptions } from '../controllers/prescriptionController.js';
import { requireDoctor } from '../middleware/doctorAuth.js';
const router = Router();
router.get('/doctor/:doctorId', requireDoctor, (req, res, next) => req.user.id === req.params.doctorId ? next() : res.status(403).json({ error: 'Forbidden' }), listPrescriptions);
router.get('/', requireDoctor, listPrescriptions);
router.post('/', requireDoctor, createPrescription);
router.get('/:prescriptionId', getPrescription);
export default router;
