/*
  # Создание таблицы недвижимости

  1. Новые таблицы
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text, название объекта)
      - `description` (text, описание)
      - `price` (numeric, цена)
      - `location` (text, местоположение)
      - `bedrooms` (integer, количество спален)
      - `bathrooms` (integer, количество ванных)
      - `area` (integer, площадь)
      - `image_url` (text, ссылка на изображение)
      - `category` (text, категория: rent/sale/project)
      - `type` (text, тип: apartment/house/villa/commercial)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Безопасность
    - Включить RLS для таблицы `properties`
    - Добавить политики для чтения всем пользователям
    - Добавить политики для записи только администраторам
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric,
  location text,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  area integer,
  image_url text,
  category text DEFAULT 'sale' CHECK (category IN ('rent', 'sale', 'project')),
  type text DEFAULT 'apartment' CHECK (type IN ('apartment', 'house', 'villa', 'commercial')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Политика для чтения всем пользователям
CREATE POLICY "Properties are viewable by everyone"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Политика для записи только администраторам
CREATE POLICY "Properties are editable by admin only"
  ON properties
  FOR ALL
  TO authenticated
  USING (auth.email() = 'trusthome.ge@gmail.com');