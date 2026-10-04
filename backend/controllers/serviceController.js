import { query } from '../config/db.js';

// Get all hospital services
export async function getAllServices(req, res, next) {
  try {
    const { activeOnly, q } = req.query;
    let sql = 'SELECT * FROM services WHERE 1=1';
    const params = [];

    if (activeOnly === 'true') {
      sql += ' AND IsActive = TRUE';
    }
    if (q) {
      sql += ' AND (ServiceName LIKE ? OR Description LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p);
    }

    sql += ' ORDER BY ServiceName ASC';
    const services = await query(sql, params);
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
}

// Get single service by ID
export async function getServiceById(req, res, next) {
  try {
    const { id } = req.params;
    const services = await query('SELECT * FROM services WHERE ServiceID = ?', [id]);

    if (services.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    res.json({ success: true, data: services[0] });
  } catch (error) {
    next(error);
  }
}

// Create new service
export async function createService(req, res, next) {
  try {
    const { ServiceName, Description, Charge = 0.00, IsActive = true } = req.body;

    if (!ServiceName) {
      return res.status(400).json({ success: false, message: 'ServiceName is required.' });
    }

    const result = await query(
      `INSERT INTO services (ServiceName, Description, Charge, IsActive)
       VALUES (?, ?, ?, ?)`,
      [ServiceName, Description || null, Charge, IsActive !== undefined ? Boolean(IsActive) : true]
    );

    const service = await query('SELECT * FROM services WHERE ServiceID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Service created successfully.', data: service[0] });
  } catch (error) {
    next(error);
  }
}

// Update service
export async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const { ServiceName, Description, Charge, IsActive } = req.body;

    const existing = await query('SELECT * FROM services WHERE ServiceID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await query(
      `UPDATE services 
       SET ServiceName = ?, Description = ?, Charge = ?, IsActive = ?
       WHERE ServiceID = ?`,
      [
        ServiceName ?? existing[0].ServiceName,
        Description ?? existing[0].Description,
        Charge ?? existing[0].Charge,
        IsActive !== undefined ? Boolean(IsActive) : existing[0].IsActive,
        id
      ]
    );

    const updated = await query('SELECT * FROM services WHERE ServiceID = ?', [id]);
    res.json({ success: true, message: 'Service updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete service
export async function deleteService(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM services WHERE ServiceID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    await query('DELETE FROM services WHERE ServiceID = ?', [id]);
    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
