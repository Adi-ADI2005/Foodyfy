import Food from '../models/Food.js';
import Review from '../models/Review.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getAllFoods = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, featured, trending, bestseller } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    if (trending === 'true') query.isTrending = true;
    if (bestseller === 'true') query.isBestSeller = true;

    let sortQuery = {};
    if (sort === 'price_asc') sortQuery = { price: 1 };
    else if (sort === 'price_desc') sortQuery = { price: -1 };
    else if (sort === 'rating') sortQuery = { ratings: -1 };
    else sortQuery = { createdAt: -1 };

    const skip = (page - 1) * limit;
    const total = await Food.countDocuments(query);
    const foods = await Food.find(query).populate('category', 'name').sort(sortQuery).skip(skip).limit(Number(limit));

    res.json({ success: true, foods, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('category', 'name');
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    const reviews = await Review.find({ food: food._id }).populate('user', 'name avatar');
    res.json({ success: true, food, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createFood = async (req, res) => {
  try {
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'foodyfy/foods' });
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }
    const foodData = { ...req.body, images };
    if (typeof foodData.ingredients === 'string') {
      foodData.ingredients = foodData.ingredients.split(',').map(i => i.trim());
    }
    const food = await Food.create(foodData);
    res.status(201).json({ success: true, message: 'Food created', food });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      let images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'foodyfy/foods' });
        images.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
      updateData.images = images;
    }
    const food = await Food.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Food updated', food });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });

    const existing = await Review.findOne({ user: req.user._id, food: food._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already reviewed' });

    const review = await Review.create({ user: req.user._id, food: food._id, rating, comment });

    const reviews = await Review.find({ food: food._id });
    food.numReviews = reviews.length;
    food.ratings = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await food.save();

    res.status(201).json({ success: true, message: 'Review added', review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchFoods = async (req, res) => {
  try {
    const { q } = req.query;
    const foods = await Food.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ],
    }).populate('category', 'name').limit(10);
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
