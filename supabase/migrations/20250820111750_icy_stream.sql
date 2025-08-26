/*
  # Fix properties insert policy

  1. Security
    - Update the existing policy to use proper auth.uid() comparison
    - Compare with user ID instead of email for better security
    - Use subquery to get user ID by email
*/

-- Alter the existing policy
ALTER POLICY "Admin can insert properties" ON properties
WITH CHECK (
    (SELECT auth.uid()) = (
        SELECT id 
        FROM auth.users 
        WHERE email = 'olandrry@gmail.com'
    )
);