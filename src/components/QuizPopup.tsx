import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { sendTelegramNotification } from '../lib/notifications';

interface QuizQuestion {
  id: string;
  question: string;
  question_en: string;
  options: string[];
  options_en: string[];
  order_index: number;
}

interface QuizPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizPopup: React.FC<QuizPopupProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [step, setStep] = useState<'quiz' | 'contact' | 'success'>('quiz');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setError('Ошибка загрузки вопросов');
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStep('contact');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('quiz_responses')
        .insert([{
          responses: answers,
          contact_info: contactInfo,
          created_at: new Date().toISOString(),
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
      }

      // Format answers for Telegram
      const formattedAnswers = questions.map((question, index) => {
        const answer = answers[question.id];
        const questionText = language === 'en' ? question.question_en : question.question;
        return `${index + 1}. ${questionText}\n   Ответ: ${answer || 'Не отвечено'}`;
      }).join('\n\n');

      // Send to Telegram
      const telegramMessage = `
🎯 <b>Новый результат квиза Trust Home</b>

👤 <b>Контактная информация:</b>
• Имя: ${contactInfo.name}
• Email: ${contactInfo.email}
• Телефон: ${contactInfo.phone}

📋 <b>Ответы на вопросы:</b>
${formattedAnswers}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
      `.trim();

      await sendTelegramNotification(telegramMessage);

      setStep('success');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Ошибка при отправке. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setContactInfo({ name: '', email: '', phone: '' });
    setStep('quiz');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 'quiz' && 'Квиз по недвижимости'}
                {step === 'contact' && 'Контактная информация'}
                {step === 'success' && 'Спасибо!'}
              </h2>
              {step === 'quiz' && questions.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Вопрос {currentQuestionIndex + 1} из {questions.length}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Progress Bar */}
          {step === 'quiz' && (
            <div className="px-6 py-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {step === 'quiz' && currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {language === 'en' ? currentQuestion.question_en : currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {(language === 'en' ? currentQuestion.options_en : currentQuestion.options).map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                          answers[currentQuestion.id] === option
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            answers[currentQuestion.id] === option
                              ? 'border-orange-500 bg-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion.id] === option && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Назад</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!answers[currentQuestion.id]}
                    className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span>{currentQuestionIndex === questions.length - 1 ? 'Далее' : 'Следующий'}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'contact' && (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Оставьте свои контакты
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Мы свяжемся с вами и подберем идеальные варианты недвижимости на основе ваших ответов.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="Введите ваше имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="+995 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => setStep('quiz')}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>К вопросам</span>
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Отправка...' : 'Отправить'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Спасибо за прохождение квиза!
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Мы получили ваши ответы и свяжемся с вами в ближайшее время с персональными рекомендациями.
                </p>

                <button
                  onClick={handleClose}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-8 py-3 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200"
                >
                  Закрыть
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizPopup;