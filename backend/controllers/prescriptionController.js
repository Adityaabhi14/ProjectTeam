import { query, pool } from '../config/db.js';

// Get all prescriptions with appointment, patient, doctor, and prescription items
export async function getAllPrescriptions(req, res, next) {
  try {
    const { appointmentId, doctorId, patientId, q } = req.query;
    let sql = `
      SELECT p.*,
             a.AppointmentDate, a.PatientID,
             pat.FirstName AS PatientFirstName, pat.LastName AS PatientLastName,
             CONCAT(pat.FirstName, ' ', COALESCE(pat.LastName, '')) AS PatientName,
             d.FirstName AS DoctorFirstName, d.LastName AS DoctorLastName,
             CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName
      FROM prescriptions p
      JOIN appointments a ON p.AppointmentID = a.AppointmentID
      JOIN patients pat ON a.PatientID = pat.PatientID
      JOIN doctors d ON p.DoctorID = d.DoctorID
      WHERE 1=1
    `;
    const params = [];

    if (appointmentId) {
      sql += ' AND p.AppointmentID = ?';
      params.push(appointmentId);
    }
    if (doctorId) {
      sql += ' AND p.DoctorID = ?';
      params.push(doctorId);
    }
    if (patientId) {
      sql += ' AND a.PatientID = ?';
      params.push(patientId);
    }
    if (q) {
      sql += ' AND (pat.FirstName LIKE ? OR pat.LastName LIKE ? OR d.FirstName LIKE ? OR d.LastName LIKE ? OR p.Description LIKE ?)';
      const pattern = `%${q}%`;
      params.push(pattern, pattern, pattern, pattern, pattern);
    }

    sql += ' ORDER BY p.PrescriptionID DESC';
    const prescriptions = await query(sql, params);

    // Fetch items for all returned prescriptions
    const rxIds = prescriptions.map(rx => rx.PrescriptionID);
    if (rxIds.length > 0) {
      const items = await query(`
        SELECT pi.*, m.MedicineName, m.Category, m.UnitPrice
        FROM prescription_items pi
        JOIN medicines m ON pi.MedicineID = m.MedicineID
        WHERE pi.PrescriptionID IN (?)
      `, [rxIds]);

      const itemsByRx = {};
      items.forEach(item => {
        if (!itemsByRx[item.PrescriptionID]) itemsByRx[item.PrescriptionID] = [];
        itemsByRx[item.PrescriptionID].push(item);
      });

      prescriptions.forEach(rx => {
        rx.items = itemsByRx[rx.PrescriptionID] || [];
      });
    }

    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (error) {
    next(error);
  }
}

// Get single prescription by ID with full item details
export async function getPrescriptionById(req, res, next) {
  try {
    const { id } = req.params;
    const prescriptions = await query(`
      SELECT p.*,
             a.AppointmentDate, a.PatientID,
             pat.FirstName AS PatientFirstName, pat.LastName AS PatientLastName,
             CONCAT(pat.FirstName, ' ', COALESCE(pat.LastName, '')) AS PatientName,
             d.FirstName AS DoctorFirstName, d.LastName AS DoctorLastName,
             CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName,
             dept.DepartmentName
      FROM prescriptions p
      JOIN appointments a ON p.AppointmentID = a.AppointmentID
      JOIN patients pat ON a.PatientID = pat.PatientID
      JOIN doctors d ON p.DoctorID = d.DoctorID
      JOIN departments dept ON d.DepartmentID = dept.DepartmentID
      WHERE p.PrescriptionID = ?
    `, [id]);

    if (prescriptions.length === 0) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    const items = await query(`
      SELECT pi.*, m.MedicineName, m.Category, m.UnitPrice
      FROM prescription_items pi
      JOIN medicines m ON pi.MedicineID = m.MedicineID
      WHERE pi.PrescriptionID = ?
    `, [id]);

    res.json({
      success: true,
      data: {
        ...prescriptions[0],
        items
      }
    });
  } catch (error) {
    next(error);
  }
}

// Create new prescription (optionally with items in one transaction)
export async function createPrescription(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const { AppointmentID, DoctorID, Description, Notes, items = [] } = req.body;

    if (!AppointmentID || !DoctorID) {
      return res.status(400).json({ success: false, message: 'AppointmentID and DoctorID are required.' });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO prescriptions (AppointmentID, DoctorID, Description, Notes)
       VALUES (?, ?, ?, ?)`,
      [AppointmentID, DoctorID, Description || null, Notes || null]
    );

    const prescriptionId = result.insertId;

    // Insert prescription items if provided
    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        if (it.MedicineID) {
          await connection.query(
            `INSERT INTO prescription_items (PrescriptionID, MedicineID, Dose, Frequency, Duration, Instructions)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [prescriptionId, it.MedicineID, it.Dose || null, it.Frequency || null, it.Duration || null, it.Instructions || null]
          );
        }
      }
    }

    await connection.commit();

    const [created] = await connection.query('SELECT * FROM prescriptions WHERE PrescriptionID = ?', [prescriptionId]);
    const [createdItems] = await connection.query(`
      SELECT pi.*, m.MedicineName 
      FROM prescription_items pi 
      JOIN medicines m ON pi.MedicineID = m.MedicineID 
      WHERE pi.PrescriptionID = ?
    `, [prescriptionId]);

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully.',
      data: {
        ...created[0],
        items: createdItems
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

// Update prescription header
export async function updatePrescription(req, res, next) {
  try {
    const { id } = req.params;
    const { AppointmentID, DoctorID, Description, Notes } = req.body;

    const existing = await query('SELECT * FROM prescriptions WHERE PrescriptionID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    await query(
      `UPDATE prescriptions 
       SET AppointmentID = ?, DoctorID = ?, Description = ?, Notes = ?
       WHERE PrescriptionID = ?`,
      [
        AppointmentID ?? existing[0].AppointmentID,
        DoctorID ?? existing[0].DoctorID,
        Description ?? existing[0].Description,
        Notes ?? existing[0].Notes,
        id
      ]
    );

    const updated = await query('SELECT * FROM prescriptions WHERE PrescriptionID = ?', [id]);
    res.json({ success: true, message: 'Prescription updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete prescription
export async function deletePrescription(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM prescriptions WHERE PrescriptionID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Prescription not found.' });
    }

    await query('DELETE FROM prescriptions WHERE PrescriptionID = ?', [id]);
    res.json({ success: true, message: 'Prescription deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

// --- Prescription Item Endpoints ---

// Add item to prescription
export async function addPrescriptionItem(req, res, next) {
  try {
    const { PrescriptionID, MedicineID, Dose, Frequency, Duration, Instructions } = req.body;

    if (!PrescriptionID || !MedicineID) {
      return res.status(400).json({ success: false, message: 'PrescriptionID and MedicineID are required.' });
    }

    const result = await query(
      `INSERT INTO prescription_items (PrescriptionID, MedicineID, Dose, Frequency, Duration, Instructions)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [PrescriptionID, MedicineID, Dose || null, Frequency || null, Duration || null, Instructions || null]
    );

    const newItem = await query(`
      SELECT pi.*, m.MedicineName 
      FROM prescription_items pi 
      JOIN medicines m ON pi.MedicineID = m.MedicineID 
      WHERE pi.PrescriptionItemID = ?
    `, [result.insertId]);

    res.status(201).json({ success: true, message: 'Prescription item added.', data: newItem[0] });
  } catch (error) {
    next(error);
  }
}

// Delete item from prescription
export async function deletePrescriptionItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const existing = await query('SELECT * FROM prescription_items WHERE PrescriptionItemID = ?', [itemId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Prescription item not found.' });
    }

    await query('DELETE FROM prescription_items WHERE PrescriptionItemID = ?', [itemId]);
    res.json({ success: true, message: 'Prescription item deleted.' });
  } catch (error) {
    next(error);
  }
}
