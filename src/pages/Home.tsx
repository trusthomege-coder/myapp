import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, CheckCircle, Users, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import PriceRangeSlider from '../components/PriceRangeSlider';
import ModernCalendar from '../components/ModernCalendar';
import QuizPopup from '../components/QuizPopup';
import { handleHeroFormSubmission, handleRequestFormSubmission } from '../lib/notifications';
import { supabase } from '../lib/supabase';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [requestData, setRequestData] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: '',
    priceRange: [0, 1000000] as [number, number],
    bookingDate: '',
    bookingTime: 'morning' as 'morning' | 'afternoon' | 'evening',
    language: 'en',
    guests: 1,
    accompaniment: false,
    amenities: false,
    amenitiesDetails: '',
    withChildren: false,
    withPets: false,
  });
  const [heroLoading, setHeroLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [heroSuccess, setHeroSuccess] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_featured', true)
          .limit(6);

        if (error) {
          throw error;
        }

        const processedData = (data || []).map(property => ({
          ...property,
          image_url: typeof property.image_url === 'string' && property.image_url.startsWith('[')
            ? JSON.parse(property.image_url)
            : property.image_url
        }));
        
        setFeaturedProperties(processedData);

      } catch (err) {
        console.error('Ошибка при загрузке топ-объявлений:', err);
        setError('Не удалось загрузить топ-объявления.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleContactAgent = () => {
    window.location.href = '/contacts';
  };

  const reviews = [
    {
      name: 'Sarah Johnson',
      text: 'Trust Home made finding our dream house so easy. Their team was professional and helped us every step of the way.',
      rating: 5,
    },
    {
      name: 'David Chen',
      text: 'Excellent service! They found us the perfect investment property within our budget. Highly recommended.',
      rating: 5,
    },
    {
      name: 'Maria Rodriguez',
      text: 'The process was smooth and transparent. Trust Home truly lives up to their name.',
      rating: 5,
    },
  ];

  const advantages = [
    {
      icon: Shield,
      title: t('secureDeals'),
      description: t('secureDealsDesc'),
    },
    {
      icon: CheckCircle,
      title: t('verifiedListings'),
      description: t('verifiedListingsDesc'),
    },
    {
      icon: Users,
      title: t('trustedDevelopers'),
      description: t('trustedDevelopersDesc'),
    },
    {
      icon: Zap,
      title: t('easyProcess'),
      description: t('easyProcessDesc'),
    },
  ];

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    setHeroLoading(true);
    
    try {
      const result = await handleHeroFormSubmission(formData);
      
      if (result.success) {
        setHeroSuccess(true);
        setFormData({ name: '', email: '', phone: '' });
        setTimeout(() => setHeroSuccess(false), 5000);
      } else {
        alert(result.error || 'Произошла ошибка при отправке');
      }
    } catch (error) {
      alert('Произошла ошибка при отправке');
    } finally {
      setHeroLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestData.name || !requestData.email || !requestData.phone) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    setRequestLoading(true);
    
    try {
      const result = await handleRequestFormSubmission(requestData);
      
      if (result.success) {
        setRequestSuccess(true);
        setRequestData({ name: '', email: '', phone: '', preferences: '' });
        setTimeout(() => setRequestSuccess(false), 5000);
      } else {
        alert(result.error || 'Произошла ошибка при отправке');
      }
    } catch (error) {
      alert('Произошла ошибка при отправке');
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1974596/pexels-photo-1974596.jpeg"
            alt="Modern luxury home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Trust Home
          </h1>
          
          <p className="text-xl md:text-2xl font-light mb-4">
            {t('heroTitle')}
          </p>
          
          <p className="text-lg text-gray-200 mb-12">
            {t('heroSubtitle')}
          </p>

          {heroSuccess && (
            <div className="mb-6 bg-green-500 text-white px-6 py-3 rounded-full text-center max-w-md mx-auto">
              ✅ Спасибо! Мы свяжемся с вами в ближайшее время
            </div>
          )}

          {/* Hero Form */}
          <form
            onSubmit={handleHeroSubmit}
            className="flex flex-col sm:flex-row gap-4 justify-center max-w-4xl mx-auto"
          >
            <input
              type="email"
              placeholder={t('email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none flex-1 min-w-0"
            />
            <input
              type="tel"
              placeholder={t('phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none flex-1 min-w-0"
            />
            <input
              type="text"
              placeholder={t('yourName')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-6 py-3 rounded-full text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none flex-1 min-w-0"
            />
            <button
              type="submit"
              disabled={heroLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {heroLoading ? 'Отправка...' : t('submit')}
            </button>
          </form>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('featuredProperties')}
            </h2>
          </motion.div>
          {isLoading && <div className="text-center text-gray-500">Загрузка объявлений...</div>}
          {error && <div className="text-center text-red-500">{error}</div>}
          {!isLoading && featuredProperties.length === 0 && !error && (
            <div className="text-center text-gray-500">Топ-объявления не найдены.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PropertyCard
                  {...property}
                  image_url={
                    Array.isArray(property.image_url) && property.image_url.length > 0
                      ? property.image_url[0]
                      : '/path/to/placeholder-image.jpg'
                  }
                  onContactAgent={handleContactAgent}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trust Home */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('whyTrustHome')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <advantage.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">
                  {advantage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('customerReviews')}
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(reviews[currentReview].rating)].map((_, i) => (
                  <div key={i} className="w-5 h-5 text-yellow-400">★</div>
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-6 italic">
                "{reviews[currentReview].text}"
              </p>
              <p className="font-semibold text-gray-900">
                {reviews[currentReview].name}
              </p>
            </div>

            <button
              onClick={() => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('leaveRequest')}
            </h2>
            <p className="text-blue-100">
              {t('requestSubtitle')}
            </p>
          </motion.div>

          {requestSuccess && (
            <div className="mb-6 bg-green-500 text-white px-6 py-3 rounded-lg text-center max-w-md mx-auto">
              ✅ {t('requestSent')}
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleRequestSubmit}
            className="bg-white rounded-2xl p-8"
          >
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder={t('yourName')}
                value={requestData.name}
                onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              <input
                type="email"
                placeholder={t('email')}
                value={requestData.email}
                onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              </div>
              
              <div>
              <input
                type="tel"
                placeholder={t('phone')}
                value={requestData.phone}
                onChange={(e) => setRequestData({ ...requestData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              </div>
              
              <div>
              <textarea
                  placeholder={`${t('description')} (${t('optional')})`}
                value={requestData.preferences}
                onChange={(e) => setRequestData({ ...requestData, preferences: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
              ></textarea>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('desiredPriceRange')}
                </label>
                <PriceRangeSlider
                  min={0}
                  max={1000000}
                  value={requestData.priceRange}
                  onChange={(value) => setRequestData({ ...requestData, priceRange: value })}
                  step={10000}
                />
              </div>
              
              {/* Booking Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('bookingPreferences')}
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('selectDate')}
                    </label>
                    <ModernCalendar
                      selectedDate={requestData.bookingDate}
                      onDateSelect={(date) => setRequestData({ ...requestData, bookingDate: date })}
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('preferredTime')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'morning', label: t('morning') },
                        { value: 'afternoon', label: t('afternoon') },
                        { value: 'evening', label: t('evening') },
                      ].map((slot) => (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => setRequestData({ ...requestData, bookingTime: slot.value as any })}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                            requestData.bookingTime === slot.value
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                          }`}
                        >
                          <div className="font-medium text-sm">{slot.label.split(' ')[0]}</div>
                          <div className="text-xs text-gray-500 mt-1">{slot.label.split(' ').slice(1).join(' ')}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Services */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">{t('additionalServices')}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={requestData.accompaniment}
                      onChange={(e) => setRequestData({ ...requestData, accompaniment: e.target.checked })}
                      className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">{t('transportationService')}</span>
                      <p className="text-sm text-gray-600">{t('transportationDesc')}</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={requestData.amenities}
                      onChange={(e) => setRequestData({ ...requestData, amenities: e.target.checked })}
                      className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{t('refreshments')}</span>
                      <p className="text-sm text-gray-600 mb-2">{t('refreshmentsDesc')}</p>
                      {requestData.amenities && (
                        <input
                          type="text"
                          value={requestData.amenitiesDetails}
                          onChange={(e) => setRequestData({ ...requestData, amenitiesDetails: e.target.value })}
                          placeholder={t('specifyPreferences')}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                        />
                      )}
                    </div>
                  </label>
                </div>
                
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestData.withChildren}
                      onChange={(e) => setRequestData({ ...requestData, withChildren: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-900">{t('comingWithChildren')}</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestData.withPets}
                      onChange={(e) => setRequestData({ ...requestData, withPets: e.target.checked })}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-900">{t('comingWithPets')}</span>
                  </label>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={requestLoading}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg hover:shadow-xl"
            >
              {requestLoading ? 'Отправка...' : t('submitRequest')}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Quiz Popup */}
      <QuizPopup isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
};

export default Home;
