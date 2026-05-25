import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  ingredients: [{ type: String }],
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  addons: [{
    name: String,
    price: Number,
  }],
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isVeg: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  preparationTime: { type: Number, default: 30 },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Food', foodSchema);
