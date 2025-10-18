import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShoppingBag, Truck, Leaf } from 'lucide-react';

const onboardingData = [
  {
    icon: Leaf,
    title: 'Fresh Organic Products',
    description: 'Get the freshest vegetables and fruits delivered straight from farms',
    color: '#10b981',
  },
  {
    icon: ShoppingBag,
    title: 'Easy Shopping',
    description: 'Browse through our wide variety of products and add them to your cart',
    color: '#f59e0b',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick and reliable delivery right to your doorstep',
    color: '#3b82f6',
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <div className="onboarding-screen">
      <button className="skip-btn" onClick={handleSkip}>
        Skip
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="onboarding-content"
        >
          <div
            className="icon-wrapper"
            style={{ backgroundColor: `${onboardingData[currentSlide].color}20` }}
          >
            {onboardingData[currentSlide].icon({
              size: 80,
              color: onboardingData[currentSlide].color,
            })}
          </div>

          <h2 className="onboarding-title">{onboardingData[currentSlide].title}</h2>
          <p className="onboarding-description">
            {onboardingData[currentSlide].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="onboarding-footer">
        <div className="dots-container">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <button className="next-btn" onClick={handleNext}>
          {currentSlide === onboardingData.length - 1 ? (
            'Get Started'
          ) : (
            <>
              Next <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
