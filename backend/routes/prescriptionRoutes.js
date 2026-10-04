import express from 'express';
import {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  addPrescriptionItem,
  deletePrescriptionItem
} from '../controllers/prescriptionController.js';

const router = express.Router();

router.get('/', getAllPrescriptions);
router.get('/:id', getPrescriptionById);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

// Prescription items sub-routes
router.post('/:id/items', addPrescriptionItem);
router.delete('/:id/items/:itemId', deletePrescriptionItem);

export default router;
