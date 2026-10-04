import { query } from '../config/db.js';
import { recalculateBillTotals } from './billController.js';

// Get all payments
export async function getAllPayments(req, res, next) {
  try {
    const { billId, paymentMethod, status, q } = req.query;
    let sql = `
      SELECT p.*,
             b.TotalAmount AS BillTotalAmount, b.PatientID, b.Status AS BillStatus,
             pat.FirstName AS PatientFirstName, pat.LastName AS PatientLastName,
             CONCAT(pat.FirstName, ' ', COALESCE(pat.LastName, '')) AS PatientName
      FROM payments p
      JOIN bills b ON p.BillID = b.BillID
      JOIN patients pat ON b.PatientID = pat.PatientID
      WHERE 1=1
    `;
    const params = [];

    if (billId) {
      sql += ' AND p.BillID = ?';
      params.push(billId);
    }
    if (paymentMethod) {
      sql += ' AND p.PaymentMethod = ?';
      params.push(paymentMethod);
    }
    if (status) {
      sql += ' AND p.Status = ?';
      params.push(status);
    }
    if (q) {
      sql += ' AND (p.ReferenceNo LIKE ? OR pat.FirstName LIKE ? OR pat.LastName LIKE ? OR p.Notes LIKE ?)';
      const pattern = `%${q}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    sql += ' ORDER BY p.PaymentID DESC';
    const payments = await query(sql, params);
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
}

// Get single payment
export async function getPaymentById(req, res, next) {
  try {
    const { id } = req.params;
    const payments = await query(`
      SELECT p.*,
             b.TotalAmount AS BillTotalAmount, b.PatientID, b.Status AS BillStatus,
             pat.FirstName AS PatientFirstName, pat.LastName AS PatientLastName,
             CONCAT(pat.FirstName, ' ', COALESCE(pat.LastName, '')) AS PatientName
      FROM payments p
      JOIN bills b ON p.BillID = b.BillID
      JOIN patients pat ON b.PatientID = pat.PatientID
      WHERE p.PaymentID = ?
    `, [id]);

    if (payments.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    res.json({ success: true, data: payments[0] });
  } catch (error) {
    next(error);
  }
}

// Create new payment
export async function createPayment(req, res, next) {
  try {
    const {
      BillID,
      PaymentDate = new Date().toISOString().slice(0, 10),
      PaymentMethod = 'Cash',
      AmountPaid,
      ReferenceNo,
      Status = 'Completed',
      Notes
    } = req.body;

    if (!BillID || AmountPaid === undefined || AmountPaid === null) {
      return res.status(400).json({ success: false, message: 'BillID and AmountPaid are required.' });
    }

    // Verify bill exists
    const [bill] = await query('SELECT BillID FROM bills WHERE BillID = ?', [BillID]);
    if (!bill) {
      return res.status(400).json({ success: false, message: 'Bill does not exist.' });
    }

    const result = await query(
      `INSERT INTO payments (BillID, PaymentDate, PaymentMethod, AmountPaid, ReferenceNo, Status, Notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [BillID, PaymentDate, PaymentMethod, parseFloat(AmountPaid), ReferenceNo || null, Status, Notes || null]
    );

    // Auto-recalculate parent Bill totals and payment status
    await recalculateBillTotals(BillID);

    const newPayment = await query('SELECT * FROM payments WHERE PaymentID = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Payment recorded successfully.', data: newPayment[0] });
  } catch (error) {
    next(error);
  }
}

// Update payment
export async function updatePayment(req, res, next) {
  try {
    const { id } = req.params;
    const {
      BillID,
      PaymentDate,
      PaymentMethod,
      AmountPaid,
      ReferenceNo,
      Status,
      Notes
    } = req.body;

    const existing = await query('SELECT * FROM payments WHERE PaymentID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    const billId = BillID ?? existing[0].BillID;

    await query(
      `UPDATE payments 
       SET BillID = ?, PaymentDate = ?, PaymentMethod = ?, AmountPaid = ?,
           ReferenceNo = ?, Status = ?, Notes = ?
       WHERE PaymentID = ?`,
      [
        billId,
        PaymentDate ?? existing[0].PaymentDate,
        PaymentMethod ?? existing[0].PaymentMethod,
        AmountPaid !== undefined ? parseFloat(AmountPaid) : existing[0].AmountPaid,
        ReferenceNo ?? existing[0].ReferenceNo,
        Status ?? existing[0].Status,
        Notes ?? existing[0].Notes,
        id
      ]
    );

    // Auto-recalculate parent Bill
    await recalculateBillTotals(billId);

    const updated = await query('SELECT * FROM payments WHERE PaymentID = ?', [id]);
    res.json({ success: true, message: 'Payment updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete payment
export async function deletePayment(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM payments WHERE PaymentID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    const billId = existing[0].BillID;
    await query('DELETE FROM payments WHERE PaymentID = ?', [id]);

    // Auto-recalculate parent Bill
    await recalculateBillTotals(billId);

    res.json({ success: true, message: 'Payment deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
