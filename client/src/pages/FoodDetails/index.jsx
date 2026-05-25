import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiClock, FiHeart, FiMinus, FiPlus, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { foodAPI } from '../../services/api';
import { addToCart } from '../../redux/slices/cartSlice';
import { PageLoader } from '../../components/Loader';
import toast from 'react-hot-toast';
import './style.css';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    foodAPI.getById(id)
      .then(r => { setFood(r.data.food); setReviews(r.data.reviews || []); })
      .catch(() => {
        const DEMO_FOODS = [
          { _id: 'f1', name: 'Classic Smash Burger', description: 'Double smash patty with cheddar cheese, pickles, onions & special sauce', price: 249, discountPrice: 199, category: { _id: 'cat1', name: 'Burgers' }, images: [], ratings: 4.8, numReviews: 234, preparationTime: 20, tags: ['bestseller', 'spicy'], isVeg: false, inStock: true },
          { _id: 'f2', name: 'Margherita Pizza', description: 'Classic tomato base with fresh mozzarella, basil & extra virgin olive oil', price: 349, discountPrice: 299, category: { _id: 'cat2', name: 'Pizza' }, images: [], ratings: 4.7, numReviews: 189, preparationTime: 25, tags: ['popular'], isVeg: true, inStock: true },
          { _id: 'f3', name: 'Salmon Sushi Roll', description: 'Fresh Atlantic salmon with avocado, cucumber & tobiko in a sesame rice roll', price: 449, discountPrice: 0, category: { _id: 'cat3', name: 'Sushi' }, images: [], ratings: 4.9, numReviews: 156, preparationTime: 15, tags: ['premium'], isVeg: false, inStock: true },
          { _id: 'f4', name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with tender chicken, saffron & whole spices', price: 299, discountPrice: 249, category: { _id: 'cat4', name: 'Biryani' }, images: [], ratings: 4.9, numReviews: 412, preparationTime: 30, tags: ['bestseller', 'spicy'], isVeg: false, inStock: true },
          { _id: 'f5', name: 'Pad Thai Noodles', description: 'Stir-fried rice noodles with eggs, tofu, bean sprouts & crushed peanuts', price: 199, discountPrice: 169, category: { _id: 'cat5', name: 'Noodles' }, images: [], ratings: 4.6, numReviews: 98, preparationTime: 18, tags: ['veg'], isVeg: true, inStock: true },
          { _id: 'f6', name: 'Street Tacos', description: 'Three soft corn tortillas with seasoned beef, pico de gallo & lime crema', price: 249, discountPrice: 0, category: { _id: 'cat6', name: 'Tacos' }, images: [], ratings: 4.7, numReviews: 143, preparationTime: 15, tags: ['popular'], isVeg: false, inStock: true },
          { _id: 'f7', name: 'Chocolate Lava Cake', description: 'Warm molten chocolate cake with vanilla ice cream & berry coulis', price: 179, discountPrice: 149, category: { _id: 'cat7', name: 'Desserts' }, images: [], ratings: 4.8, numReviews: 267, preparationTime: 12, tags: ['sweet'], isVeg: true, inStock: true },
          { _id: 'f8', name: 'Mango Lassi', description: 'Chilled blended Alphonso mango with creamy yogurt, cardamom & rose water', price: 99, discountPrice: 79, category: { _id: 'cat8', name: 'Drinks' }, images: [], ratings: 4.7, numReviews: 321, preparationTime: 5, tags: ['cold'], isVeg: true, inStock: true },
          { _id: 'f9', name: 'Paneer Tikka Pizza', description: 'Tandoori-style paneer with bell peppers, onions & tikka sauce on crisp base', price: 379, discountPrice: 319, category: { _id: 'cat2', name: 'Pizza' }, images: [], ratings: 4.6, numReviews: 88, preparationTime: 25, tags: ['spicy'], isVeg: true, inStock: true },
          { _id: 'f10', name: 'BBQ Chicken Wings', description: 'Crispy wings glazed in smoky BBQ sauce, served with blue cheese dip', price: 329, discountPrice: 279, category: { _id: 'cat1', name: 'Burgers' }, images: [], ratings: 4.8, numReviews: 198, preparationTime: 22, tags: ['spicy'], isVeg: false, inStock: true },
          { _id: 'f11', name: 'Veg Dragon Roll', description: 'Tempura asparagus, cucumber & avocado topped with spicy mayo drizzle', price: 349, discountPrice: 0, category: { _id: 'cat3', name: 'Sushi' }, images: [], ratings: 4.5, numReviews: 67, preparationTime: 15, tags: ['veg'], isVeg: true, inStock: true },
          { _id: 'f12', name: 'Mutton Biryani', description: 'Slow-cooked tender mutton with caramelized onions, mint & dum spices', price: 379, discountPrice: 329, category: { _id: 'cat4', name: 'Biryani' }, images: [], ratings: 4.9, numReviews: 289, preparationTime: 40, tags: ['premium'], isVeg: false, inStock: true },
        ];
        const demo = DEMO_FOODS.find(f => f._id === id);
        if (demo) { setFood(demo); setReviews([]); }
        else { toast.error('Food not found'); navigate('/menu'); }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddonToggle = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.name === addon.name)
        ? prev.filter(a => a.name !== addon.name)
        : [...prev, addon]
    );
  };

  const price = food ? (food.discountPrice > 0 ? food.discountPrice : food.price) : 0;
  const addonTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const totalPrice = (price + addonTotal) * quantity;

  const handleAddToCart = () => {
    if (!food) return;
    dispatch(addToCart({ food: { ...food, price, discountPrice: 0 }, quantity, addons: selectedAddons }));
    toast.success(`${food.name} added to cart! 🎉`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to leave a review'); return; }
    setSubmittingReview(true);
    try {
      await foodAPI.addReview(id, newReview);
      toast.success('Review submitted!');
      const res = await foodAPI.getById(id);
      setReviews(res.data.reviews);
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="food-details-page"><PageLoader /></div>;
  if (!food) return null;

  const images = food.images?.length > 0
    ? food.images
    : ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop'];

  return (
    <div className="food-details-page">
      <div className="food-details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="food-details-layout">
          {/* Left: Images */}
          <motion.div
            className="food-images-section"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="main-image">
              <img src={images[activeImage]} alt={food.name}
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop'} />
              <span className={`veg-indicator ${food.isVeg ? 'veg' : 'non-veg'}`}>
                <span className="vd" /> {food.isVeg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" className={`thumb ${activeImage === i ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=80&fit=crop'} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Details */}
          <motion.div
            className="food-info-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="food-cat-tag">{food.category?.name}</p>
            <h1 className="food-detail-name">{food.name}</h1>

            <div className="food-detail-meta">
              <div className="fd-rating">
                <FiStar className="star-fill" />
                <span>{food.ratings > 0 ? food.ratings.toFixed(1) : '4.2'}</span>
                <span className="fd-reviews">({food.numReviews} reviews)</span>
              </div>
              <div className="fd-time"><FiClock /> {food.preparationTime} min</div>
            </div>

            <p className="food-detail-desc">{food.description}</p>

            {food.ingredients?.length > 0 && (
              <div className="food-section">
                <h4>Ingredients</h4>
                <div className="ingredients-list">
                  {food.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient-chip">{ing}</span>
                  ))}
                </div>
              </div>
            )}

            {food.nutrition && (
              <div className="food-section">
                <h4>Nutrition (per serving)</h4>
                <div className="nutrition-grid">
                  {[
                    { label: 'Calories', value: food.nutrition.calories, unit: 'kcal' },
                    { label: 'Protein', value: food.nutrition.protein, unit: 'g' },
                    { label: 'Carbs', value: food.nutrition.carbs, unit: 'g' },
                    { label: 'Fat', value: food.nutrition.fat, unit: 'g' },
                  ].filter(n => n.value).map(n => (
                    <div key={n.label} className="nutrition-item">
                      <span className="nu-val">{n.value}{n.unit}</span>
                      <span className="nu-label">{n.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {food.addons?.length > 0 && (
              <div className="food-section">
                <h4>Add-ons</h4>
                <div className="addons-list">
                  {food.addons.map((addon, i) => (
                    <label key={i} className={`addon-item ${selectedAddons.find(a => a.name === addon.name) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={!!selectedAddons.find(a => a.name === addon.name)}
                        onChange={() => handleAddonToggle(addon)}
                      />
                      <span className="addon-name">{addon.name}</span>
                      <span className="addon-price">+₹{addon.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="food-action-bar">
              <div className="qty-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><FiMinus /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}><FiPlus /></button>
              </div>
              <div className="price-display">
                <span className="fd-price">₹{totalPrice}</span>
                {food.discountPrice > 0 && <span className="fd-original">₹{food.price * quantity}</span>}
              </div>
              <motion.button className="add-to-cart-main" onClick={handleAddToCart} whileTap={{ scale: 0.96 }}>
                <FiShoppingCart /> Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews ({reviews.length})</h2>
          <div className="reviews-layout">
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((r, i) => (
                  <motion.div key={r._id} className="review-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="review-header">
                      <div className="reviewer-avatar">
                        {r.user?.avatar
                          ? <img src={r.user.avatar} alt="" />
                          : <span>{r.user?.name?.charAt(0)}</span>
                        }
                      </div>
                      <div>
                        <p className="reviewer-name">{r.user?.name}</p>
                        <div className="review-stars">
                          {Array(r.rating).fill(0).map((_, si) => <FiStar key={si} className="star-fill" />)}
                        </div>
                      </div>
                      <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="review-comment">{r.comment}</p>
                  </motion.div>
                ))
              )}
            </div>

            <div className="add-review">
              <h3>Write a Review</h3>
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`star-btn ${n <= newReview.rating ? 'active' : ''}`}
                      onClick={() => setNewReview(r => ({ ...r, rating: n }))}
                    >
                      <FiStar />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
                  rows={4}
                  required
                />
                <button type="submit" className="submit-review-btn" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
