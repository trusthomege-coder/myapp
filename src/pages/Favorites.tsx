import React, { useEffect, useState } from 'react';
import { Heart, Home, Calendar, Users, Send, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import ModernCalendar from '../components/ModernCalendar';
import { sendTelegramNotification } from '../lib/notifications';

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image_url: string | string[];
  category: 'rent' | 'sale' | 'project';
  type: string;
}

interface BookingData {
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  language: string;
  guests: number;
  accompaniment: boolean;
  amenities: boolean;
  amenitiesDetails: string;
  withChildren: boolean;
  withPets: boolean;
  userName: string;
  userEmail: string;
  userPhone: string;
  comment: string;
}

const Favorites: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [bookingStep, setBookingStep] = useState<'select' | 'booking' | 'contact'>('select');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: '',
    timeSlot: 'morning',
    language: 'en',
    guests: 1,
    accompaniment: false,
    amenities: false,
    amenitiesDetails: '',
    withChildren: false,
    withPets: false,
    userName: '',
    userEmail: '',
    userPhone: '',
    comment: '',
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ge', name: 'ქართული', flag: '🇬🇪' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const timeSlots = [
    { value: 'morning', label: 'Morning (9:00 - 12:00)' },
    { value: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
    { value: 'evening', label: 'Evening (17:00 - 20:00)' },
  ];

  useEffect(() => {
    if (user && favorites.length > 0) {
      fetchFavoriteProperties();
    } else {
      setProperties([]);
      setLoading(false);
    }
  }, [user, favorites]);

  const fetchFavoriteProperties = async () => {
    if (favorites.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .in('id', favorites);

      if (error) throw error;

      // Parse image_url JSON strings back to arrays
      const processedData = (data || []).map(property => ({
        ...property,
        image_url: typeof property.image_url === 'string' && property.image_url.startsWith('[')
          ? JSON.parse(property.image_url)
          : property.image_url
      }));

      setProperties(processedData);
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleViewings = () => {
    if (properties.length === 0) return;
    setShowBookingModal(true);
    setBookingStep('select');
    setSelectedProperties([]);
  };

  const handlePropertySelect = (propertyId: number) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleBookingSubmit = () => {
    if (!bookingData.date) {
      alert('Please select a date');
      return;
    }
    setBookingStep('contact');
  };

  const handleFinalSubmit = async () => {
    if (!bookingData.userName || !bookingData.userEmail || !bookingData.userPhone) {
      alert('Please fill in all contact fields');
      return;
    }

    if (selectedProperties.length === 0) {
      alert('Please select at least one property');
      return;
    }

    setBookingLoading(true);

    try {
      const selectedProps = properties.filter(p => selectedProperties.includes(p.id));
      
      // Format message for Telegram
      const propertiesInfo = selectedProps.map(property => `
🏠 <b>ID: ${property.id}</b> - ${property.title}
📍 ${property.location}
💰 $${property.price.toLocaleString()}${property.category === 'rent' ? '/месяц' : ''}
🏠 ${property.type} (${property.category === 'rent' ? 'Аренда' : property.category === 'sale' ? 'Продажа' : 'Проект'})
🛏️ ${property.bedrooms} спален, ${property.bathrooms} ванных, ${property.area} кв.м`).join('\n\n');

      const telegramMessage = `
🏠 <b>Групповая заявка на просмотр недвижимости</b>

👤 <b>Контактная информация:</b>
• Имя: ${bookingData.userName}
• Email: ${bookingData.userEmail}
• Телефон: ${bookingData.userPhone}

📅 <b>Детали просмотра:</b>
• Дата: ${bookingData.date}
• Время: ${timeSlots.find(slot => slot.value === bookingData.timeSlot)?.label}
• Язык: ${languages.find(lang => lang.code === bookingData.language)?.name}
• Количество людей: ${bookingData.guests}
• Сопровождение: ${bookingData.accompaniment ? 'Да' : 'Нет'}
• Удобства: ${bookingData.amenities ? (bookingData.amenitiesDetails || 'Да') : 'Нет'}
• С детьми: ${bookingData.withChildren ? 'Да' : 'Нет'}
• С питомцами: ${bookingData.withPets ? 'Да' : 'Нет'}

💬 <b>Комментарий:</b> ${bookingData.comment || 'Нет'}

🏡 <b>Выбранные объекты (${selectedProps.length}):</b>
${propertiesInfo}

⏰ <b>Время заявки:</b> ${new Date().toLocaleString('ru-RU')}
      `.trim();

      await sendTelegramNotification(telegramMessage);
      
      alert('Group booking request submitted successfully!');
      setShowBookingModal(false);
      setBookingStep('select');
      setSelectedProperties([]);
      setBookingData({
        date: '',
        timeSlot: 'morning',
        language: 'en',
        guests: 1,
        accompaniment: false,
        amenities: false,
        amenitiesDetails: '',
        withChildren: false,
        withPets: false,
        userName: '',
        userEmail: '',
        userPhone: '',
        comment: '',
      });
    } catch (error) {
      console.error('Error submitting group booking:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              Please sign in to view your favorite properties.
            </p>
            <button
              onClick={() => {
                const event = new CustomEvent('openAuthModal');
                window.dispatchEvent(event);
              }}
              className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || favoritesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Favorites
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-600">
                Schedule viewings for multiple properties at once
              </p>
              {properties.length > 0 && (
                <button 
                  onClick={handleScheduleViewings}
                  className="bg-blue-700 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Viewings</span>
                </button>
              )}
            </div>
            {properties.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                You have {properties.length} favorite {properties.length === 1 ? 'property' : 'properties'}
              </p>
            )}
          </motion.div>

          {/* Empty State */}
          {properties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Favorites Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start exploring our properties and click the heart icon to add them to your favorites.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/catalog"
                  className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
                >
                  <Home className="h-5 w-5" />
                  <span>Browse Properties</span>
                </a>
                <a
                  href="/rent"
                  className="border border-blue-700 text-blue-700 py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                  View Rentals
                </a>
              </div>
            </motion.div>
          ) : (
            /* Properties Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <PropertyCard
                    id={property.id}
                    title={property.title}
                    price={property.price}
                    location={property.location}
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    area={property.area}
                    image={property.image_url}
                    isForRent={property.category === 'rent'}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Tips Section */}
          {properties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-16 bg-blue-50 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                💡 Tips for Managing Your Favorites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">Compare Properties</h3>
                  <p>Use your favorites list to easily compare different properties side by side.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quick Access</h3>
                  <p>Your favorites are saved and accessible from any device when you're signed in.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Share with Others</h3>
                  <p>Contact our agents to share your favorite properties with family or friends.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Get Notifications</h3>
                  <p>We'll notify you if there are price changes or updates to your favorite properties.</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Group Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-900">
                  {bookingStep === 'select' && 'Select Properties for Viewing'}
                  {bookingStep === 'booking' && 'Schedule Group Viewing'}
                  {bookingStep === 'contact' && 'Contact Information'}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                {bookingStep === 'select' && (
                  <div>
                    <p className="text-gray-600 mb-6">Select the properties you want to schedule viewings for:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {properties.map((property) => (
                        <div
                          key={property.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            selectedProperties.includes(property.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handlePropertySelect(property.id)}
                        >
                          <div className="flex items-start space-x-4">
                            <img
                              src={Array.isArray(property.image_url) ? property.image_url[0] : property.image_url}
                              alt={property.title}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">#{property.id} - {property.title}</h3>
                              <p className="text-sm text-gray-600">{property.location}</p>
                              <p className="text-sm font-medium text-blue-700">
                                ${property.price.toLocaleString()}{property.category === 'rent' && '/month'}
                              </p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedProperties.includes(property.id)
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedProperties.includes(property.id) && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        {selectedProperties.length} of {properties.length} properties selected
                      </p>
                      <button
                        onClick={() => setBookingStep('booking')}
                        disabled={selectedProperties.length === 0}
                        className="bg-blue-700 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue ({selectedProperties.length})
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 'booking' && (
                  <div className="max-w-2xl mx-auto">
                    <div className="flex flex-col items-center space-y-8">
                      {/* Modern Calendar */}
                      <div className="flex justify-center">
                        <ModernCalendar
                          selectedDate={bookingData.date}
                          onDateSelect={(date) => setBookingData({ ...bookingData, date })}
                          minDate={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      {/* Time Selection */}
                      <div className="w-full max-w-sm">
                        <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">Preferred Time</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot.value}
                              onClick={() => setBookingData({ ...bookingData, timeSlot: slot.value as any })}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                                bookingData.timeSlot === slot.value
                                  ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                                  : 'border-gray-200 hover:border-orange-300'
                              }`}
                            >
                              <div className="font-medium text-sm">{slot.label.split(' ')[0]}</div>
                              <div className="text-xs text-gray-500 mt-1">{slot.label.split(' ').slice(1).join(' ')}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Language Selection */}
                      <div className="w-full max-w-sm">
                        <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">Preferred Language</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {languages.slice(0, 3).map((lang) => (
                            <button
                              key={lang.code}
                              onClick={() => setBookingData({ ...bookingData, language: lang.code })}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                                bookingData.language === lang.code
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="text-lg">{lang.flag}</span>
                              <span className="text-sm font-medium">{lang.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Additional Options */}
                      <div className="w-full max-w-sm space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                          <select
                            value={bookingData.guests}
                            onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                          >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? 'person' : 'people'}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bookingData.accompaniment}
                              onChange={(e) => setBookingData({ ...bookingData, accompaniment: e.target.checked })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-900">Transportation service</span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bookingData.amenities}
                              onChange={(e) => setBookingData({ ...bookingData, amenities: e.target.checked })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-900">Refreshments</span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bookingData.withChildren}
                              onChange={(e) => setBookingData({ ...bookingData, withChildren: e.target.checked })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-900">Coming with children</span>
                          </label>

                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bookingData.withPets}
                              onChange={(e) => setBookingData({ ...bookingData, withPets: e.target.checked })}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-900">Coming with pets</span>
                          </label>
                        </div>

                        <textarea
                          value={bookingData.comment}
                          onChange={(e) => setBookingData({ ...bookingData, comment: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                          placeholder="Additional comments..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-4 w-full max-w-sm">
                        <button
                          onClick={() => setBookingStep('select')}
                          className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleBookingSubmit}
                          className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 px-6 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {bookingStep === 'contact' && (
                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                      <input
                        type="text"
                        value={bookingData.userName}
                        onChange={(e) => setBookingData({ ...bookingData, userName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={bookingData.userEmail}
                        onChange={(e) => setBookingData({ ...bookingData, userEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        value={bookingData.userPhone}
                        onChange={(e) => setBookingData({ ...bookingData, userPhone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="+995 XXX XXX XXX"
                      />
                    </div>

                    {/* Selected Properties Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Selected Properties ({selectedProperties.length})</h4>
                      <div className="space-y-2">
                        {properties.filter(p => selectedProperties.includes(p.id)).map((property) => (
                          <div key={property.id} className="text-sm">
                            <span className="font-medium">#{property.id}</span> - {property.title}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-medium">{bookingData.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">{timeSlots.find(slot => slot.value === bookingData.timeSlot)?.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setBookingStep('booking')}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleFinalSubmit}
                        disabled={bookingLoading}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
                        <span>{bookingLoading ? 'Sending...' : 'Submit Request'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Favorites;