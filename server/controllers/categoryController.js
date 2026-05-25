import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    let image = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'foodyfy/categories' });
      image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const category = await Category.create({ ...req.body, image });
    res.status(201).json({ success: true, message: 'Category created', category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'foodyfy/categories' });
      updateData.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: 'Category updated', category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
