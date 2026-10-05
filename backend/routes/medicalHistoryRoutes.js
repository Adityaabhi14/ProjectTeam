import express from 'express';
import {
  getAllMedicalHistories,
  getMedicalHistoryById,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory
} from '../controllers/medicalHistoryController.js';

const router = express.Router();

router.get('/', getAllMedicalHistories);
router.get('/:id', getMedicalHistoryById);
router.post('/', createMedicalHistory);
router.put('/:id', updateMedicalHistory);
router.delete('/:id', deleteMedicalHistory);

export default router;
