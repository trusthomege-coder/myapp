/*
  # Создание таблицы вопросов квиза

  1. Новые таблицы
    - `quiz_questions`
      - `id` (uuid, primary key)
      - `question` (text, текст вопроса)
      - `question_en` (text, текст вопроса на английском)
      - `options` (jsonb, варианты ответов)
      - `options_en` (jsonb, варианты ответов на английском)
      - `order_index` (integer, порядок вопроса)
      - `created_at` (timestamp)

  2. Безопасность
    - Включить RLS для таблицы `quiz_questions`
    - Все могут читать вопросы
    - Только админ может редактировать
*/

CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  question_en text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  options_en jsonb NOT NULL DEFAULT '[]',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Все могут читать вопросы квиза
CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions
  FOR SELECT
  TO public
  USING (true);

-- Только админ может редактировать вопросы
CREATE POLICY "Quiz questions are editable by admin only"
  ON quiz_questions
  FOR ALL
  TO authenticated
  USING (auth.email() = 'trusthome.ge@gmail.com');

-- Вставляем начальные вопросы квиза
INSERT INTO quiz_questions (question, question_en, options, options_en, order_index) VALUES
(
  'Какой тип недвижимости вас интересует?',
  'What type of property interests you?',
  '["Квартира", "Дом", "Вилла", "Коммерческая недвижимость"]',
  '["Apartment", "House", "Villa", "Commercial property"]',
  1
),
(
  'Какой у вас бюджет?',
  'What is your budget?',
  '["До $100,000", "$100,000 - $300,000", "$300,000 - $500,000", "Свыше $500,000"]',
  '["Up to $100,000", "$100,000 - $300,000", "$300,000 - $500,000", "Over $500,000"]',
  2
),
(
  'В каком районе вы хотели бы жить?',
  'Which area would you like to live in?',
  '["Центр Тбилиси", "Ваке", "Сабуртало", "Батуми", "Другое"]',
  '["Tbilisi Center", "Vake", "Saburtalo", "Batumi", "Other"]',
  3
),
(
  'Сколько спален вам нужно?',
  'How many bedrooms do you need?',
  '["1", "2", "3", "4+"]',
  '["1", "2", "3", "4+"]',
  4
);