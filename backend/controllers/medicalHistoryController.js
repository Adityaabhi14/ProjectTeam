import { query } from '../config/db.js';

// Get all medical histories with patient info
export async function getAllMedicalHistories(req, res, next) {
  try {
    const { patientId, q } = req.query;
    let sql = `
      SELECT mh.*, 
             CONCAT(p.FirstName, ' ', COALESCE(p.LastName, '')) AS PatientName,
             p.Phone AS PatientPhone
      FROM medical_histories mh
      JOIN patients p ON mh.PatientID = p.PatientID
      WHERE 1=1
    `;
    const params = [];

    if (patientId) {
      sql += ' AND mh.PatientID = ?';
      params.push(patientId);
    }

    if (q) {
      sql += ' AND (p.FirstName LIKE ? OR p.LastName LIKE ? OR mh.PastIllnesses LIKE ? OR mh.Allergies LIKE ? OR mh.ChronicConditions LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p, p, p);
    }

    sql += ' ORDER BY mh.HistoryID DESC';
    const histories = await query(sql, params);
    res.json({ success: true, count: histories.length, data: histories });
  } catch (error) {
    next(error);
  }
}

// Get single medical history by ID
export async function getMedicalHistoryById(req, res, next) {
  try {
    const { id } = req.params;
    const records = await query(`
      SELECT mh.*, 
             CONCAT(p.FirstName, ' ', COALESCE(p.LastName, '')) AS PatientName,
             p.Phone AS PatientPhone
      FROM medical_histories mh
      JOIN patients p ON mh.PatientID = p.PatientID
      WHERE mh.HistoryID = ?
    `, [id]);

    if (records.length === 0) {
      return res.status(404).json({ success: false, message: 'Medical history record not found.' });
    }

    res.json({ success: true, data: records[0] });
  } catch (error) {
    next(error);
  }
}

// Create medical history record
export async function createMedicalHistory(req, res, next) {
  try {
    const {
      PatientID,
      PastIllnesses,
      PastSurgeries,
      FamilyHistory,
      ChronicConditions,
      Allergies,
      Notes,
      CreatedAt = new Date().toISOString().slice(0, 10)
    } = req.body;

    if (!PatientID) {
      return res.status(400).json({ success: false, message: 'PatientID is required.' });
    }

    const [patient] = await query('SELECT PatientID FROM patients WHERE PatientID = ?', [PatientID]);
    if (!patient) return res.status(400).json({ success: false, message: 'Patient does not exist.' });

    const result = await query(
      `INSERT INTO medical_histories
       (PatientID, PastIllnesses, PastSurgeries, FamilyHistory, ChronicConditions, Allergies, Notes, CreatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [PatientID, PastIllnesses || null, PastSurgeries || null, FamilyHistory || null, ChronicConditions || null, Allergies || null, Notes || null, CreatedAt]
    );

    const record = await query('SELECT * FROM medical_histories WHERE HistoryID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Medical history record created.', data: record[0] });
  } catch (error) {
    next(error);
  }
}

// Update medical history record
export async function updateMedicalHistory(req, res, next) {
  try {
    const { id } = req.params;
    const {
      PatientID,
      PastIllnesses,
      PastSurgeries,
      FamilyHistory,
      ChronicConditions,
      Allergies,
      Notes,
      CreatedAt
    } = req.body;

    const existing = await query('SELECT * FROM medical_histories WHERE HistoryID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Medical history record not found.' });
    }

    await query(
      `UPDATE medical_histories 
       SET PatientID = ?, PastIllnesses = ?, PastSurgeries = ?, FamilyHistory = ?,
           ChronicConditions = ?, Allergies = ?, Notes = ?, CreatedAt = ?
       WHERE HistoryID = ?`,
      [
        PatientID ?? existing[0].PatientID,
        PastIllnesses ?? existing[0].PastIllnesses,
        PastSurgeries ?? existing[0].PastSurgeries,
        FamilyHistory ?? existing[0].FamilyHistory,
        ChronicConditions ?? existing[0].ChronicConditions,
        Allergies ?? existing[0].Allergies,
        Notes ?? existing[0].Notes,
        CreatedAt ?? existing[0].CreatedAt,
        id
      ]
    );

    const updated = await query('SELECT * FROM medical_histories WHERE HistoryID = ?', [id]);
    res.json({ success: true, message: 'Medical history record updated.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete medical history record
export async function deleteMedicalHistory(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM medical_histories WHERE HistoryID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Medical history record not found.' });
    }

    await query('DELETE FROM medical_histories WHERE HistoryID = ?', [id]);
    res.json({ success: true, message: 'Medical history record deleted.' });
  } catch (error) {
    next(error);
  }
}
