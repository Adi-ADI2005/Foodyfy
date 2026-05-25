import express from 'express';
import {
  createOrder, getUserOrders, getOrderById, cancelOrder,
  getAllOrders, updateOrderStatus, getAdminStats, verifyCoupon
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getUserOrders);
router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/all', protect, adminOnly, getAllOrders);
router.post('/verify-coupon', protect, verifyCoupon);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
