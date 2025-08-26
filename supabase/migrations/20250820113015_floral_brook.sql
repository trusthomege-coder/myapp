/*
  # Complete RLS policies for properties table

  1. Security
    - Enable RLS on properties table
    - Allow public read access for all properties
    - Allow admin full access (insert, update, delete)
    - Admin identified by email: olandrry@gmail.com

  2. Policies
    - Public can read all properties
    - Admin can manage all properties (CRUD operations)
*/

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can read properties" ON properties;
DROP POLICY IF EXISTS "Admin can manage properties" ON properties;
DROP POLICY IF EXISTS "Admin can insert properties" ON properties;
DROP POLICY IF EXISTS "Only admins can modify properties" ON properties;

-- Allow public read access to all properties
CREATE POLICY "Public can read properties"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Allow admin full access to properties
CREATE POLICY "Admin can manage properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (
    -- Check by email
    (SELECT auth.email()) = 'olandrry@gmail.com'
  )
  WITH CHECK (
    -- Check by email for insert/update operations
    (SELECT auth.email()) = 'olandrry@gmail.com'
  );