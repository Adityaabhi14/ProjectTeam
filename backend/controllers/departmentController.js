import { query } from '../config/db.js';

// Get all departments with doctor count
export async function getAllDepartments(req, res, next) {
  try {
    const { q } = req.query;
    let sql = `
      SELECT dept.*, COUNT(d.DoctorID) AS DoctorCount
      FROM departments dept
      LEFT JOIN doctors d ON dept.DepartmentID = d.DepartmentID
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      sql += ' AND (dept.DepartmentName LIKE ? OR dept.Description LIKE ? OR dept.Location LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p);
    }

    sql += ' GROUP BY dept.DepartmentID ORDER BY dept.DepartmentName ASC';
    const departments = await query(sql, params);
    res.json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    next(error);
  }
}

// Get department by ID with associated doctors
export async function getDepartmentById(req, res, next) {
  try {
    const { id } = req.params;
    const departments = await query('SELECT * FROM departments WHERE DepartmentID = ?', [id]);

    if (departments.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    const doctors = await query('SELECT * FROM doctors WHERE DepartmentID = ?', [id]);

    res.json({
      success: true,
      data: {
        ...departments[0],
        doctors
      }
    });
  } catch (error) {
    next(error);
  }
}

// Create new department
export async function createDepartment(req, res, next) {
  try {
    const { DepartmentName, Description, PhoneNo, Location } = req.body;

    if (!DepartmentName) {
      return res.status(400).json({ success: false, message: 'DepartmentName is required.' });
    }

    const result = await query(
      `INSERT INTO departments (DepartmentName, Description, PhoneNo, Location)
       VALUES (?, ?, ?, ?)`,
      [DepartmentName, Description || null, PhoneNo || null, Location || null]
    );

    const newDept = await query('SELECT * FROM departments WHERE DepartmentID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Department created successfully.', data: newDept[0] });
  } catch (error) {
    next(error);
  }
}

// Update department
export async function updateDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const { DepartmentName, Description, PhoneNo, Location } = req.body;

    const existing = await query('SELECT * FROM departments WHERE DepartmentID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    await query(
      `UPDATE departments 
       SET DepartmentName = ?, Description = ?, PhoneNo = ?, Location = ?
       WHERE DepartmentID = ?`,
      [
        DepartmentName ?? existing[0].DepartmentName,
        Description ?? existing[0].Description,
        PhoneNo ?? existing[0].PhoneNo,
        Location ?? existing[0].Location,
        id
      ]
    );

    const updated = await query('SELECT * FROM departments WHERE DepartmentID = ?', [id]);
    res.json({ success: true, message: 'Department updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete department
export async function deleteDepartment(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM departments WHERE DepartmentID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found.' });
    }

    // Check if doctors belong to this department
    const doctors = await query('SELECT DoctorID FROM doctors WHERE DepartmentID = ?', [id]);
    if (doctors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with active doctors. Reassign or delete doctors first.'
      });
    }

    await query('DELETE FROM departments WHERE DepartmentID = ?', [id]);
    res.json({ success: true, message: 'Department deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
