import { query } from '../config/db.js';

// Get comprehensive hospital dashboard metrics
export async function getDashboardStats(req, res, next) {
  try {
    const [
      [patientCount],
      [doctorCount],
      [departmentCount],
      [appointmentsToday],
      [unpaidBills],
      [revenueResult],
      [roomStats],
      [medicineCount],
      [serviceCount]
    ] = await Promise.all([
      query('SELECT COUNT(*) AS total FROM patients'),
      query('SELECT COUNT(*) AS total FROM doctors'),
      query('SELECT COUNT(*) AS total FROM departments'),
      query("SELECT COUNT(*) AS total FROM appointments WHERE AppointmentDate = CURDATE() AND Status != 'Cancelled'"),
      query("SELECT COUNT(*) AS total FROM bills WHERE Status IN ('Unpaid', 'Partially Paid')"),
      query("SELECT COALESCE(SUM(AmountPaid), 0) AS totalRevenue FROM payments WHERE Status = 'Completed'"),
      query(`
        SELECT 
          COUNT(*) AS totalRooms,
          COALESCE(SUM(BedCount), 0) AS totalBeds,
          COALESCE(SUM(CASE WHEN OccupancyStatus = 'Available' THEN 1 ELSE 0 END), 0) AS availableRooms,
          COALESCE(SUM(CASE WHEN OccupancyStatus = 'Occupied' THEN 1 ELSE 0 END), 0) AS occupiedRooms
        FROM rooms
      `),
      query('SELECT COUNT(*) AS total FROM medicines WHERE IsActive = TRUE'),
      query('SELECT COUNT(*) AS total FROM services WHERE IsActive = TRUE')
    ]);

    // Fetch recent 5 appointments
    const recentAppointments = await query(`
      SELECT a.AppointmentID, a.AppointmentDate, a.StartTime, a.Status, a.Type,
             CONCAT(p.FirstName, ' ', COALESCE(p.LastName, '')) AS PatientName,
             CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName,
             dept.DepartmentName
      FROM appointments a
      JOIN patients p ON a.PatientID = p.PatientID
      JOIN doctors d ON a.DoctorID = d.DoctorID
      JOIN departments dept ON d.DepartmentID = dept.DepartmentID
      ORDER BY a.AppointmentDate DESC, a.StartTime DESC
      LIMIT 5
    `);

    // Fetch recent 5 payments
    const recentPayments = await query(`
      SELECT p.PaymentID, p.BillID, p.PaymentDate, p.PaymentMethod, p.AmountPaid, p.Status,
             CONCAT(pat.FirstName, ' ', COALESCE(pat.LastName, '')) AS PatientName
      FROM payments p
      JOIN bills b ON p.BillID = b.BillID
      JOIN patients pat ON b.PatientID = pat.PatientID
      ORDER BY p.PaymentID DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        patients: patientCount.total,
        doctors: doctorCount.total,
        departments: departmentCount.total,
        appointmentsToday: appointmentsToday.total,
        unpaidBills: unpaidBills.total,
        totalRevenue: parseFloat(revenueResult.totalRevenue || 0),
        totalBeds: parseInt(roomStats.totalBeds || 0, 10),
        availableRooms: parseInt(roomStats.availableRooms || 0, 10),
        occupiedRooms: parseInt(roomStats.occupiedRooms || 0, 10),
        activeMedicines: medicineCount.total,
        activeServices: serviceCount.total
      },
      recentAppointments,
      recentPayments
    });
  } catch (error) {
    next(error);
  }
}
