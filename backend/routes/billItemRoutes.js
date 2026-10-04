import express from 'express';
import {
  getBillItemsByBillId,
  addBillItem,
  updateBillItem,
  deleteBillItem
} from '../controllers/billItemController.js';

const router = express.Router();

router.get('/bill/:billId', getBillItemsByBillId);
router.post('/', addBillItem);
router.put('/:id', updateBillItem);
router.delete('/:id', deleteBillItem);

export default router;
