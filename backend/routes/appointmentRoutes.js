import express from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  bookAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.post('/book', bookAppointment); // Public/online booking endpoint
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
