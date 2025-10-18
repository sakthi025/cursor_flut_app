import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      navigate('/cart');
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!product) {
    return <div className="error-screen">Product not found</div>;
  }

  const finalPrice = product.price - (product.price * (product.discount_percentage || 0) / 100);

  return (
    <div className="product-detail-screen">
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Product Details</h1>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart size={24} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </header>

      <div className="detail-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="detail-image-wrapper"
        >
          {product.discount_percentage > 0 && (
            <div className="discount-badge-large">-{product.discount_percentage}%</div>
          )}
          <img src={product.image_url} alt={product.name} className="detail-image" />
        </motion.div>

        <div className="detail-info">
          <div className="detail-header-info">
            <div>
              <h2 className="detail-title">{product.name}</h2>
              <p className="detail-category">{product.categories?.name}</p>
            </div>
            <div className="detail-rating">
              <Star size={20} fill="#fbbf24" color="#fbbf24" />
              <span className="rating-value">{product.rating}</span>
            </div>
          </div>

          <div className="detail-price-section">
            <div>
              {product.discount_percentage > 0 && (
                <span className="detail-original-price">₹{product.price}</span>
              )}
              <div className="detail-final-price">
                <span className="price-amount">₹{finalPrice.toFixed(2)}</span>
                <span className="price-unit">/{product.unit}</span>
              </div>
            </div>
            <div className="stock-badge">
              {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>

          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-details-grid">
            <div className="detail-item">
              <span className="detail-label">Unit</span>
              <span className="detail-value">{product.unit}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stock</span>
              <span className="detail-value">{product.stock_quantity}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category</span>
              <span className="detail-value">{product.categories?.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Rating</span>
              <span className="detail-value">{product.rating} ⭐</span>
            </div>
          </div>

          <div className="quantity-section">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={20} />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-footer">
        <div className="footer-price">
          <span className="footer-label">Total Price</span>
          <span className="footer-amount">₹{(finalPrice * quantity).toFixed(2)}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="add-to-cart-btn-large"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={20} />
          Add to Cart
        </motion.button>
      </div>
    </div>
  );
};

export default ProductDetail;
