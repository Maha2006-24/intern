import { Router } from 'express';
import { listMedicines, getMedicine, addMedicine, updateMedicine, deleteMedicine } from '../controllers/medicineController.js';

const router = Router();
router.get('/', listMedicines);
router.get('/:id', getMedicine);
router.post('/', addMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

export default router;
