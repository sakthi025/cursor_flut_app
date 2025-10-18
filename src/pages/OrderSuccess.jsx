import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Package } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (!orderId) {
      navigate('/home');
    }
  }, [orderId, navigate]);

  return (
    <div className="order-success-screen">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="success-content"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="success-icon"
        >
          <CheckCircle size={100} color="#10b981" strokeWidth={2} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="success-title"
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="success-message"
        >
          Thank you for your order. Your fresh products will be delivered soon!
        </motion.p>

        {orderId && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="order-id-box"
          >
            <Package size={20} />
            <div>
              <span className="order-id-label">Order ID</span>
              <span className="order-id-value">{orderId.slice(0, 8).toUpperCase()}</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="delivery-info"
        >
          <div className="info-item">
            <span className="info-label">Estimated Delivery</span>
            <span className="info-value">2-3 Business Days</span>
          </div>
          <div className="info-item">
            <span className="info-label">Payment Status</span>
            <span className="info-value">Confirmed</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="success-actions"
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="primary-action-btn"
            onClick={() => navigate('/home')}
          >
            <Home size={20} />
            Continue Shopping
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="thank-you-note"
        >
          <p>We appreciate your business and hope you enjoy your fresh products!</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.3 }}
        className="confetti-bg"
      >
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="confetti"
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{
              y: window.innerHeight + 100,
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 0.5,
              repeat: Infinity,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)],
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
