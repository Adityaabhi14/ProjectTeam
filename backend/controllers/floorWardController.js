import { query } from '../config/db.js';

// Get all floors/wards with room counts
export async function getAllFloorWards(req, res, next) {
  try {
    const { q } = req.query;
    let sql = `
      SELECT fw.*, 
             COUNT(r.RoomID) AS RoomCount,
             COALESCE(SUM(r.BedCount), 0) AS TotalBeds
      FROM floor_wards fw
      LEFT JOIN rooms r ON fw.FloorWardID = r.FloorWardID
      WHERE 1=1
    `;
    const params = [];

    if (q) {
      sql += ' AND (fw.FloorWardName LIKE ? OR fw.Description LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p);
    }

    sql += ' GROUP BY fw.FloorWardID ORDER BY fw.FloorWardID ASC';
    const wards = await query(sql, params);
    res.json({ success: true, count: wards.length, data: wards });
  } catch (error) {
    next(error);
  }
}

// Get single floor/ward with its rooms
export async function getFloorWardById(req, res, next) {
  try {
    const { id } = req.params;
    const wards = await query('SELECT * FROM floor_wards WHERE FloorWardID = ?', [id]);

    if (wards.length === 0) {
      return res.status(404).json({ success: false, message: 'Floor/Ward not found.' });
    }

    const rooms = await query('SELECT * FROM rooms WHERE FloorWardID = ? ORDER BY RoomNumber ASC', [id]);

    res.json({
      success: true,
      data: {
        ...wards[0],
        rooms
      }
    });
  } catch (error) {
    next(error);
  }
}

// Create new floor/ward
export async function createFloorWard(req, res, next) {
  try {
    const { FloorWardName, Description } = req.body;

    if (!FloorWardName) {
      return res.status(400).json({ success: false, message: 'FloorWardName is required.' });
    }

    const result = await query(
      'INSERT INTO floor_wards (FloorWardName, Description) VALUES (?, ?)',
      [FloorWardName, Description || null]
    );

    const newWard = await query('SELECT * FROM floor_wards WHERE FloorWardID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Floor/Ward created successfully.', data: newWard[0] });
  } catch (error) {
    next(error);
  }
}

// Update floor/ward
export async function updateFloorWard(req, res, next) {
  try {
    const { id } = req.params;
    const { FloorWardName, Description } = req.body;

    const existing = await query('SELECT * FROM floor_wards WHERE FloorWardID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Floor/Ward not found.' });
    }

    await query(
      'UPDATE floor_wards SET FloorWardName = ?, Description = ? WHERE FloorWardID = ?',
      [FloorWardName ?? existing[0].FloorWardName, Description ?? existing[0].Description, id]
    );

    const updated = await query('SELECT * FROM floor_wards WHERE FloorWardID = ?', [id]);
    res.json({ success: true, message: 'Floor/Ward updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete floor/ward
export async function deleteFloorWard(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM floor_wards WHERE FloorWardID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Floor/Ward not found.' });
    }

    // Check if rooms exist in this ward
    const rooms = await query('SELECT RoomID FROM rooms WHERE FloorWardID = ?', [id]);
    if (rooms.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete floor/ward that has allocated rooms. Remove rooms first.'
      });
    }

    await query('DELETE FROM floor_wards WHERE FloorWardID = ?', [id]);
    res.json({ success: true, message: 'Floor/Ward deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
