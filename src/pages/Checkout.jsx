import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, User, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const cartTotal = getCartTotal();
  const deliveryFee = 40;
  const finalTotal = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        user_id: null,
        total_amount: finalTotal,
        status: 'pending',
        delivery_address: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        contact_number: formData.phone,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products.price - (item.products.price * (item.products.discount_percentage || 0) / 100),
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await clearCart();
      navigate('/order-success', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-screen">
      <header className="checkout-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1>Checkout</h1>
      </header>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <section className="form-section">
            <h2 className="section-title">
              <User size={20} />
              Personal Information
            </h2>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <div className="input-with-icon">
                <Phone size={20} className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">
              <MapPin size={20} />
              Delivery Address
            </h2>

            <div className="form-group">
              <label>Street Address *</label>
              <textarea
                name="address"
                placeholder="House/Flat No, Street, Area"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2 className="section-title">
              <CreditCard size={20} />
              Payment Method
            </h2>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                />
                <div className="payment-option-content">
                  <span className="payment-name">Cash on Delivery</span>
                  <span className="payment-desc">Pay when you receive</span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={handleChange}
                />
                <div className="payment-option-content">
                  <span className="payment-name">Online Payment</span>
                  <span className="payment-desc">UPI, Cards, Wallets</span>
                </div>
              </label>
            </div>
          </section>

          <section className="order-summary-checkout">
            <h2 className="section-title">Order Summary</h2>

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.products.name} x {item.quantity}</span>
                  <span>
                    ₹{((item.products.price - (item.products.price * (item.products.discount_percentage || 0) / 100)) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
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
                <span>Total Amount</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
