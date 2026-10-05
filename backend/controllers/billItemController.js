import { query } from '../config/db.js';
import { recalculateBillTotals } from './billController.js';

// Get bill items for a bill
export async function getBillItemsByBillId(req, res, next) {
  try {
    const { billId } = req.params;
    const items = await query(`
      SELECT bi.*, s.ServiceName
      FROM bill_items bi
      LEFT JOIN services s ON bi.ServiceID = s.ServiceID
      WHERE bi.BillID = ?
      ORDER BY bi.BillItemID ASC
    `, [billId]);

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
}

// Add item to bill
export async function addBillItem(req, res, next) {
  try {
    const { BillID, ServiceID, Description, Quantity = 1, UnitPrice = 0.00, Amount } = req.body;

    if (!BillID) {
      return res.status(400).json({ success: false, message: 'BillID is required.' });
    }

    const qty = parseFloat(Quantity);
    const price = parseFloat(UnitPrice);
    const itemAmount = Amount !== undefined ? parseFloat(Amount) : +(qty * price).toFixed(2);

    const result = await query(
      `INSERT INTO bill_items (BillID, ServiceID, Description, Quantity, UnitPrice, Amount)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [BillID, ServiceID || null, Description || null, qty, price, itemAmount]
    );

    // Auto-recalculate parent Bill
    await recalculateBillTotals(BillID);

    const newItem = await query(`
      SELECT bi.*, s.ServiceName 
      FROM bill_items bi 
      LEFT JOIN services s ON bi.ServiceID = s.ServiceID 
      WHERE bi.BillItemID = ?
    `, [result.insertId]);

    res.status(201).json({ success: true, message: 'Bill item added successfully.', data: newItem[0] });
  } catch (error) {
    next(error);
  }
}

// Update bill item
export async function updateBillItem(req, res, next) {
  try {
    const { id } = req.params;
    const { BillID, ServiceID, Description, Quantity, UnitPrice, Amount } = req.body;

    const existing = await query('SELECT * FROM bill_items WHERE BillID = ? OR BillItemID = ?', [BillID, id]);
    const item = existing.find(i => i.BillItemID === parseInt(id, 10));

    if (!item) {
      return res.status(404).json({ success: false, message: 'Bill item not found.' });
    }

    const qty = Quantity !== undefined ? parseFloat(Quantity) : parseFloat(item.Quantity);
    const price = UnitPrice !== undefined ? parseFloat(UnitPrice) : parseFloat(item.UnitPrice);
    const itemAmount = Amount !== undefined ? parseFloat(Amount) : +(qty * price).toFixed(2);

    await query(
      `UPDATE bill_items 
       SET ServiceID = ?, Description = ?, Quantity = ?, UnitPrice = ?, Amount = ?
       WHERE BillItemID = ?`,
      [
        ServiceID ?? item.ServiceID,
        Description ?? item.Description,
        qty,
        price,
        itemAmount,
        id
      ]
    );

    // Auto-recalculate parent bill
    await recalculateBillTotals(item.BillID);

    const updated = await query(`
      SELECT bi.*, s.ServiceName 
      FROM bill_items bi 
      LEFT JOIN services s ON bi.ServiceID = s.ServiceID 
      WHERE bi.BillItemID = ?
    `, [id]);

    res.json({ success: true, message: 'Bill item updated successfully.', data: updated[0] });
  } catch (error) {
    next(error);
  }
}

// Delete bill item
export async function deleteBillItem(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT * FROM bill_items WHERE BillItemID = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Bill item not found.' });
    }

    const billId = existing[0].BillID;
    await query('DELETE FROM bill_items WHERE BillItemID = ?', [id]);

    // Auto-recalculate parent bill
    await recalculateBillTotals(billId);

    res.json({ success: true, message: 'Bill item deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
