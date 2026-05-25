import express from 'express';
import {
  getAllUsers, getUserById, updateUserStatus, deleteUser,
  getNotifications, markNotificationRead
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id/status', protect, adminOnly, updateUserStatus);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
