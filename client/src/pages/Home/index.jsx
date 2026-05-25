import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight, FiStar, FiClock, FiTruck, FiShield } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods, fetchCategories } from '../../redux/slices/foodSlice';
import FoodCard from '../../components/FoodCard';
import { SkeletonGrid } from '../../components/Loader';
import './style.css';

const HERO_FOODS = [
  { emoji: '🍕', name: 'Pizza' },
  { emoji: '🍔', name: 'Burger' },
  { emoji: '🍜', name: 'Noodles' },
  { emoji: '🌮', name: 'Tacos' },
  { emoji: '🍣', name: 'Sushi' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', rating: 5, text: 'Amazing food quality and super fast delivery! Love Foodyfy.', avatar: '👩' },
  { name: 'Rahul Verma', rating: 5, text: 'Best food delivery app I\'ve used. Great deals and fresh food!', avatar: '👨' },
  { name: 'Anita Singh', rating: 5, text: 'Absolutely love the variety! Delivered in under 25 minutes.', avatar: '👩‍💼' },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { foods, categories, loading } = useSelector(s => s.food);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchFoods({ limit: 8, featured: true }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/menu?search=${searchQuery}`);
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    navigate(`/menu?category=${catId}`);
  };

  const featuredFoods = foods.slice(0, 8);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <motion.div className="hero-bg-elements" style={{ y: heroY }}>
          <div className="hero-circle hero-circle-1" />
          <div className="hero-circle hero-circle-2" />
          <div className="hero-circle hero-circle-3" />
        </motion.div>

        <div className="hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FiStar className="badge-star" /> 4.9/5 Rating · 10k+ Reviews
            </motion.div>

            <h1 className="hero-title">
              Hungry?<br />
              <span className="hero-title-orange">Good Food.</span><br />
              <span className="hero-title-purple">Fast Delivery.</span>
            </h1>

            <p className="hero-subtitle">
              Craving your favorite restaurant meals? Get them delivered to your door in minutes. Hot, fresh, and exactly how you like it.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <FiSearch className="hero-search-icon" />
              <input
                type="text"
                placeholder="Search for food, cuisines..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">Search</button>
            </form>

            <div className="hero-actions">
              <Link to="/menu" className="hero-btn-primary">Order Now</Link>
              <Link to="/menu" className="hero-btn-secondary">
                <FiSearch /> Explore Menu
              </Link>
            </div>

            <div className="hero-badges">
              <div className="hero-badge-item">
                <FiClock className="badge-icon" />
                <span>Under 30 mins</span>
              </div>
              <div className="hero-badge-item">
                <FiTruck className="badge-icon" />
                <span>Live Tracking</span>
              </div>
              <div className="hero-badge-item">
                <FiShield className="badge-icon" />
                <span>Safe & Secure</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="hero-image-card">
              <div className="hero-logo-big">
                <img src="/logo.png" alt="Foodyfy" className="hero-logo-img" />
                <span className="hero-logo-name">Foodyfy</span>
                <span className="hero-logo-tag">Good Food. Fast Delivery.</span>
              </div>
              <div className="hero-floating-foods">
                {HERO_FOODS.map((f, i) => (
                  <motion.div
                    key={f.name}
                    className="floating-food-chip"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate(`/menu?search=${f.name}`)}
                  >
                    <span>{f.emoji}</span>
                    <span>{f.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              className="hero-rating-card"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FiStar className="rating-star" />
              <div>
                <p className="rating-val">4.9/5 Rating</p>
                <p className="rating-sub">10k+ Happy Customers</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find exactly what you're craving</p>
          </motion.div>

          <div className="categories-grid">
            {categories.length === 0
              ? HERO_FOODS.map((c, i) => (
                  <motion.div
                    key={c.name}
                    className="category-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    onClick={() => navigate(`/menu?search=${c.name}`)}
                  >
                    <span className="cat-emoji">{c.emoji}</span>
                    <span className="cat-name">{c.name}</span>
                  </motion.div>
                ))
              : categories.map((cat, i) => (
                  <motion.div
                    key={cat._id}
                    className={`category-card ${activeCategory === cat._id ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    onClick={() => handleCategoryClick(cat._id)}
                  >
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="cat-img" />
                      : <span className="cat-emoji">{cat.emoji || '🍽️'}</span>
                    }
                    <span className="cat-name">{cat.name}</span>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="section-title">🔥 Popular Right Now</h2>
              <p className="section-subtitle">Most loved dishes this week</p>
            </div>
            <Link to="/menu" className="view-all-btn">View All <FiArrowRight /></Link>
          </motion.div>

          {loading ? (
            <SkeletonGrid count={8} />
          ) : featuredFoods.length > 0 ? (
            <div className="foods-grid">
              {featuredFoods.map((food, i) => (
                <motion.div
                  key={food._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <FoodCard food={food} onViewDetails={() => navigate(`/food/${food._id}`)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-emoji">🍽️</span>
              <p>Loading delicious food for you...</p>
              <Link to="/menu" className="hero-btn-primary">Explore Menu</Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-section">
        <div className="section-container">
          <motion.h2
            className="section-title text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose Foodyfy?
          </motion.h2>
          <div className="why-grid">
            {[
              { icon: '⚡', title: 'Lightning Fast', desc: 'Average delivery under 30 minutes to your door.' },
              { icon: '🌿', title: 'Fresh & Healthy', desc: 'Partnered with restaurants that use fresh ingredients.' },
              { icon: '💳', title: 'Secure Payments', desc: 'Multiple payment options with bank-grade security.' },
              { icon: '📍', title: 'Live Tracking', desc: 'Track your order in real-time on an interactive map.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="why-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">What Customers Say</h2>
            <p className="section-subtitle">10,000+ happy customers across India</p>
          </motion.div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="testimonial-stars">
                  {Array(t.rating).fill(0).map((_, si) => <FiStar key={si} className="t-star" />)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <span className="t-avatar">{t.avatar}</span>
                  <span className="t-name">{t.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="cta-content">
              <h2>Ready to Order?</h2>
              <p>Get ₹50 off on your first order with code <strong>WELCOME50</strong></p>
              <Link to="/menu" className="cta-btn">Order Now <FiArrowRight /></Link>
            </div>
            <div className="cta-emoji">🛵</div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const DEMO_FOODS = [
  { _id: '1', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese, fresh tomatoes & basil', price: 299, discountPrice: 249, ratings: 4.5, numReviews: 128, isVeg: true, preparationTime: 25, images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'], category: { name: 'Pizza' } },
  { _id: '2', name: 'Cheese Burger', description: 'Juicy beef patty with cheddar cheese, lettuce, tomato and special sauce', price: 199, discountPrice: 0, ratings: 4.3, numReviews: 89, isVeg: false, preparationTime: 20, images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'], category: { name: 'Burger' } },
  { _id: '3', name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with tender chicken and exotic spices', price: 349, discountPrice: 299, ratings: 4.8, numReviews: 256, isVeg: false, preparationTime: 35, images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop'], category: { name: 'Rice' } },
  { _id: '4', name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection with spices', price: 249, discountPrice: 0, ratings: 4.6, numReviews: 174, isVeg: true, preparationTime: 30, images: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop'], category: { name: 'Indian' } },
  { _id: '5', name: 'Pasta Alfredo', description: 'Creamy white sauce pasta with mushrooms and parmesan cheese', price: 279, discountPrice: 229, ratings: 4.4, numReviews: 67, isVeg: true, preparationTime: 25, images: ['https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop'], category: { name: 'Pasta' } },
  { _id: '6', name: 'Masala Dosa', description: 'Crispy dosa stuffed with spiced potato filling, served with chutney', price: 149, discountPrice: 0, ratings: 4.7, numReviews: 312, isVeg: true, preparationTime: 20, images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop'], category: { name: 'South Indian' } },
  { _id: '7', name: 'Sushi Platter', description: 'Fresh assorted sushi with salmon, tuna and avocado rolls', price: 499, discountPrice: 399, ratings: 4.5, numReviews: 45, isVeg: false, preparationTime: 40, images: ['https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop'], category: { name: 'Japanese' } },
  { _id: '8', name: 'Butter Naan', description: 'Soft leavened bread baked in tandoor oven with butter glaze', price: 49, discountPrice: 0, ratings: 4.3, numReviews: 198, isVeg: true, preparationTime: 15, images: ['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'], category: { name: 'Bread' } },
];

export default Home;
