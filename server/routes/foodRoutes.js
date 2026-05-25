import express from 'express';
import {
  getAllFoods, getFoodById, createFood, updateFood, deleteFood, addReview, searchFoods
} from '../controllers/foodController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/adminMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllFoods);
router.get('/search', searchFoods);
router.get('/:id', getFoodById);
router.post('/', protect, adminOnly, upload.array('images', 5), createFood);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateFood);
router.delete('/:id', protect, adminOnly, deleteFood);
router.post('/:id/review', protect, addReview);

export default router;
