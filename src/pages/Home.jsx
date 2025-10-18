import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, User, Leaf, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const loadData = async () => {
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('products').select('*').eq('is_available', true),
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (productsRes.error) throw productsRes.error;

      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
      setFilteredProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const cartCount = getCartCount();

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="header-top">
          <div className="logo-section">
            <Leaf size={32} className="logo-icon" />
            <div>
              <h1 className="app-name">FreshBasket</h1>
              <p className="app-subtitle">Farm Fresh Delivery</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/cart')}>
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="icon-btn">
              <User size={24} />
            </button>
          </div>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search vegetables, fruits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </header>

      <main className="home-content">
        <section className="categories-section">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="categories-scroll"
          >
            <button
              className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-chip ${
                  selectedCategory === category.id ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </section>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="filters-panel"
          >
            <h3>Filters</h3>
            <div className="filter-options">
              <label>
                <input type="checkbox" /> On Sale
              </label>
              <label>
                <input type="checkbox" /> High Rated (4+)
              </label>
              <label>
                <input type="checkbox" /> In Stock
              </label>
            </div>
          </motion.div>
        )}

        <section className="products-section">
          <div className="section-header">
            <h2>Fresh Products</h2>
            <p>{filteredProducts.length} items</p>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
