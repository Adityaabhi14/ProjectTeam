import { query } from '../config/db.js';

// Get all appointments with patient, doctor, and department details
export async function getAllAppointments(req, res, next) {
  try {
    const { date, patientId, doctorId, status, q } = req.query;
    let sql = `
      SELECT a.*,
             p.FirstName AS PatientFirstName, p.LastName AS PatientLastName, p.Phone AS PatientPhone,
             CONCAT(p.FirstName, ' ', COALESCE(p.LastName, '')) AS PatientName,
             d.FirstName AS DoctorFirstName, d.LastName AS DoctorLastName,
             CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName,
             d.ConsultationFee,
             dept.DepartmentName
      FROM appointments a
      JOIN patients p ON a.PatientID = p.PatientID
      JOIN doctors d ON a.DoctorID = d.DoctorID
      JOIN departments dept ON d.DepartmentID = dept.DepartmentID
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      sql += ' AND a.AppointmentDate = ?';
      params.push(date);
    }
    if (patientId) {
      sql += ' AND a.PatientID = ?';
      params.push(patientId);
    }
    if (doctorId) {
      sql += ' AND a.DoctorID = ?';
      params.push(doctorId);
    }
    if (status) {
      sql += ' AND a.Status = ?';
      params.push(status);
    }
    if (q) {
      sql += ' AND (p.FirstName LIKE ? OR p.LastName LIKE ? OR p.Phone LIKE ? OR d.FirstName LIKE ? OR d.LastName LIKE ? OR a.Reason LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p, p, p, p);
    }

    sql += ' ORDER BY a.AppointmentDate DESC, a.StartTime ASC';
    const appointments = await query(sql, params);
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
}

// Get single appointment by ID
export async function getAppointmentById(req, res, next) {
  try {
    const { id } = req.params;
    const appointments = await query(`
      SELECT a.*,
             p.FirstName AS PatientFirstName, p.LastName AS PatientLastName, p.Phone AS PatientPhone, p.Email AS PatientEmail,
             CONCAT(p.FirstName, ' ', COALESCE(p.LastName, '')) AS PatientName,
             d.FirstName AS DoctorFirstName, d.LastName AS DoctorLastName,
             CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName,
             d.Specialization, d.ConsultationFee,
             dept.DepartmentName, dept.Location AS DepartmentLocation
      FROM appointments a
      JOIN patients p ON a.PatientID = p.PatientID
      JOIN doctors d ON a.DoctorID = d.DoctorID
      JOIN departments dept ON d.DepartmentID = dept.DepartmentID
      WHERE a.AppointmentID = ?
    `, [id]);

    if (appointments.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.json({ success: true, data: appointments[0] });
  } catch (error) {
    next(error);
  }
}

// Create new appointment
export async function createAppointment(req, res, next) {
  try {
    const {
      PatientID,
      DoctorID,
      AppointmentDate,
      StartTime,
      EndTime,
      Type = 'Consultation',
      Reason,
      Status = 'Scheduled',
      CreatedAt = new Date().toISOString().slice(0, 10)
    } = req.body;

    if (!PatientID || !DoctorID || !AppointmentDate) {
      return res.status(400).json({ success: false, message: 'PatientID, DoctorID, and AppointmentDate are required.' });
    }

    // Verify patient and doctor exist
    const [patient] = await query('SELECT PatientID FROM patients WHERE PatientID = ?', [PatientID]);
    if (!patient) return res.status(400).json({ success: false, message: 'Patient does not exist.' });

    const [doctor] = await query('SELECT DoctorID FROM doctors WHERE DoctorID = ?', [DoctorID]);
    if (!doctor) return res.status(400).json({ success: false, message: 'Doctor does not exist.' });

    const result = await query(
      `INSERT INTO appointments 
       (PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Type, Reason, Status, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [PatientID, DoctorID, AppointmentDate, StartTime || null, EndTime || null, Type, Reason || null, Status, CreatedAt]
    );

    const newApp = await query('SELECT * FROM appointments WHERE AppointmentID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Appointment created successfully.', data: newApp[0] });
  } catch (error) {
    next(error);
  }
}

// Public or Portal Quick Book Endpoint (Auto-registers patient if not existing)
export async function bookAppointment(req, res, next) {
  try {
    const { name, phone, email, doctorId, date, time, reason } = req.body;

    if (!name || !phone || !doctorId || !date) {
      return res.status(400).json({ success: false, message: 'Name, Phone, Doctor ID, and Preferred Date are required.' });
    }

    // Check if patient exists by phone
    let patient = await query('SELECT * FROM patients WHERE Phone = ?', [phone]);
    let patientId;

    if (patient.length === 0) {
      // Split name into First and Last
      const parts = name.trim().split(/\s+/);
      const firstName = parts[0];
      const lastName = parts.slice(1).join(' ') || null;

      const pResult = await query(
        `INSERT INTO patients (FirstName, LastName, Phone, Email, RegistrationDate)
         VALUES (?, ?, ?, ?, CURDATE())`,
        [firstName, lastName, phone, email || null]
      );
      patientId = pResult.insertId;
    } else {
      patientId = patient[0].PatientID;
    }

    // Insert Appointment
    const appResult = await query(
      `INSERT INTO appointments (PatientID, DoctorID, AppointmentDate, StartTime, Type, Reason, Status, CreatedAt)
       VALUES (?, ?, ?, ?, 'Consultation', ?, 'Scheduled', CURDATE())`,
      [patientId, doctorId, date, time || null, reason || 'Online web booking']
    );

    res.status(201).json({
      success: true,
      message: `Appointment #${appResult.insertId} requested successfully. Our team will contact you.`,
      appointmentId: appResult.insertId,
      patientId
    });
  } catch (error) {
    next(error);
  }
}

// Update appointment
export async function updateAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const {
      PatientID,
      DoctorID,
      AppointmentDate,
      StartTime,
      EndTime,
      Type,
      Reason,
      Status,
      CreatedAt
    } = req.body;

    const existing = await query('SELECT * FROM appointments WHERE AppointmentID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    await query(
      `UPDATE appointments 
       SET PatientID = ?, DoctorID = ?, AppointmentDate = ?, StartTime = ?, EndTime = ?,
           Type = ?, Reason = ?, Status = ?, CreatedAt = ?
       WHERE AppointmentID = ?`,
      [
        PatientID ?? existing[0].PatientID,
        DoctorID ?? existing[0].DoctorID,
        AppointmentDate ?? existing[0].AppointmentDate,
        StartTime ?? existing[0].StartTime,
        EndTime ?? existing[0].EndTime,
        Type ?? existing[0].Type,
        Reason ?? existing[0].Reason,
        Status ?? existing[0].Status,
        CreatedAt ?? existing[0].CreatedAt,
        id
      ]
    );

    const updated = await query('SELECT * FROM appointments WHERE AppointmentID = ?', [id]);
    res.json({ success: true, message: 'Appointment updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete appointment
export async function deleteAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM appointments WHERE AppointmentID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    await query('DELETE FROM appointments WHERE AppointmentID = ?', [id]);
    res.json({ success: true, message: 'Appointment deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
