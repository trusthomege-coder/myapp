import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MessageSquare, Globe, Car, Coffee, Baby, Heart, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import ImageSlider from './ImageSlider';
import ModernCalendar from './ModernCalendar';
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

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

interface BookingData {
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  comment: string;
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
}

const BookingModal: React.FC<BookingModalProps> = ({ property, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<'details' | 'booking' | 'contact'>('details');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    date: '',
    timeSlot: 'morning',
    comment: '',
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

  const handleBookingSubmit = () => {
    if (!bookingData.date) {
      alert('Please select a date');
      return;
    }
    setStep('contact');
  };

  const handleFinalSubmit = async () => {
    if (!bookingData.userName || !bookingData.userEmail || !bookingData.userPhone) {
      alert('Please fill in all contact fields');
      return;
    }

    setLoading(true);

    try {
      // Format message for Telegram
      const telegramMessage = `
🏠 <b>Новая заявка на просмотр недвижимости</b>

🆔 <b>ID объекта:</b> ${property.id}
🏡 <b>Объект:</b> ${property.title}
📍 <b>Местоположение:</b> ${property.location}
💰 <b>Цена:</b> $${property.price.toLocaleString()}${property.category === 'rent' ? '/месяц' : ''}
🏠 <b>Тип:</b> ${property.type} (${property.category === 'rent' ? 'Аренда' : property.category === 'sale' ? 'Продажа' : 'Проект'})
🛏️ <b>Характеристики:</b> ${property.bedrooms} спален, ${property.bathrooms} ванных, ${property.area} кв.м

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

⏰ <b>Время заявки:</b> ${new Date().toLocaleString('ru-RU')}
      `.trim();

      await sendTelegramNotification(telegramMessage);
      
      alert('Booking request submitted successfully!');
      onClose();
      setStep('details');
      setBookingData({
        date: '',
        timeSlot: 'morning',
        comment: '',
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
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const images = Array.isArray(property.image_url) ? property.image_url : [property.image_url];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
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
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 'details' && `Property Details - ID: ${property.id}`}
                {step === 'booking' && 'Schedule Viewing'}
                {step === 'contact' && 'Contact Information'}
              </h2>
              <p className="text-sm text-gray-600">{property.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {step === 'details' && (
            <div className="p-6">
              {/* Image Slider */}
              <div className="mb-6">
                <ImageSlider images={images} />
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-semibold text-blue-700">#{property.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold text-blue-700">
                        ${property.price.toLocaleString()}
                        {property.category === 'rent' && '/month'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{property.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{property.area} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{property.category}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep('booking')}
                  className="flex-1 bg-blue-700 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Viewing</span>
                </button>
              </div>
            </div>
          )}

          {step === 'booking' && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Select Date and Time</h3>
              
              <div className="flex flex-col items-center space-y-8">
                {/* Modern Calendar */}
                <div className="flex justify-center">
                  <ModernCalendar
                    selectedDate={bookingData.date}
                    onDateSelect={(date) => setBookingData({ ...bookingData, date })}
                    minDate={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Time Selection Cards */}
                <div className="w-full max-w-sm">
                  <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">Preferred Time</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, timeSlot: slot.value as any })}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                          bookingData.timeSlot === slot.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md'
                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
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

                {/* Number of Guests */}
                <div className="w-full max-w-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Number of People
                  </label>
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

                {/* Services */}
                <div className="w-full max-w-sm space-y-4">
                  <h4 className="font-medium text-gray-900 text-center">Additional Services</h4>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingData.accompaniment}
                      onChange={(e) => setBookingData({ ...bookingData, accompaniment: e.target.checked })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Transportation Service</span>
                      </div>
                      <p className="text-sm text-gray-600">We'll pick you up and take you to the viewing</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bookingData.amenities}
                      onChange={(e) => setBookingData({ ...bookingData, amenities: e.target.checked })}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Coffee className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">Refreshments</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Power bank, drinks, snacks</p>
                      {bookingData.amenities && (
                        <input
                          type="text"
                          value={bookingData.amenitiesDetails}
                          onChange={(e) => setBookingData({ ...bookingData, amenitiesDetails: e.target.value })}
                          placeholder="Specify preferences..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        />
                      )}
                    </div>
                  </label>

                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingData.withChildren}
                        onChange={(e) => setBookingData({ ...bookingData, withChildren: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Baby className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-900">With children</span>
                      </div>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingData.withPets}
                        onChange={(e) => setBookingData({ ...bookingData, withPets: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-900">With pets</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Comment Field */}
                <div className="w-full max-w-sm">
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
                    onClick={() => setStep('details')}
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
            </motion.div>
          )}

          {step === 'contact' && (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Contact Information</h3>
              
              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.userName}
                    onChange={(e) => setBookingData({ ...bookingData, userName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={bookingData.userEmail}
                    onChange={(e) => setBookingData({ ...bookingData, userEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.userPhone}
                    onChange={(e) => setBookingData({ ...bookingData, userPhone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="+995 XXX XXX XXX"
                  />
                </div>

                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property:</span>
                      <span className="font-medium">#{property.id} - {property.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{bookingData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{timeSlots.find(slot => slot.value === bookingData.timeSlot)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">{bookingData.guests} people</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep('booking')}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Sending...' : 'Submit Request'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;