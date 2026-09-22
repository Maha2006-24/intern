import Supplier from "../models/Supplier.js";
import { isMongoConnected } from "../config/db.js";
import { readLegacyData } from "../data/legacyStore.js";

export async function listSuppliers(req, res) {
  try {
    if (isMongoConnected()) {
      const suppliers = await Supplier.find().sort({
        createdAt: -1,
      });

      return res.json(suppliers);
    }

    const data = await readLegacyData();

    res.json(data.suppliers || []);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
}

export async function createSupplier(req, res) {
  try {

    const supplier = await Supplier.create(req.body);

    res.status(201).json(supplier);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
}

export async function updateSupplier(req, res) {
  try {

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(supplier);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
}

export async function deleteSupplier(req, res) {
  try {

    await Supplier.findByIdAndDelete(req.params.id);

    res.json({
      message: "Supplier Deleted Successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
}