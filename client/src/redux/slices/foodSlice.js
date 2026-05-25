import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { foodAPI, categoryAPI } from '../../services/api';

const DEMO_CATEGORIES = [
  { _id: 'cat1', name: 'Burgers', emoji: '🍔', image: '' },
  { _id: 'cat2', name: 'Pizza', emoji: '🍕', image: '' },
  { _id: 'cat3', name: 'Sushi', emoji: '🍣', image: '' },
  { _id: 'cat4', name: 'Biryani', emoji: '🍛', image: '' },
  { _id: 'cat5', name: 'Noodles', emoji: '🍜', image: '' },
  { _id: 'cat6', name: 'Tacos', emoji: '🌮', image: '' },
  { _id: 'cat7', name: 'Desserts', emoji: '🍰', image: '' },
  { _id: 'cat8', name: 'Drinks', emoji: '🥤', image: '' },
];

const DEMO_FOODS = [
  { _id: 'f1', name: 'Classic Smash Burger', description: 'Double smash patty with cheddar cheese, pickles, onions & special sauce', price: 249, discountPrice: 199, category: { _id: 'cat1', name: 'Burgers', emoji: '🍔' }, images: [], ratings: 4.8, numReviews: 234, preparationTime: 20, tags: ['bestseller', 'spicy'], isVeg: false, inStock: true, featured: true },
  { _id: 'f2', name: 'Margherita Pizza', description: 'Classic tomato base with fresh mozzarella, basil & extra virgin olive oil', price: 349, discountPrice: 299, category: { _id: 'cat2', name: 'Pizza', emoji: '🍕' }, images: [], ratings: 4.7, numReviews: 189, preparationTime: 25, tags: ['popular'], isVeg: true, inStock: true, featured: true },
  { _id: 'f3', name: 'Salmon Sushi Roll', description: 'Fresh Atlantic salmon with avocado, cucumber & tobiko in a sesame rice roll', price: 449, discountPrice: 0, category: { _id: 'cat3', name: 'Sushi', emoji: '🍣' }, images: [], ratings: 4.9, numReviews: 156, preparationTime: 15, tags: ['premium'], isVeg: false, inStock: true, featured: true },
  { _id: 'f4', name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with tender chicken, saffron & whole spices', price: 299, discountPrice: 249, category: { _id: 'cat4', name: 'Biryani', emoji: '🍛' }, images: [], ratings: 4.9, numReviews: 412, preparationTime: 30, tags: ['bestseller', 'spicy'], isVeg: false, inStock: true, featured: true },
  { _id: 'f5', name: 'Pad Thai Noodles', description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts & crushed peanuts', price: 199, discountPrice: 169, category: { _id: 'cat5', name: 'Noodles', emoji: '🍜' }, images: [], ratings: 4.6, numReviews: 98, preparationTime: 18, tags: ['veg'], isVeg: true, inStock: true, featured: true },
  { _id: 'f6', name: 'Street Tacos', description: 'Three soft corn tortillas with seasoned beef, pico de gallo & lime crema', price: 249, discountPrice: 0, category: { _id: 'cat6', name: 'Tacos', emoji: '🌮' }, images: [], ratings: 4.7, numReviews: 143, preparationTime: 15, tags: ['popular'], isVeg: false, inStock: true, featured: true },
  { _id: 'f7', name: 'Chocolate Lava Cake', description: 'Warm molten chocolate cake with vanilla ice cream & berry coulis', price: 179, discountPrice: 149, category: { _id: 'cat7', name: 'Desserts', emoji: '🍰' }, images: [], ratings: 4.8, numReviews: 267, preparationTime: 12, tags: ['sweet', 'popular'], isVeg: true, inStock: true, featured: true },
  { _id: 'f8', name: 'Mango Lassi', description: 'Chilled blended Alphonso mango with creamy yogurt, cardamom & rose water', price: 99, discountPrice: 79, category: { _id: 'cat8', name: 'Drinks', emoji: '🥤' }, images: [], ratings: 4.7, numReviews: 321, preparationTime: 5, tags: ['cold', 'veg'], isVeg: true, inStock: true, featured: true },
  { _id: 'f9', name: 'Paneer Tikka Pizza', description: 'Tandoori-style paneer with bell peppers, onions & tikka sauce on crisp base', price: 379, discountPrice: 319, category: { _id: 'cat2', name: 'Pizza', emoji: '🍕' }, images: [], ratings: 4.6, numReviews: 88, preparationTime: 25, tags: ['spicy', 'veg'], isVeg: true, inStock: true, featured: false },
  { _id: 'f10', name: 'BBQ Chicken Wings', description: 'Crispy wings glazed in smoky BBQ sauce, served with blue cheese dip', price: 329, discountPrice: 279, category: { _id: 'cat1', name: 'Burgers', emoji: '🍔' }, images: [], ratings: 4.8, numReviews: 198, preparationTime: 22, tags: ['spicy', 'bestseller'], isVeg: false, inStock: true, featured: false },
  { _id: 'f11', name: 'Veg Dragon Roll', description: 'Tempura asparagus, cucumber & avocado topped with spicy mayo drizzle', price: 349, discountPrice: 0, category: { _id: 'cat3', name: 'Sushi', emoji: '🍣' }, images: [], ratings: 4.5, numReviews: 67, preparationTime: 15, tags: ['veg'], isVeg: true, inStock: true, featured: false },
  { _id: 'f12', name: 'Mutton Biryani', description: 'Slow-cooked tender mutton with caramelized onions, mint & dum spices', price: 379, discountPrice: 329, category: { _id: 'cat4', name: 'Biryani', emoji: '🍛' }, images: [], ratings: 4.9, numReviews: 289, preparationTime: 40, tags: ['premium', 'spicy'], isVeg: false, inStock: true, featured: false },
];

export const fetchFoods = createAsyncThunk('food/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await foodAPI.getAll(params);
    return res.data;
  } catch {
    return { foods: DEMO_FOODS, total: DEMO_FOODS.length, page: 1, pages: 1, isDemo: true };
  }
});

export const fetchCategories = createAsyncThunk('food/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await categoryAPI.getAll();
    return res.data;
  } catch {
    return { categories: DEMO_CATEGORIES, isDemo: true };
  }
});

export const fetchFoodById = createAsyncThunk('food/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await foodAPI.getById(id);
    return res.data;
  } catch {
    const demo = DEMO_FOODS.find(f => f._id === id);
    if (demo) return { food: demo, isDemo: true };
    return rejectWithValue('Food not found');
  }
});

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    foods: [],
    categories: [],
    currentFood: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pages: 1,
    selectedCategory: null,
    searchQuery: '',
    isDemo: false,
  },
  reducers: {
    setCategory: (state, action) => { state.selectedCategory = action.payload; },
    setSearch: (state, action) => { state.searchQuery = action.payload; },
    clearCurrentFood: (state) => { state.currentFood = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload.foods;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.isDemo = action.payload.isDemo || false;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.foods = DEMO_FOODS;
        state.isDemo = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
        state.isDemo = action.payload.isDemo || false;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categories = DEMO_CATEGORIES;
        state.isDemo = true;
      })
      .addCase(fetchFoodById.pending, (state) => { state.loading = true; })
      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFood = action.payload.food;
      })
      .addCase(fetchFoodById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCategory, setSearch, clearCurrentFood } = foodSlice.actions;
export default foodSlice.reducer;
