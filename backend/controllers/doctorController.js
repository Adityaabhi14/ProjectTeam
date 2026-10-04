import { query } from '../config/db.js';

// Get all doctors with department information
export async function getAllDoctors(req, res, next) {
  try {
    const { departmentId, q } = req.query;
    let sql = `
      SELECT d.*, dept.DepartmentName, dept.Location AS DepartmentLocation
      FROM doctors d
      LEFT JOIN departments dept ON d.DepartmentID = dept.DepartmentID
      WHERE 1=1
    `;
    const params = [];

    if (departmentId) {
      sql += ' AND d.DepartmentID = ?';
      params.push(departmentId);
    }

    if (q) {
      sql += ' AND (d.FirstName LIKE ? OR d.LastName LIKE ? OR d.Specialization LIKE ? OR dept.DepartmentName LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p, p);
    }

    sql += ' ORDER BY d.DoctorID ASC';
    const doctors = await query(sql, params);
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    next(error);
  }
}

// Get doctor by ID with upcoming appointments count
export async function getDoctorById(req, res, next) {
  try {
    const { id } = req.params;
    const doctors = await query(`
      SELECT d.*, dept.DepartmentName, dept.Location AS DepartmentLocation, dept.PhoneNo AS DepartmentPhone
      FROM doctors d
      LEFT JOIN departments dept ON d.DepartmentID = dept.DepartmentID
      WHERE d.DoctorID = ?
    `, [id]);

    if (doctors.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    // Fetch upcoming appointments count
    const [appCount] = await query(`
      SELECT COUNT(*) AS upcomingCount 
      FROM appointments 
      WHERE DoctorID = ? AND AppointmentDate >= CURDATE() AND Status = 'Scheduled'
    `, [id]);

    res.json({
      success: true,
      data: {
        ...doctors[0],
        upcomingAppointments: appCount ? appCount.upcomingCount : 0
      }
    });
  } catch (error) {
    next(error);
  }
}

// Create new doctor
export async function createDoctor(req, res, next) {
  try {
    const {
      DepartmentID,
      FirstName,
      LastName,
      Gender,
      Qualification,
      Specialization,
      Phone,
      Email,
      ConsultationFee = 0.00,
      JoiningDate
    } = req.body;

    if (!DepartmentID || !FirstName || !LastName) {
      return res.status(400).json({ success: false, message: 'DepartmentID, FirstName, and LastName are required.' });
    }

    // Verify department exists
    const dept = await query('SELECT DepartmentID FROM departments WHERE DepartmentID = ?', [DepartmentID]);
    if (dept.length === 0) {
      return res.status(400).json({ success: false, message: 'Specified DepartmentID does not exist.' });
    }

    const result = await query(
      `INSERT INTO doctors 
       (DepartmentID, FirstName, LastName, Gender, Qualification, Specialization, Phone, Email, ConsultationFee, JoiningDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [DepartmentID, FirstName, LastName, Gender || null, Qualification || null, Specialization || null, Phone || null, Email || null, ConsultationFee, JoiningDate || null]
    );

    const newDoctor = await query(`
      SELECT d.*, dept.DepartmentName 
      FROM doctors d 
      LEFT JOIN departments dept ON d.DepartmentID = dept.DepartmentID 
      WHERE d.DoctorID = ?
    `, [result.insertId]);

    res.status(201).json({ success: true, message: 'Doctor created successfully.', data: newDoctor[0] });
  } catch (error) {
    next(error);
  }
}

// Update doctor
export async function updateDoctor(req, res, next) {
  try {
    const { id } = req.params;
    const {
      DepartmentID,
      FirstName,
      LastName,
      Gender,
      Qualification,
      Specialization,
      Phone,
      Email,
      ConsultationFee,
      JoiningDate
    } = req.body;

    const existing = await query('SELECT * FROM doctors WHERE DoctorID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    await query(
      `UPDATE doctors 
       SET DepartmentID = ?, FirstName = ?, LastName = ?, Gender = ?, Qualification = ?,
           Specialization = ?, Phone = ?, Email = ?, ConsultationFee = ?, JoiningDate = ?
       WHERE DoctorID = ?`,
      [
        DepartmentID ?? existing[0].DepartmentID,
        FirstName ?? existing[0].FirstName,
        LastName ?? existing[0].LastName,
        Gender ?? existing[0].Gender,
        Qualification ?? existing[0].Qualification,
        Specialization ?? existing[0].Specialization,
        Phone ?? existing[0].Phone,
        Email ?? existing[0].Email,
        ConsultationFee ?? existing[0].ConsultationFee,
        JoiningDate ?? existing[0].JoiningDate,
        id
      ]
    );

    const updated = await query(`
      SELECT d.*, dept.DepartmentName 
      FROM doctors d 
      LEFT JOIN departments dept ON d.DepartmentID = dept.DepartmentID 
      WHERE d.DoctorID = ?
    `, [id]);

    res.json({ success: true, message: 'Doctor updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete doctor
export async function deleteDoctor(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM doctors WHERE DoctorID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    await query('DELETE FROM doctors WHERE DoctorID = ?', [id]);
    res.json({ success: true, message: 'Doctor deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
