import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodyfy';

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String, isActive: { type: Boolean, default: true },
  phone: String, addresses: [], wishlist: [], totalOrders: { type: Number, default: 0 },
});

const categorySchema = new mongoose.Schema({
  name: String, description: String, image: String, isActive: { type: Boolean, default: true },
});

const foodSchema = new mongoose.Schema({
  name: String, description: String, price: Number, discountPrice: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String], isVeg: Boolean, isActive: { type: Boolean, default: true },
  isFeatured: Boolean, isTrending: Boolean, isBestSeller: Boolean,
  ratings: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 },
  preparationTime: Number, ingredients: [String],
});

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Food = mongoose.model('Food', foodSchema);

const CATEGORIES = [
  { name: 'Pizza', description: 'Delicious Italian pizzas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { name: 'Burger', description: 'Juicy burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { name: 'Biryani', description: 'Aromatic biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
  { name: 'Indian', description: 'Traditional Indian cuisine', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200&h=200&fit=crop' },
  { name: 'Pasta', description: 'Italian pasta dishes', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop' },
  { name: 'South Indian', description: 'South Indian favorites', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop' },
  { name: 'Chinese', description: 'Chinese cuisine', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200&h=200&fit=crop' },
  { name: 'Desserts', description: 'Sweet treats', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop' },
];

const FOODS_TEMPLATE = [
  { name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese, fresh tomatoes & basil', price: 299, discountPrice: 249, isVeg: true, isFeatured: true, isBestSeller: true, preparationTime: 25, ratings: 4.5, numReviews: 128, ingredients: ['Mozzarella', 'Tomato', 'Basil', 'Olive Oil'], images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop'], catName: 'Pizza' },
  { name: 'BBQ Chicken Pizza', description: 'Smoky BBQ chicken pizza with caramelized onions and peppers', price: 399, discountPrice: 329, isVeg: false, isFeatured: true, isTrending: true, preparationTime: 30, ratings: 4.7, numReviews: 89, images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop'], catName: 'Pizza' },
  { name: 'Classic Cheese Burger', description: 'Juicy beef patty with cheddar cheese, lettuce, tomato and special sauce', price: 199, discountPrice: 0, isVeg: false, isFeatured: true, isTrending: true, preparationTime: 20, ratings: 4.3, numReviews: 203, ingredients: ['Beef Patty', 'Cheddar', 'Lettuce', 'Tomato'], images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop'], catName: 'Burger' },
  { name: 'Veggie Burger', description: 'Grilled veggie patty with fresh veggies and special vegan mayo', price: 179, discountPrice: 149, isVeg: true, isFeatured: false, preparationTime: 20, ratings: 4.1, numReviews: 67, images: ['https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&h=400&fit=crop'], catName: 'Burger' },
  { name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with tender chicken and exotic spices', price: 349, discountPrice: 299, isVeg: false, isFeatured: true, isBestSeller: true, preparationTime: 35, ratings: 4.8, numReviews: 456, ingredients: ['Chicken', 'Basmati Rice', 'Saffron', 'Spices'], images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop'], catName: 'Biryani' },
  { name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables and aromatic spices', price: 249, discountPrice: 0, isVeg: true, isFeatured: false, preparationTime: 30, ratings: 4.4, numReviews: 189, images: ['https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&h=400&fit=crop'], catName: 'Biryani' },
  { name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection with spices', price: 249, discountPrice: 0, isVeg: true, isFeatured: true, isTrending: true, preparationTime: 30, ratings: 4.6, numReviews: 174, images: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop'], catName: 'Indian' },
  { name: 'Butter Chicken', description: 'Tender chicken in rich creamy tomato sauce with butter and spices', price: 319, discountPrice: 269, isVeg: false, isFeatured: true, isBestSeller: true, preparationTime: 35, ratings: 4.9, numReviews: 512, ingredients: ['Chicken', 'Tomato', 'Butter', 'Cream'], images: ['https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop'], catName: 'Indian' },
  { name: 'Pasta Alfredo', description: 'Creamy white sauce pasta with mushrooms and parmesan cheese', price: 279, discountPrice: 229, isVeg: true, isFeatured: true, preparationTime: 25, ratings: 4.4, numReviews: 67, images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop'], catName: 'Pasta' },
  { name: 'Masala Dosa', description: 'Crispy dosa stuffed with spiced potato filling, served with chutneys', price: 149, discountPrice: 0, isVeg: true, isFeatured: true, isTrending: true, preparationTime: 20, ratings: 4.7, numReviews: 312, images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop'], catName: 'South Indian' },
  { name: 'Idli Sambar', description: 'Soft steamed idlis served with flavorful sambar and coconut chutney', price: 99, discountPrice: 0, isVeg: true, isFeatured: false, preparationTime: 15, ratings: 4.5, numReviews: 198, images: ['https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&h=400&fit=crop'], catName: 'South Indian' },
  { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables in classic Chinese sauces', price: 179, discountPrice: 149, isVeg: true, isFeatured: false, preparationTime: 20, ratings: 4.3, numReviews: 145, images: ['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop'], catName: 'Chinese' },
  { name: 'Gulab Jamun', description: 'Soft milk-solid balls soaked in sugar syrup', price: 99, discountPrice: 0, isVeg: true, isFeatured: false, preparationTime: 10, ratings: 4.8, numReviews: 234, images: ['https://images.unsplash.com/photo-1587392630025-ebcf5bc9dfb4?w=600&h=400&fit=crop'], catName: 'Desserts' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Food.deleteMany({});

    const adminPw = await bcrypt.hash('admin123', 12);
    const userPw = await bcrypt.hash('user1234', 12);

    await User.insertMany([
      { name: 'Admin User', email: 'admin@foodyfy.com', password: adminPw, role: 'admin', isActive: true },
      { name: 'Test Customer', email: 'user@foodyfy.com', password: userPw, role: 'customer', isActive: true },
    ]);
    console.log('Users created');

    const cats = await Category.insertMany(CATEGORIES);
    const catMap = Object.fromEntries(cats.map(c => [c.name, c._id]));
    console.log('Categories created');

    const foods = FOODS_TEMPLATE.map(f => {
      const { catName, ...rest } = f;
      return { ...rest, category: catMap[catName], isActive: true };
    });
    await Food.insertMany(foods);
    console.log('Foods created');

    console.log('\n✅ Seed complete!');
    console.log('Admin: admin@foodyfy.com / admin123');
    console.log('User: user@foodyfy.com / user1234');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seed failed:', err.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

seed();
