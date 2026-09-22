import Medicine from '../models/Medicine.js';
import { isMongoConnected } from '../config/db.js';
import { createLegacyId, readLegacyData, writeLegacyData } from '../data/legacyStore.js';

function normalizeMedicinePayload(payload) {
  return {
    name: String(payload.name || '').trim(),
    category: String(payload.category || 'General').trim() || 'General',
    price: Number(payload.price || 0),
    stock: Number(payload.stock || 0),
    description: String(payload.description || ''),
    expiryDate: String(payload.expiryDate || ''),
  };
}

function validateMedicinePayload(medicine) {
  if (!medicine.name) {
    return 'Medicine name is required';
  }

  if (Number.isNaN(medicine.price) || medicine.price < 0) {
    return 'Medicine price must be a valid number';
  }

  if (Number.isNaN(medicine.stock) || medicine.stock < 0) {
    return 'Medicine stock must be a valid number';
  }

  return null;
}

async function listMedicines(req, res) {
  try {
    if (isMongoConnected()) {
      const medicines = await Medicine.find().sort({ createdAt: -1 });
      return res.json(medicines);
    }

    const data = await readLegacyData();
    const medicines = [...(data.medicines || [])].reverse();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMedicine(req, res) {
  try {
    if (isMongoConnected()) {
      const medicine = await Medicine.findById(req.params.id);
      if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
      return res.json(medicine);
    }

    const data = await readLegacyData();
    const medicine = (data.medicines || []).find((item) => item.id === req.params.id);
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function addMedicine(req, res) {
  try {
    const payload = normalizeMedicinePayload(req.body);
    const validationError = validateMedicinePayload(payload);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (isMongoConnected()) {
      const medicine = await Medicine.create(payload);
      return res.status(201).json(medicine);
    }

    const data = await readLegacyData();
    const medicine = {
      id: createLegacyId('m'),
      ...payload,
    };

    data.medicines = [medicine, ...(data.medicines || [])];
    await writeLegacyData(data);

    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateMedicine(req, res) {
  try {
    const payload = normalizeMedicinePayload(req.body);
    const validationError = validateMedicinePayload(payload);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (isMongoConnected()) {
      const medicine = await Medicine.findByIdAndUpdate(req.params.id, payload, {
        new: true,
        runValidators: true,
      });
      if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
      return res.json(medicine);
    }

    const data = await readLegacyData();
    const medicineIndex = (data.medicines || []).findIndex((item) => item.id === req.params.id);
    if (medicineIndex === -1) return res.status(404).json({ error: 'Medicine not found' });

    data.medicines[medicineIndex] = {
      ...data.medicines[medicineIndex],
      ...payload,
    };
    await writeLegacyData(data);

    res.json(data.medicines[medicineIndex]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteMedicine(req, res) {
  try {
    if (isMongoConnected()) {
      const medicine = await Medicine.findByIdAndDelete(req.params.id);
      if (!medicine) return res.status(404).json({ error: 'Medicine not found' });
      return res.status(204).end();
    }

    const data = await readLegacyData();
    const medicines = data.medicines || [];
    const exists = medicines.some((item) => item.id === req.params.id);
    if (!exists) return res.status(404).json({ error: 'Medicine not found' });

    data.medicines = medicines.filter((item) => item.id !== req.params.id);
    await writeLegacyData(data);

    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export { listMedicines, getMedicine, addMedicine, updateMedicine, deleteMedicine };
