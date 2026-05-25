import express from 'express';
import {
  register, login, getMe, updateProfile, changePassword,
  addAddress, deleteAddress, toggleWishlist
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);
router.put('/wishlist/:foodId', protect, toggleWishlist);

export default router;
