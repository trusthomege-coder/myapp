import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Building2, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { handleContactFormSubmission } from '../lib/notifications';

const Contacts: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    setLoading(true);
    
    try {
      const result = await handleContactFormSubmission(formData);
      
      if (result.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert(result.error || 'Произошла ошибка при отправке');
      }
    } catch (error) {
      alert('Произошла ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Coverage Area',
      details: ['Currently serving Batumi', 'Tbilisi coming soon'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: ['+995 598 901 366'],
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['trusthome.ge@gmail.com'],
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: Clock,
      title: t('workingHours'),
      details: [t('mondayFriday'), t('saturday')],
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const serviceAreas = [
    {
      name: 'Batumi',
      status: 'Active',
      description: 'Full service coverage',
      image: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
      icon: Building2,
    },
    {
      name: 'Tbilisi',
      status: 'Coming Soon',
      description: 'Launching in 2024',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('getInTouch')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about buying, selling, or renting? Our team is here to help you every step of the way.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-16 h-16 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <info.icon className={`h-8 w-8 ${info.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {info.title}
              </h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600 text-sm mb-1">
                  {detail}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle className="h-6 w-6 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
            </div>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                ✅ Сообщение отправлено! Мы ответим вам в ближайшее время
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('yourName')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="buying">Buying Property</option>
                    <option value="selling">Selling Property</option>
                    <option value="renting">Renting Property</option>
                    <option value="investment">Investment Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
                <span>{loading ? 'Отправка...' : 'Send Message'}</span>
              </button>
            </form>
          </motion.div>

          {/* Map and Office Locations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Service Areas */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-br from-blue-50 to-orange-50 p-8 text-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Service Coverage</h3>
                  <p className="text-gray-600">We provide real estate services across Georgia</p>
                </div>
              </div>
            </div>

            {/* Service Areas List */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Service Areas</h3>
              {serviceAreas.map((area, index) => (
                <motion.div
                  key={area.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow duration-300 ${
                    area.status === 'Coming Soon' ? 'border-2 border-dashed border-orange-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={area.image}
                      alt={area.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {area.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          area.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {area.status}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <area.icon className="h-4 w-4 mr-2" />
                        <span className="text-sm">{area.description}</span>
                      </div>
                      {area.status === 'Active' && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <span className="text-sm">+995 598 901 366</span>
                        </div>
                      )}
                      {area.status === 'Coming Soon' && (
                        <div className="flex items-center text-orange-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">Stay tuned for updates</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl p-8 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need Immediate Assistance?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our dedicated customer service team is available to help you with any urgent property needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+995598901366"
              className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>Call Now</span>
            </a>
            <a
              href="mailto:trusthome.ge@gmail.com"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-700 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
            >
              <Mail className="h-5 w-5" />
              <span>Send Email</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contacts;