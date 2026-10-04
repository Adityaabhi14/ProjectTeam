import express from 'express';
import {
  getAllFloorWards,
  getFloorWardById,
  createFloorWard,
  updateFloorWard,
  deleteFloorWard
} from '../controllers/floorWardController.js';

const router = express.Router();

router.get('/', getAllFloorWards);
router.get('/:id', getFloorWardById);
router.post('/', createFloorWard);
router.put('/:id', updateFloorWard);
router.delete('/:id', deleteFloorWard);

export default router;
