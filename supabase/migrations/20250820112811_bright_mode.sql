/*
  # Fix admin properties policy

  1. Security
    - Drop existing conflicting policy
    - Create comprehensive admin policy for all operations
    - Use both email and UID checks for reliability
    - Enable RLS if not already enabled

  2. Changes
    - Allows admin user to perform all operations (SELECT, INSERT, UPDATE, DELETE)
    - Uses dual authentication check (email and UID)
    - Applies to authenticated users only
*/

-- Удаление существующей политики (если необходимо)
DROP POLICY IF EXISTS "Admin can manage properties" ON properties;

-- Создание новой политики с правилами безопасности
CREATE POLICY "Admin can manage properties"
ON properties
FOR ALL 
TO authenticated
USING (
    -- Проверка по email администратора
    (SELECT auth.email()) = 'olandrry@gmail.com'
    OR 
    -- Проверка по UID администратора
    (SELECT auth.uid()) = (
        SELECT id FROM auth.users 
        WHERE email = 'olandrry@gmail.com'
    )
);

-- Включение Row Level Security, если еще не включено
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;