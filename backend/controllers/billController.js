import { query, pool } from '../config/db.js';

// Helper function to recalculate bill totals and status
export async function recalculateBillTotals(billId, connection = null) {
  const runner = connection || { query };
  
  // Get sum of bill items
  const [itemsResult] = await runner.query(
    'SELECT COALESCE(SUM(Amount), 0) AS subtotal FROM bill_items WHERE BillID = ?',
    [billId]
  );
  const subtotal = parseFloat(itemsResult[0]?.subtotal || 0);

  // Get current discount and tax
  const [billResult] = await runner.query('SELECT Discount, Tax FROM bills WHERE BillID = ?', [billId]);
  if (!billResult || billResult.length === 0) return;

  const discount = parseFloat(billResult[0].Discount || 0);
  const tax = parseFloat(billResult[0].Tax || 0);
  const totalAmount = Math.max(0, +(subtotal - discount + tax).toFixed(2));

  // Get sum of completed payments
  const [paymentResult] = await runner.query(
    "SELECT COALESCE(SUM(AmountPaid), 0) AS totalPaid FROM payments WHERE BillID = ? AND Status = 'Completed'",
    [billId]
  );
  const totalPaid = parseFloat(paymentResult[0]?.totalPaid || 0);

  let newStatus = 'Unpaid';
  if (totalPaid >= totalAmount && totalAmount > 0) {
    newStatus = 'Paid';
  } else if (totalPaid > 0) {
    newStatus = 'Partially Paid';
  }

  await runner.query(
    'UPDATE bills SET Subtotal = ?, TotalAmount = ?, Status = ? WHERE BillID = ? AND Status != ?',
    [subtotal, totalAmount, newStatus, billId, 'Cancelled']
  );
}

// Get all bills with patient, appointment, and payment balance info
export async function getAllBills(req, res, next) {
  try {
    const { patientId, appointmentId, status, q } = req.query;
    let sql = `
      SELECT b.*,
             pat.FirstName AS PatientFirstName, pat.LastName AS PatientLastName, pat.Phone AS PatientPhone,
             CONCAT(pat.FirstName, ' ', COALESCE(pat.LastName, '')) AS PatientName,
             a.AppointmentDate,
             COALESCE(SUM(CASE WHEN p.Status = 'Completed' THEN p.AmountPaid ELSE 0 END), 0) AS PaidAmount,
             (b.TotalAmount - COALESCE(SUM(CASE WHEN p.Status = 'Completed' THEN p.AmountPaid ELSE 0 END), 0)) AS BalanceDue
      FROM bills b
      JOIN patients pat ON b.PatientID = pat.PatientID
      LEFT JOIN appointments a ON b.AppointmentID = a.AppointmentID
      LEFT JOIN payments p ON b.BillID = p.BillID
      WHERE 1=1
    `;
    const params = [];

    if (patientId) {
      sql += ' AND b.PatientID = ?';
      params.push(patientId);
    }
    if (appointmentId) {
      sql += ' AND b.AppointmentID = ?';
      params.push(appointmentId);
    }
    if (status) {
      sql += ' AND b.Status = ?';
      params.push(status);
    }
    if (q) {
      sql += ' AND (pat.FirstName LIKE ? OR pat.LastName LIKE ? OR pat.Phone LIKE ? OR b.Notes LIKE ?)';
      const p = `%${q}%`;
      params.push(p, p, p, p);
    }

    sql += ' GROUP BY b.BillID ORDER BY b.BillID DESC';
    const bills = await query(sql, params);
    res.json({ success: true, count: bills.length, data: bills });
  } catch (error) {
    next(error);
  }
}

// Get single bill by ID with line items and payments
export async function getBillById(req, res, next) {
  try {
    const { id } = req.params;
    const bills = await query(`
      SELECT b.*,
             pat.FirstName AS PatientFirstName, pat.LastName AS PatientLastName, pat.Phone AS PatientPhone, pat.Email AS PatientEmail, pat.Address AS PatientAddress,
             CONCAT(pat.FirstName, ' ', COALESCE(pat.LastName, '')) AS PatientName,
             a.AppointmentDate, a.DoctorID,
             CONCAT('Dr. ', d.FirstName, ' ', d.LastName) AS DoctorName
      FROM bills b
      JOIN patients pat ON b.PatientID = pat.PatientID
      LEFT JOIN appointments a ON b.AppointmentID = a.AppointmentID
      LEFT JOIN doctors d ON a.DoctorID = d.DoctorID
      WHERE b.BillID = ?
    `, [id]);

    if (bills.length === 0) {
      return res.status(404).json({ success: false, message: 'Bill not found.' });
    }

    const [items, payments] = await Promise.all([
      query(`
        SELECT bi.*, s.ServiceName
        FROM bill_items bi
        LEFT JOIN services s ON bi.ServiceID = s.ServiceID
        WHERE bi.BillID = ?
        ORDER BY bi.BillItemID ASC
      `, [id]),
      query('SELECT * FROM payments WHERE BillID = ? ORDER BY PaymentID DESC', [id])
    ]);

    const totalPaid = payments
      .filter(p => p.Status === 'Completed')
      .reduce((sum, p) => sum + parseFloat(p.AmountPaid || 0), 0);

    res.json({
      success: true,
      data: {
        ...bills[0],
        PaidAmount: totalPaid,
        BalanceDue: +(parseFloat(bills[0].TotalAmount) - totalPaid).toFixed(2),
        items,
        payments
      }
    });
  } catch (error) {
    next(error);
  }
}

