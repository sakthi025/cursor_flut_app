import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const existingItem = cartItems.find(item => item.product_id === product.id);

      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({
            quantity: existingItem.quantity + quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            product_id: product.id,
            quantity,
            user_id: null
          });

        if (error) throw error;
      }

      await loadCart();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;
      await loadCart();
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await loadCart();
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      setCartItems([]);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.products.price || 0;
      const discount = item.products.discount_percentage || 0;
      const finalPrice = price - (price * discount / 100);
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
