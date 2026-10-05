import express from 'express';
import {
  getAllPatients,
  getPatientById,
  getPatientFullProfile,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patientController.js';

const router = express.Router();

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.get('/:id/full-profile', getPatientFullProfile);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