// Create new bill (optionally with items)
export async function createBill(req, res, next) {
  const connection = await pool.getConnection();
  try {
    const {
      AppointmentID,
      PatientID,
      BillDate = new Date().toISOString().slice(0, 10),
      Subtotal = 0.00,
      Discount = 0.00,
      Tax = 0.00,
      TotalAmount,
      Status = 'Unpaid',
      Notes,
      items = []
    } = req.body;

    if (!PatientID) {
      return res.status(400).json({ success: false, message: 'PatientID is required.' });
    }

    await connection.beginTransaction();

    let calculatedSubtotal = parseFloat(Subtotal);
    if (Array.isArray(items) && items.length > 0) {
      calculatedSubtotal = items.reduce((sum, it) => sum + (parseFloat(it.Quantity || 1) * parseFloat(it.UnitPrice || 0)), 0);
    }

    const finalTotal = TotalAmount !== undefined
      ? parseFloat(TotalAmount)
      : Math.max(0, +(calculatedSubtotal - parseFloat(Discount) + parseFloat(Tax)).toFixed(2));

    const [result] = await connection.query(
      `INSERT INTO bills 
       (AppointmentID, PatientID, BillDate, Subtotal, Discount, Tax, TotalAmount, Status, Notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [AppointmentID || null, PatientID, BillDate, calculatedSubtotal, Discount, Tax, finalTotal, Status, Notes || null]
    );

    const billId = result.insertId;

    // Insert items if provided
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        const qty = parseFloat(item.Quantity || 1);
        const unitPrice = parseFloat(item.UnitPrice || 0);
        const amount = item.Amount !== undefined ? parseFloat(item.Amount) : +(qty * unitPrice).toFixed(2);

        await connection.query(
          `INSERT INTO bill_items (BillID, ServiceID, Description, Quantity, UnitPrice, Amount)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [billId, item.ServiceID || null, item.Description || null, qty, unitPrice, amount]
        );
      }
    }

    await connection.commit();

    const [newBill] = await connection.query('SELECT * FROM bills WHERE BillID = ?', [billId]);
    res.status(201).json({ success: true, message: 'Bill created successfully.', data: newBill[0] });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

// Update bill
export async function updateBill(req, res, next) {
  try {
    const { id } = req.params;
    const {
      AppointmentID,
      PatientID,
      BillDate,
      Subtotal,
      Discount,
      Tax,
      TotalAmount,
      Status,
      Notes
    } = req.body;

    const existing = await query('SELECT * FROM bills WHERE BillID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Bill not found.' });
    }

    const sub = Subtotal !== undefined ? parseFloat(Subtotal) : parseFloat(existing[0].Subtotal);
    const disc = Discount !== undefined ? parseFloat(Discount) : parseFloat(existing[0].Discount);
    const tx = Tax !== undefined ? parseFloat(Tax) : parseFloat(existing[0].Tax);
    const tot = TotalAmount !== undefined ? parseFloat(TotalAmount) : +(sub - disc + tx).toFixed(2);

    await query(
      `UPDATE bills 
       SET AppointmentID = ?, PatientID = ?, BillDate = ?, Subtotal = ?,
           Discount = ?, Tax = ?, TotalAmount = ?, Status = ?, Notes = ?
       WHERE BillID = ?`,
      [
        AppointmentID ?? existing[0].AppointmentID,
        PatientID ?? existing[0].PatientID,
        BillDate ?? existing[0].BillDate,
        sub,
        disc,
        tx,
        tot,
        Status ?? existing[0].Status,
        Notes ?? existing[0].Notes,
        id
      ]
    );

    // Sync status with payments
    await recalculateBillTotals(id);

    const updated = await query('SELECT * FROM bills WHERE BillID = ?', [id]);
    res.json({ success: true, message: 'Bill updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete bill
export async function deleteBill(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM bills WHERE BillID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Bill not found.' });
    }

    await query('DELETE FROM bills WHERE BillID = ?', [id]);
    res.json({ success: true, message: 'Bill deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
