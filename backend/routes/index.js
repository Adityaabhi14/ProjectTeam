import express from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import departmentRoutes from './departmentRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import medicalHistoryRoutes from './medicalHistoryRoutes.js';
import insuranceRoutes from './insuranceRoutes.js';
import prescriptionRoutes from './prescriptionRoutes.js';
import medicineRoutes from './medicineRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import billRoutes from './billRoutes.js';
import billItemRoutes from './billItemRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import floorWardRoutes from './floorWardRoutes.js';
import roomRoutes from './roomRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CarePoint Hospital Management System API',
    database: 'MySQL',
    timestamp: new Date().toISOString()
  });
});

// Domain Routes
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/departments', departmentRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-histories', medicalHistoryRoutes);
router.use('/insurances', insuranceRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/medicines', medicineRoutes);
router.use('/services', serviceRoutes);
router.use('/bills', billRoutes);
router.use('/bill-items', billItemRoutes);
router.use('/payments', paymentRoutes);
router.use('/floor-wards', floorWardRoutes);
router.use('/rooms', roomRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
