import { query } from '../config/db.js';

// Get all medicines
export async function getAllMedicines(req, res, next) {
  try {
    const { category, activeOnly, q } = req.query;
    let sql = 'SELECT * FROM medicines WHERE 1=1';
    const params = [];

    if (activeOnly === 'true') {
      sql += ' AND IsActive = TRUE';
    }
    if (category) {
      sql += ' AND Category = ?';
      params.push(category);
    }
    if (q) {
      sql += ' AND (MedicineName LIKE ? OR Category LIKE ? OR Description LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p);
    }

    sql += ' ORDER BY MedicineName ASC';
    const medicines = await query(sql, params);
    res.json({ success: true, count: medicines.length, data: medicines });
  } catch (error) {
    next(error);
  }
}

// Get single medicine
export async function getMedicineById(req, res, next) {
  try {
    const { id } = req.params;
    const medicines = await query('SELECT * FROM medicines WHERE MedicineID = ?', [id]);

    if (medicines.length === 0) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    res.json({ success: true, data: medicines[0] });
  } catch (error) {
    next(error);
  }
}

// Create new medicine
export async function createMedicine(req, res, next) {
  try {
    const { MedicineName, Category, Description, UnitPrice = 0.00, IsActive = true } = req.body;

    if (!MedicineName) {
      return res.status(400).json({ success: false, message: 'MedicineName is required.' });
    }

    const result = await query(
      `INSERT INTO medicines (MedicineName, Category, Description, UnitPrice, IsActive)
       VALUES (?, ?, ?, ?, ?)`,
      [MedicineName, Category || null, Description || null, UnitPrice, IsActive !== undefined ? Boolean(IsActive) : true]
    );

    const medicine = await query('SELECT * FROM medicines WHERE MedicineID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Medicine created successfully.', data: medicine[0] });
  } catch (error) {
    next(error);
  }
}

// Update medicine
export async function updateMedicine(req, res, next) {
  try {
    const { id } = req.params;
    const { MedicineName, Category, Description, UnitPrice, IsActive } = req.body;

    const existing = await query('SELECT * FROM medicines WHERE MedicineID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    await query(
      `UPDATE medicines 
       SET MedicineName = ?, Category = ?, Description = ?, UnitPrice = ?, IsActive = ?
       WHERE MedicineID = ?`,
      [
        MedicineName ?? existing[0].MedicineName,
        Category ?? existing[0].Category,
        Description ?? existing[0].Description,
        UnitPrice ?? existing[0].UnitPrice,
        IsActive !== undefined ? Boolean(IsActive) : existing[0].IsActive,
        id
      ]
    );

    const updated = await query('SELECT * FROM medicines WHERE MedicineID = ?', [id]);
    res.json({ success: true, message: 'Medicine updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete medicine
export async function deleteMedicine(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM medicines WHERE MedicineID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    await query('DELETE FROM medicines WHERE MedicineID = ?', [id]);
    res.json({ success: true, message: 'Medicine deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
