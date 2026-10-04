import express from 'express';
import {
  getAllInsurances,
  getInsuranceById,
  createInsurance,
  updateInsurance,
  deleteInsurance
} from '../controllers/insuranceController.js';

const router = express.Router();

router.get('/', getAllInsurances);
router.get('/:id', getInsuranceById);
router.post('/', createInsurance);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

export default router;
