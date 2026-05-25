import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiClock } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './style.css';

const FoodCard = ({ food, onViewDetails }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const [wishlisted, setWishlisted] = useState(
    user?.wishlist?.includes(food._id) || false
  );
  const [adding, setAdding] = useState(false);

  const price = food.discountPrice > 0 ? food.discountPrice : food.price;
  const discount = food.discountPrice > 0
    ? Math.round(((food.price - food.discountPrice) / food.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setAdding(true);
    dispatch(addToCart({ food, quantity: 1 }));
    toast.success(`${food.name} added to cart!`);
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please sign in to use wishlist'); return; }
    try {
      await authAPI.toggleWishlist(food._id);
      setWishlisted(!wishlisted);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <motion.div
      className="food-card"
      whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.25 }}
      onClick={() => onViewDetails && onViewDetails(food)}
    >
      <div className="food-card-image">
        <img
          src={food.images?.[0] || `https://source.unsplash.com/400x300/?food,${food.name}`}
          alt={food.name}
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'; }}
        />
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        <span className={`veg-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
          <span className="veg-dot" />
        </span>
        <button className={`wishlist-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={handleWishlist}>
          <FiHeart />
        </button>
      </div>

      <div className="food-card-body">
        <div className="food-card-category">{food.category?.name}</div>
        <h3 className="food-card-name">{food.name}</h3>
        <p className="food-card-desc">{food.description?.slice(0, 60)}...</p>

        <div className="food-card-meta">
          <div className="food-rating">
            <FiStar className="star-icon" />
            <span>{food.ratings > 0 ? food.ratings.toFixed(1) : '4.2'}</span>
            <span className="review-count">({food.numReviews || 0})</span>
          </div>
          <div className="food-time">
            <FiClock />
            <span>{food.preparationTime || 30} min</span>
          </div>
        </div>

        <div className="food-card-footer">
          <div className="food-price">
            <span className="price-current">₹{price}</span>
            {discount > 0 && <span className="price-original">₹{food.price}</span>}
          </div>
          <motion.button
            className={`add-cart-btn ${adding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            whileTap={{ scale: 0.9 }}
          >
            <FiShoppingCart />
            {adding ? 'Added!' : 'Add'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
