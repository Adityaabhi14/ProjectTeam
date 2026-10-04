import { query } from '../config/db.js';

// Get all insurance records
export async function getAllInsurances(req, res, next) {
  try {
    const { patientId, q } = req.query;
    let sql = `
      SELECT i.*, 
             CONCAT(p.FirstName, ' ', COALESCE(p.LastName, '')) AS PatientName,
             p.Phone AS PatientPhone
      FROM insurances i
      JOIN patients p ON i.PatientID = p.PatientID
      WHERE 1=1
    `;
    const params = [];

    if (patientId) {
      sql += ' AND i.PatientID = ?';
      params.push(patientId);
    }

    if (q) {
      sql += ' AND (p.FirstName LIKE ? OR p.LastName LIKE ? OR i.ProviderName LIKE ? OR i.PolicyNumber LIKE ? OR i.PolicyHolderName LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p, p, p);
    }

    sql += ' ORDER BY i.InsuranceID DESC';
    const insurances = await query(sql, params);
    res.json({ success: true, count: insurances.length, data: insurances });
  } catch (error) {
    next(error);
  }
}

// Get single insurance policy
export async function getInsuranceById(req, res, next) {
  try {
    const { id } = req.params;
    const records = await query(`
      SELECT i.*, 
             CONCAT(p.FirstName, ' ', COALESCE(p.LastName, '')) AS PatientName,
             p.Phone AS PatientPhone
      FROM insurances i
      JOIN patients p ON i.PatientID = p.PatientID
      WHERE i.InsuranceID = ?
    `, [id]);

    if (records.length === 0) {
      return res.status(404).json({ success: false, message: 'Insurance record not found.' });
    }

    res.json({ success: true, data: records[0] });
  } catch (error) {
    next(error);
  }
}

// Create new insurance policy
export async function createInsurance(req, res, next) {
  try {
    const {
      PatientID,
      ProviderName,
      PolicyNumber,
      PolicyHolderName,
      Relationship = 'Self',
      CoverageType,
      ValidFrom,
      ValidTo
    } = req.body;

    if (!PatientID || !ProviderName || !PolicyNumber) {
      return res.status(400).json({ success: false, message: 'PatientID, ProviderName, and PolicyNumber are required.' });
    }

    const [patient] = await query('SELECT PatientID FROM patients WHERE PatientID = ?', [PatientID]);
    if (!patient) return res.status(400).json({ success: false, message: 'Patient does not exist.' });

    const result = await query(
      `INSERT INTO insurances 
       (PatientID, ProviderName, PolicyNumber, PolicyHolderName, Relationship, CoverageType, ValidFrom, ValidTo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [PatientID, ProviderName, PolicyNumber, PolicyHolderName || null, Relationship, CoverageType || null, ValidFrom || null, ValidTo || null]
    );

    const record = await query('SELECT * FROM insurances WHERE InsuranceID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Insurance record created.', data: record[0] });
  } catch (error) {
    next(error);
  }
}

// Update insurance policy
export async function updateInsurance(req, res, next) {
  try {
    const { id } = req.params;
    const {
      PatientID,
      ProviderName,
      PolicyNumber,
      PolicyHolderName,
      Relationship,
      CoverageType,
      ValidFrom,
      ValidTo
    } = req.body;

    const existing = await query('SELECT * FROM insurances WHERE InsuranceID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Insurance record not found.' });
    }

    await query(
      `UPDATE insurances 
       SET PatientID = ?, ProviderName = ?, PolicyNumber = ?, PolicyHolderName = ?,
           Relationship = ?, CoverageType = ?, ValidFrom = ?, ValidTo = ?
       WHERE InsuranceID = ?`,
      [
        PatientID ?? existing[0].PatientID,
        ProviderName ?? existing[0].ProviderName,
        PolicyNumber ?? existing[0].PolicyNumber,
        PolicyHolderName ?? existing[0].PolicyHolderName,
        Relationship ?? existing[0].Relationship,
        CoverageType ?? existing[0].CoverageType,
        ValidFrom ?? existing[0].ValidFrom,
        ValidTo ?? existing[0].ValidTo,
        id
      ]
    );

    const updated = await query('SELECT * FROM insurances WHERE InsuranceID = ?', [id]);
    res.json({ success: true, message: 'Insurance record updated.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete insurance policy
export async function deleteInsurance(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM insurances WHERE InsuranceID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Insurance record not found.' });
    }

    await query('DELETE FROM insurances WHERE InsuranceID = ?', [id]);
    res.json({ success: true, message: 'Insurance record deleted.' });
  } catch (error) {
    next(error);
  }
}
