/*
  # Создание таблицы ответов квиза

  1. Новые таблицы
    - `quiz_responses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users, nullable)
      - `responses` (jsonb, ответы пользователя)
      - `contact_info` (jsonb, контактная информация)
      - `created_at` (timestamp)

  2. Безопасность
    - Включить RLS для таблицы `quiz_responses`
    - Пользователи могут создавать ответы
    - Только админ может просматривать все ответы
*/

CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  responses jsonb NOT NULL DEFAULT '{}',
  contact_info jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Все могут создавать ответы квиза
CREATE POLICY "Anyone can create quiz responses"
  ON quiz_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Пользователи могут видеть свои ответы
CREATE POLICY "Users can view own quiz responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Только админ может видеть все ответы
CREATE POLICY "Admin can view all quiz responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'trusthome.ge@gmail.com');