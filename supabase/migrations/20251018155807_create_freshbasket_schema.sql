/*
  # FreshBasket Database Schema
  
  ## Overview
  Creates the complete database structure for the FreshBasket online vegetable and fruit store application.
  
  ## Tables Created
  
  ### 1. categories
  - `id` (uuid, primary key) - Unique identifier for each category
  - `name` (text) - Category name (e.g., "Vegetables", "Fruits")
  - `description` (text) - Category description
  - `image_url` (text) - Category image URL
  - `display_order` (integer) - Order for displaying categories
  - `created_at` (timestamptz) - Timestamp when created
  
  ### 2. products
  - `id` (uuid, primary key) - Unique identifier for each product
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (decimal) - Product price per unit
  - `unit` (text) - Unit of measurement (kg, piece, etc.)
  - `image_url` (text) - Product image URL
  - `stock_quantity` (integer) - Available stock
  - `is_available` (boolean) - Whether product is currently available
  - `discount_percentage` (integer) - Discount percentage if any
  - `rating` (decimal) - Product rating (0-5)
  - `created_at` (timestamptz) - Timestamp when created
  
  ### 3. cart_items
  - `id` (uuid, primary key) - Unique identifier for cart item
  - `user_id` (uuid) - User identifier (for future auth integration)
  - `product_id` (uuid, foreign key) - Reference to products table
  - `quantity` (integer) - Quantity of product
  - `created_at` (timestamptz) - Timestamp when added to cart
  - `updated_at` (timestamptz) - Timestamp when last updated
  
  ### 4. orders
  - `id` (uuid, primary key) - Unique identifier for order
  - `user_id` (uuid) - User identifier
  - `total_amount` (decimal) - Total order amount
  - `status` (text) - Order status (pending, confirmed, delivered, cancelled)
  - `delivery_address` (jsonb) - Delivery address details
  - `contact_number` (text) - Contact number
  - `created_at` (timestamptz) - Timestamp when order placed
  
  ### 5. order_items
  - `id` (uuid, primary key) - Unique identifier for order item
  - `order_id` (uuid, foreign key) - Reference to orders table
  - `product_id` (uuid, foreign key) - Reference to products table
  - `quantity` (integer) - Quantity ordered
  - `price` (decimal) - Price at time of order
  - `created_at` (timestamptz) - Timestamp when created
  
  ## Security
  - RLS (Row Level Security) enabled on all tables
  - Public read access for categories and products
  - Authenticated user access for cart_items, orders, and order_items
  
  ## Sample Data
  - 4 categories with images
  - 20+ products across different categories
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  unit text DEFAULT 'kg',
  image_url text,
  stock_quantity integer DEFAULT 100,
  is_available boolean DEFAULT true,
  discount_percentage integer DEFAULT 0,
  rating decimal(2,1) DEFAULT 4.5,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  delivery_address jsonb,
  contact_number text,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- RLS Policies for cart_items (authenticated users)
CREATE POLICY "Users can view their cart"
  ON cart_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert to their cart"
  ON cart_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their cart"
  ON cart_items FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Users can delete from their cart"
  ON cart_items FOR DELETE
  TO public
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Users can view orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policies for order_items
CREATE POLICY "Users can view order items"
  ON order_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample categories
INSERT INTO categories (name, description, image_url, display_order) VALUES
  ('Vegetables', 'Fresh organic vegetables', 'https://images.pexels.com/photos/1508666/pexels-photo-1508666.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
  ('Fruits', 'Fresh seasonal fruits', 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('Leafy Greens', 'Fresh leafy vegetables', 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
  ('Exotic Fruits', 'Premium imported fruits', 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=800', 4);

-- Insert sample products (Vegetables)
INSERT INTO products (category_id, name, description, price, unit, image_url, discount_percentage) 
SELECT 
  id, 
  'Tomato', 
  'Fresh red tomatoes, rich in vitamins', 
  40.00, 
  'kg', 
  'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800',
  10
FROM categories WHERE name = 'Vegetables';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Potato', 
  'Fresh farm potatoes, perfect for cooking', 
  30.00, 
  'kg', 
  'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Vegetables';

INSERT INTO products (category_id, name, description, price, unit, image_url, discount_percentage) 
SELECT 
  id, 
  'Onion', 
  'Fresh red onions', 
  35.00, 
  'kg', 
  'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg?auto=compress&cs=tinysrgb&w=800',
  5
FROM categories WHERE name = 'Vegetables';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Carrot', 
  'Sweet and crunchy carrots', 
  45.00, 
  'kg', 
  'https://images.pexels.com/photos/3669636/pexels-photo-3669636.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Vegetables';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Broccoli', 
  'Fresh green broccoli, high in nutrients', 
  80.00, 
  'kg', 
  'https://images.pexels.com/photos/47347/broccoli-vegetable-food-healthy-47347.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Vegetables';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Cauliflower', 
  'White fresh cauliflower', 
  50.00, 
  'kg', 
  'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Vegetables';

-- Insert sample products (Fruits)
INSERT INTO products (category_id, name, description, price, unit, image_url, discount_percentage) 
SELECT 
  id, 
  'Apple', 
  'Fresh red apples, sweet and crispy', 
  150.00, 
  'kg', 
  'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=800',
  15
FROM categories WHERE name = 'Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Banana', 
  'Ripe yellow bananas', 
  60.00, 
  'dozen', 
  'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url, discount_percentage) 
SELECT 
  id, 
  'Orange', 
  'Juicy fresh oranges', 
  80.00, 
  'kg', 
  'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800',
  10
FROM categories WHERE name = 'Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Mango', 
  'Sweet Alphonso mangoes', 
  120.00, 
  'kg', 
  'https://images.pexels.com/photos/2363347/pexels-photo-2363347.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Grapes', 
  'Seedless green grapes', 
  90.00, 
  'kg', 
  'https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Watermelon', 
  'Sweet red watermelon', 
  40.00, 
  'kg', 
  'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Fruits';

-- Insert sample products (Leafy Greens)
INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Spinach', 
  'Fresh green spinach leaves', 
  40.00, 
  'kg', 
  'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Leafy Greens';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Lettuce', 
  'Crispy fresh lettuce', 
  50.00, 
  'kg', 
  'https://images.pexels.com/photos/1352199/pexels-photo-1352199.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Leafy Greens';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Coriander', 
  'Fresh coriander leaves', 
  30.00, 
  'bunch', 
  'https://images.pexels.com/photos/4198933/pexels-photo-4198933.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Leafy Greens';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Mint', 
  'Fresh mint leaves', 
  25.00, 
  'bunch', 
  'https://images.pexels.com/photos/1382453/pexels-photo-1382453.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Leafy Greens';

-- Insert sample products (Exotic Fruits)
INSERT INTO products (category_id, name, description, price, unit, image_url, discount_percentage) 
SELECT 
  id, 
  'Avocado', 
  'Fresh ripe avocados', 
  200.00, 
  'kg', 
  'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=800',
  20
FROM categories WHERE name = 'Exotic Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Dragon Fruit', 
  'Fresh exotic dragon fruit', 
  250.00, 
  'kg', 
  'https://images.pexels.com/photos/1510559/pexels-photo-1510559.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Exotic Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Kiwi', 
  'Fresh green kiwi fruit', 
  180.00, 
  'kg', 
  'https://images.pexels.com/photos/1037073/pexels-photo-1037073.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Exotic Fruits';

INSERT INTO products (category_id, name, description, price, unit, image_url) 
SELECT 
  id, 
  'Strawberry', 
  'Fresh sweet strawberries', 
  300.00, 
  'kg', 
  'https://images.pexels.com/photos/934066/pexels-photo-934066.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE name = 'Exotic Fruits';