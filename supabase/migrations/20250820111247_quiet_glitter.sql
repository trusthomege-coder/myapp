/*
  # Fix properties INSERT policy for admin user

  1. Changes
    - Add INSERT policy for admin user using correct auth.email() function
    - Allow admin to insert new properties into the database

  2. Security
    - Only user with email 'olandrry@gmail.com' can insert properties
    - Uses auth.email() instead of jwt() function
*/

-- Add INSERT policy for admin user
CREATE POLICY "Admin can insert properties"
  ON properties
  FOR INSERT
  TO public
  WITH CHECK (auth.email() = 'olandrry@gmail.com'::text);