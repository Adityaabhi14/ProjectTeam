import { query } from '../config/db.js';

// Get all rooms with floor/ward details
export async function getAllRooms(req, res, next) {
  try {
    const { floorWardId, occupancyStatus, roomType, status, q } = req.query;
    let sql = `
      SELECT r.*, fw.FloorWardName
      FROM rooms r
      JOIN floor_wards fw ON r.FloorWardID = fw.FloorWardID
      WHERE 1=1
    `;
    const params = [];

    if (floorWardId) {
      sql += ' AND r.FloorWardID = ?';
      params.push(floorWardId);
    }
    if (occupancyStatus) {
      sql += ' AND r.OccupancyStatus = ?';
      params.push(occupancyStatus);
    }
    if (roomType) {
      sql += ' AND r.RoomType = ?';
      params.push(roomType);
    }
    if (status) {
      sql += ' AND r.Status = ?';
      params.push(status);
    }
    if (q) {
      sql += ' AND (r.RoomNumber LIKE ? OR fw.FloorWardName LIKE ? OR r.RoomType LIKE ? OR r.Notes LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p, p);
    }

    sql += ' ORDER BY r.RoomID ASC';
    const rooms = await query(sql, params);
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    next(error);
  }
}

// Get single room by ID
export async function getRoomById(req, res, next) {
  try {
    const { id } = req.params;
    const rooms = await query(`
      SELECT r.*, fw.FloorWardName, fw.Description AS FloorWardDescription
      FROM rooms r
      JOIN floor_wards fw ON r.FloorWardID = fw.FloorWardID
      WHERE r.RoomID = ?
    `, [id]);

    if (rooms.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    res.json({ success: true, data: rooms[0] });
  } catch (error) {
    next(error);
  }
}

// Create new room
export async function createRoom(req, res, next) {
  try {
    const {
      FloorWardID,
      RoomNumber,
      RoomType = 'General',
      BedCount = 1,
      OccupancyStatus = 'Available',
      ChargePerDay = 0.00,
      Status = 'Active',
      Notes
    } = req.body;

    if (!FloorWardID || !RoomNumber) {
      return res.status(400).json({ success: false, message: 'FloorWardID and RoomNumber are required.' });
    }

    // Check if floor exists
    const [ward] = await query('SELECT FloorWardID FROM floor_wards WHERE FloorWardID = ?', [FloorWardID]);
    if (!ward) {
      return res.status(400).json({ success: false, message: 'Floor/Ward does not exist.' });
    }

    const result = await query(
      `INSERT INTO rooms 
       (FloorWardID, RoomNumber, RoomType, BedCount, OccupancyStatus, ChargePerDay, Status, Notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [FloorWardID, RoomNumber, RoomType, parseInt(BedCount, 10), OccupancyStatus, parseFloat(ChargePerDay), Status, Notes || null]
    );

    const newRoom = await query(`
      SELECT r.*, fw.FloorWardName 
      FROM rooms r 
      JOIN floor_wards fw ON r.FloorWardID = fw.FloorWardID 
      WHERE r.RoomID = ?
    `, [result.insertId]);

    res.status(201).json({ success: true, message: 'Room created successfully.', data: newRoom[0] });
  } catch (error) {
    next(error);
  }
}

// Update room
export async function updateRoom(req, res, next) {
  try {
    const { id } = req.params;
    const {
      FloorWardID,
      RoomNumber,
      RoomType,
      BedCount,
      OccupancyStatus,
      ChargePerDay,
      Status,
      Notes
    } = req.body;

    const existing = await query('SELECT * FROM rooms WHERE RoomID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    await query(
      `UPDATE rooms 
       SET FloorWardID = ?, RoomNumber = ?, RoomType = ?, BedCount = ?,
           OccupancyStatus = ?, ChargePerDay = ?, Status = ?, Notes = ?
       WHERE RoomID = ?`,
      [
        FloorWardID ?? existing[0].FloorWardID,
        RoomNumber ?? existing[0].RoomNumber,
        RoomType ?? existing[0].RoomType,
        BedCount !== undefined ? parseInt(BedCount, 10) : existing[0].BedCount,
        OccupancyStatus ?? existing[0].OccupancyStatus,
        ChargePerDay !== undefined ? parseFloat(ChargePerDay) : existing[0].ChargePerDay,
        Status ?? existing[0].Status,
        Notes ?? existing[0].Notes,
        id
      ]
    );

    const updated = await query(`
      SELECT r.*, fw.FloorWardName 
      FROM rooms r 
      JOIN floor_wards fw ON r.FloorWardID = fw.FloorWardID 
      WHERE r.RoomID = ?
    `, [id]);

    res.json({ success: true, message: 'Room updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete room
export async function deleteRoom(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM rooms WHERE RoomID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    await query('DELETE FROM rooms WHERE RoomID = ?', [id]);
    res.json({ success: true, message: 'Room deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
