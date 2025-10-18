import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  const cartTotal = getCartTotal();
  const deliveryFee = cartTotal > 0 ? 40 : 0;
  const finalTotal = cartTotal + deliveryFee;

  if (loading) {
    return <div className="loading-screen">Loading cart...</div>;
  }

  return (
    <div className="cart-screen">
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>My Cart</h1>
        <div className="cart-count">{cartItems.length} items</div>
      </header>

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <ShoppingBag size={80} className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some fresh products to get started!</p>
            <button className="shop-now-btn" onClick={() => navigate('/home')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => {
                const product = item.products;
                const finalPrice = product.price - (product.price * (product.discount_percentage || 0) / 100);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="cart-item"
                  >
                    <img src={product.image_url} alt={product.name} className="cart-item-image" />

                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{product.name}</h3>
                      <p className="cart-item-unit">{product.unit}</p>
                      <div className="cart-item-price">
                        {product.discount_percentage > 0 && (
                          <span className="cart-item-original-price">₹{product.price}</span>
                        )}
                        <span className="cart-item-final-price">₹{finalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="cart-quantity-controls">
                        <button
                          className="quantity-btn-small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          className="quantity-btn-small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="cart-item-total">
                        ₹{(finalPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
