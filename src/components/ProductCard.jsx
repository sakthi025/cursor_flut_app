import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const finalPrice = product.price - (product.price * (product.discount_percentage || 0) / 100);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const success = await addToCart(product);
    if (success) {
      const notification = document.createElement('div');
      notification.className = 'cart-notification';
      notification.textContent = 'Added to cart!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="product-card"
      onClick={handleCardClick}
    >
      {product.discount_percentage > 0 && (
        <div className="discount-badge">-{product.discount_percentage}%</div>
      )}

      <div className="product-image-wrapper">
        <img src={product.image_url} alt={product.name} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
          <span>{product.rating}</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            {product.discount_percentage > 0 && (
              <span className="original-price">₹{product.price}</span>
            )}
            <span className="final-price">₹{finalPrice.toFixed(2)}</span>
            <span className="product-unit">/{product.unit}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
