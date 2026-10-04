import { query } from '../config/db.js';

// Get all patients with optional search filter
export async function getAllPatients(req, res, next) {
  try {
    const { q } = req.query;
    let sql = 'SELECT * FROM patients';
    let params = [];

    if (q) {
      sql += ` WHERE FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ? OR AadhaarNo LIKE ?`;
      const searchPattern = `%${q}%`;
      params = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern];
    }

    sql += ' ORDER BY PatientID DESC';
    const patients = await query(sql, params);
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    next(error);
  }
}

// Get single patient by ID
export async function getPatientById(req, res, next) {
  try {
    const { id } = req.params;
    const patients = await query('SELECT * FROM patients WHERE PatientID = ?', [id]);

    if (patients.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    res.json({ success: true, data: patients[0] });
  } catch (error) {
    next(error);
  }
}

// Get complete aggregated medical and billing profile of a patient
export async function getPatientFullProfile(req, res, next) {
  try {
    const { id } = req.params;
    const patients = await query('SELECT * FROM patients WHERE PatientID = ?', [id]);

    if (patients.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const patient = patients[0];

    // Parallel fetching of related clinical and billing data
    const [medicalHistories, insurances, appointments, bills] = await Promise.all([
      query('SELECT * FROM medical_histories WHERE PatientID = ? ORDER BY CreatedAt DESC', [id]),
      query('SELECT * FROM insurances WHERE PatientID = ? ORDER BY InsuranceID DESC', [id]),
      query(`
        SELECT a.*, 
               CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName,
               dept.DepartmentName
        FROM appointments a
        LEFT JOIN doctors d ON a.DoctorID = d.DoctorID
        LEFT JOIN departments dept ON d.DepartmentID = dept.DepartmentID
        WHERE a.PatientID = ?
        ORDER BY a.AppointmentDate DESC, a.StartTime DESC
      `, [id]),
      query(`
        SELECT b.*,
               COALESCE(SUM(p.AmountPaid), 0) AS PaidAmount
        FROM bills b
        LEFT JOIN payments p ON b.BillID = p.BillID AND p.Status = 'Completed'
        WHERE b.PatientID = ?
        GROUP BY b.BillID
        ORDER BY b.BillDate DESC
      `, [id])
    ]);

    // Fetch prescriptions related to the patient's appointments
    const appointmentIds = appointments.map(a => a.AppointmentID);
    let prescriptions = [];
    if (appointmentIds.length > 0) {
      prescriptions = await query(`
        SELECT p.*,
               CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName
        FROM prescriptions p
        LEFT JOIN doctors d ON p.DoctorID = d.DoctorID
        WHERE p.AppointmentID IN (?)
        ORDER BY p.PrescriptionID DESC
      `, [appointmentIds]);

      // Fetch items for these prescriptions
      const prescriptionIds = prescriptions.map(p => p.PrescriptionID);
      if (prescriptionIds.length > 0) {
        const items = await query(`
          SELECT pi.*, m.MedicineName, m.Category
          FROM prescription_items pi
          LEFT JOIN medicines m ON pi.MedicineID = m.MedicineID
          WHERE pi.PrescriptionID IN (?)
        `, [prescriptionIds]);

        prescriptions = prescriptions.map(rx => ({
          ...rx,
          items: items.filter(it => it.PrescriptionID === rx.PrescriptionID)
        }));
      }
    }

    res.json({
      success: true,
      data: {
        ...patient,
        medicalHistories,
        insurances,
        appointments,
        prescriptions,
        bills
      }
    });
  } catch (error) {
    next(error);
  }
}

// Create new patient
export async function createPatient(req, res, next) {
  try {
    const {
      AadhaarNo,
      FirstName,
      LastName,
      DOB,
      Gender,
      BloodGroup,
      Phone,
      Email,
      Address,
      EmergencyContactName,
      EmergencyContactPhone,
      RegistrationDate = new Date().toISOString().slice(0, 10)
    } = req.body;

    if (!FirstName || !Phone) {
      return res.status(400).json({ success: false, message: 'FirstName and Phone are required.' });
    }

    const result = await query(
      `INSERT INTO patients 
       (AadhaarNo, FirstName, LastName, DOB, Gender, BloodGroup, Phone, Email, Address, EmergencyContactName, EmergencyContactPhone, RegistrationDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        AadhaarNo || null,
        FirstName,
        LastName || null,
        DOB || null,
        Gender || null,
        BloodGroup || null,
        Phone,
        Email || null,
        Address || null,
        EmergencyContactName || null,
        EmergencyContactPhone || null,
        RegistrationDate
      ]
    );

    const newPatient = await query('SELECT * FROM patients WHERE PatientID = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: newPatient[0]
    });
  } catch (error) {
    next(error);
  }
}

// Update patient
export async function updatePatient(req, res, next) {
  try {
    const { id } = req.params;
    const {
      AadhaarNo,
      FirstName,
      LastName,
      DOB,
      Gender,
      BloodGroup,
      Phone,
      Email,
      Address,
      EmergencyContactName,
      EmergencyContactPhone,
      RegistrationDate
    } = req.body;

    const existing = await query('SELECT * FROM patients WHERE PatientID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    await query(
      `UPDATE patients 
       SET AadhaarNo = ?, FirstName = ?, LastName = ?, DOB = ?, Gender = ?, BloodGroup = ?, 
           Phone = ?, Email = ?, Address = ?, EmergencyContactName = ?, EmergencyContactPhone = ?, RegistrationDate = ?
       WHERE PatientID = ?`,
      [
        AadhaarNo ?? existing[0].AadhaarNo,
        FirstName ?? existing[0].FirstName,
        LastName ?? existing[0].LastName,
        DOB ?? existing[0].DOB,
        Gender ?? existing[0].Gender,
        BloodGroup ?? existing[0].BloodGroup,
        Phone ?? existing[0].Phone,
        Email ?? existing[0].Email,
        Address ?? existing[0].Address,
        EmergencyContactName ?? existing[0].EmergencyContactName,
        EmergencyContactPhone ?? existing[0].EmergencyContactPhone,
        RegistrationDate ?? existing[0].RegistrationDate,
        id
      ]
    );

    const updated = await query('SELECT * FROM patients WHERE PatientID = ?', [id]);
    res.json({ success: true, message: 'Patient updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete patient
export async function deletePatient(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM patients WHERE PatientID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    await query('DELETE FROM patients WHERE PatientID = ?', [id]);
    res.json({ success: true, message: 'Patient deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
