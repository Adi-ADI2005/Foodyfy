import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { foodAPI, categoryAPI } from '../../../services/api';
import { PageLoader } from '../../../components/Loader';
import toast from 'react-hot-toast';
import '../Dashboard/style.css';
import './style.css';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', discountPrice: '', category: '', isVeg: true, isFeatured: false, isTrending: false, isBestSeller: false, isActive: true, preparationTime: 30 });
  const [imageFile, setImageFile] = useState(null);

  const loadData = async () => {
    try {
      const [fr, cr] = await Promise.all([foodAPI.getAll({ limit: 100 }), categoryAPI.getAll()]);
      setFoods(fr.data.foods);
      setCategories(cr.data.categories);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditingFood(null);
    setForm({ name: '', description: '', price: '', discountPrice: '', category: categories[0]?._id || '', isVeg: true, isFeatured: false, isTrending: false, isBestSeller: false, isActive: true, preparationTime: 30 });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (food) => {
    setEditingFood(food);
    setForm({ ...food, category: food.category?._id || food.category, discountPrice: food.discountPrice || '' });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('images', imageFile);

      if (editingFood) {
        await foodAPI.update(editingFood._id, fd);
        toast.success('Food updated!');
      } else {
        await foodAPI.create(fd);
        toast.success('Food created!');
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this food item?')) return;
    try {
      await foodAPI.delete(id);
      setFoods(prev => prev.filter(f => f._id !== id));
      toast.success('Food deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <PageLoader />;

  return (
    <div className="admin-foods">
      <div className="admin-page-header-row">
        <div className="admin-page-header">
          <h1>Food Management</h1>
          <p>Manage your food menu</p>
        </div>
        <button className="add-btn" onClick={openCreate}>
          <FiPlus /> Add New Food
        </button>
      </div>

      <div className="admin-search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Food Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(food => (
                <tr key={food._id}>
                  <td>
                    <img
                      src={food.images?.[0] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop'}
                      alt={food.name}
                      className="food-thumb"
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop'}
                    />
                  </td>
                  <td className="order-id-cell">{food.name}</td>
                  <td>{food.category?.name}</td>
                  <td>₹{food.price}</td>
                  <td>
                    <span className={`status-badge ${food.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                      {food.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEdit(food)}>
                        <FiEdit2 />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(food._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="no-data">No foods found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <h2>{editingFood ? 'Edit Food' : 'Add New Food'}</h2>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row two-col">
                <div className="pf-group">
                  <label>Food Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Food name" />
                </div>
                <div className="pf-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="pf-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={3} placeholder="Food description" />
              </div>
              <div className="form-row two-col">
                <div className="pf-group">
                  <label>Price (₹)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="0" />
                </div>
                <div className="pf-group">
                  <label>Discount Price (₹)</label>
                  <input type="number" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} placeholder="0 for no discount" />
                </div>
              </div>
              <div className="pf-group">
                <label>Food Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
              </div>
              <div className="form-checkboxes">
                {[
                  { key: 'isVeg', label: 'Vegetarian' },
                  { key: 'isFeatured', label: 'Featured' },
                  { key: 'isTrending', label: 'Trending' },
                  { key: 'isBestSeller', label: 'Best Seller' },
                  { key: 'isActive', label: 'Active' },
                ].map(({ key, label }) => (
                  <label key={key} className="checkbox-label">
                    <input type="checkbox" checked={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? 'Saving...' : editingFood ? 'Update Food' : 'Create Food'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminFoods;
