/*
  # Initial Schema for StockSence Inventory System

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `fullName` (text)
      - `createdAt` (timestamptz)
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (float)
      - `cost` (float)
      - `quantity` (integer)
      - `minQuantity` (integer)
      - `category` (text)
      - `imageUrl` (text, optional)
      - `createdAt` (timestamptz)
      - `updatedAt` (timestamptz)
    - `sales`
      - `id` (uuid, primary key)
      - `productId` (uuid, foreign key)
      - `productName` (text)
      - `quantity` (integer)
      - `totalPrice` (float)
      - `date` (timestamptz)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to perform CRUD operations
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  fullName text NOT NULL,
  createdAt timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price float NOT NULL DEFAULT 0,
  cost float NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 0,
  minQuantity integer NOT NULL DEFAULT 5,
  category text NOT NULL,
  imageUrl text,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

-- Create sales table
CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  productId uuid REFERENCES products(id) NOT NULL,
  productName text NOT NULL,
  quantity integer NOT NULL,
  totalPrice float NOT NULL,
  date timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for products table
CREATE POLICY "Products are viewable by authenticated users"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Products can be created by authenticated users"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Products can be updated by authenticated users"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Products can be deleted by authenticated users"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for sales table
CREATE POLICY "Sales are viewable by authenticated users"
  ON sales
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sales can be created by authenticated users"
  ON sales
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Sales can be updated by authenticated users"
  ON sales
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Sales can be deleted by authenticated users"
  ON sales
  FOR DELETE
  TO authenticated
  USING (true);