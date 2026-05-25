import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiChevronDown, FiX, FiSliders } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods, fetchCategories } from '../../redux/slices/foodSlice';
import FoodCard from '../../components/FoodCard';
import { SkeletonGrid } from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import './menu.css';

const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'rating', label: '⭐ Top Rated' },
  { value: 'price_asc', label: '↑ Price: Low to High' },
  { value: 'price_desc', label: '↓ Price: High to Low' },
];

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { foods, categories, loading, total, page, pages } = useSelector(s => s.food);
  const [currentPage, setCurrentPage] = useState(1);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openSection, setOpenSection] = useState({ filter: true, sort: true, categories: true });

  const toggleSection = (key) =>
    setOpenSection(prev => ({ ...prev, [key]: !prev[key] }));

  const activeFilterCount = [vegOnly, !!sort, !!selectedCategory].filter(Boolean).length;

  const loadFoods = useCallback(() => {
    const params = {
      limit: 12,
      page: currentPage,
      ...(searchInput && { search: searchInput }),
      ...(selectedCategory && { category: selectedCategory }),
      ...(sort && { sort }),
    };
    dispatch(fetchFoods(params));
  }, [dispatch, searchInput, selectedCategory, sort, currentPage]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(loadFoods, 300);
    return () => clearTimeout(timer);
  }, [loadFoods]);

  useEffect(() => {
    const cat = searchParams.get('category');
    const search = searchParams.get('search');
    if (cat) setSelectedCategory(cat);
    if (search) setSearchInput(search);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchParams(searchInput ? { search: searchInput } : {});
  };

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    setSearchParams(catId ? { category: catId } : {});
  };

  const clearAllFilters = () => {
    setVegOnly(false);
    setSort('');
    setSelectedCategory('');
    setSearchInput('');
    setSearchParams({});
  };

  const displayedFoods = vegOnly ? foods.filter(f => f.isVeg) : foods;

  const selectedCatName = categories.find(c => c._id === selectedCategory)?.name;
  const selectedSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label;

  const FilterPanel = () => (
    <div className="filter-panel">
      {/* Filters */}
      <div className="filter-section">
        <button className="filter-section-header" onClick={() => toggleSection('filter')}>
          <span><FiFilter size={14} /> Filters</span>
          <FiChevronDown
            className={`section-chevron ${openSection.filter ? 'open' : ''}`}
            size={16}
          />
        </button>
        <AnimatePresence initial={false}>
          {openSection.filter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="filter-section-body"
            >
              <label className="veg-toggle">
                <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
                <span className="toggle-track">
                  <span className="toggle-thumb" />
                </span>
                🥦 Veg Only
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sort By */}
      <div className="filter-section">
        <button className="filter-section-header" onClick={() => toggleSection('sort')}>
          <span>
            Sort By
            {sort && <span className="active-badge">{selectedSortLabel}</span>}
          </span>
          <FiChevronDown
            className={`section-chevron ${openSection.sort ? 'open' : ''}`}
            size={16}
          />
        </button>
        <AnimatePresence initial={false}>
          {openSection.sort && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="filter-section-body"
            >
              {SORT_OPTIONS.map(opt => (
                <label key={opt.value} className={`radio-opt ${sort === opt.value ? 'checked' : ''}`}>
                  <input
                    type="radio"
                    name="sort"
                    checked={sort === opt.value}
                    onChange={() => setSort(opt.value)}
                  />
                  <span className="radio-dot" />
                  {opt.label}
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Categories */}
      <div className="filter-section">
        <button className="filter-section-header" onClick={() => toggleSection('categories')}>
          <span>
            Categories
            {selectedCategory && <span className="active-badge">{selectedCatName}</span>}
          </span>
          <FiChevronDown
            className={`section-chevron ${openSection.categories ? 'open' : ''}`}
            size={16}
          />
        </button>
        <AnimatePresence initial={false}>
          {openSection.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="filter-section-body"
            >
              <div className="cat-filter-list">
                <button
                  className={`cat-filter-btn ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => { handleCategoryChange(''); setMobileFiltersOpen(false); }}
                >
                  🍽️ All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    className={`cat-filter-btn ${selectedCategory === cat._id ? 'active' : ''}`}
                    onClick={() => { handleCategoryChange(cat._id); setMobileFiltersOpen(false); }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeFilterCount > 0 && (
        <button className="clear-all-btn" onClick={clearAllFilters}>
          <FiX size={13} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="menu-page">
      <div className="menu-container">
        <motion.div
          className="menu-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Our Menu</h1>
          <p>Explore {total || 'our delicious'} items</p>
        </motion.div>

        <form className="menu-search" onSubmit={handleSearch}>
          <FiSearch className="ms-icon" />
          <input
            type="text"
            placeholder="Search for food..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Mobile Filter Toggle Bar */}
        <div className="mobile-filter-bar">
          <button
            className={`mobile-filter-toggle ${mobileFiltersOpen ? 'open' : ''}`}
            onClick={() => setMobileFiltersOpen(v => !v)}
          >
            <FiSliders size={15} />
            Filters & Sort
            {activeFilterCount > 0 && (
              <span className="mobile-filter-count">{activeFilterCount}</span>
            )}
            <FiChevronDown
              className={`mfb-chevron ${mobileFiltersOpen ? 'open' : ''}`}
              size={15}
            />
          </button>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="active-chips">
              {vegOnly && <span className="chip">🥦 Veg Only <button onClick={() => setVegOnly(false)}>×</button></span>}
              {sort && <span className="chip">{selectedSortLabel} <button onClick={() => setSort('')}>×</button></span>}
              {selectedCategory && <span className="chip">{selectedCatName} <button onClick={() => handleCategoryChange('')}>×</button></span>}
            </div>
          )}
        </div>

        {/* Mobile Dropdown Filter Panel */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              className="mobile-filter-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FilterPanel />
              <button
                className="mobile-apply-btn"
                onClick={() => setMobileFiltersOpen(false)}
              >
                ✓ Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="menu-layout">
          {/* Desktop Sidebar */}
          <aside className="menu-sidebar">
            <FilterPanel />
          </aside>

          {/* Food Grid */}
          <div className="menu-content">
            {loading ? (
              <SkeletonGrid count={12} />
            ) : displayedFoods.length === 0 ? (
              <div className="no-foods">
                <span>🔍</span>
                <h3>No foods found</h3>
                <p>Try adjusting your search or filters</p>
                <button onClick={clearAllFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="menu-results-info">
                  Showing {displayedFoods.length} of {total} results
                </div>
                <div className="menu-foods-grid">
                  {displayedFoods.map((food, i) => (
                    <motion.div
                      key={food._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <FoodCard
                        food={food}
                        onViewDetails={() => navigate(`/food/${food._id}`)}
                      />
                    </motion.div>
                  ))}
                </div>

                {pages > 1 && (
                  <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={currentPage === p ? 'active' : ''} onClick={() => setCurrentPage(p)}>{p}</button>
                    ))}
                    <button disabled={currentPage === pages} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
