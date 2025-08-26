import React from 'react';
import { Shield, Award, Users, Target, CheckCircle, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import QuizPopup from '../components/QuizPopup';

const About: React.FC = () => {
  const { t } = useLanguage();
  const [showQuiz, setShowQuiz] = React.useState(false);

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
      experience: '15+ years',
    },
    {
      name: 'Michael Chen',
      position: 'Head of Sales',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      experience: '12+ years',
    },
    {
      name: 'Elena Rodriguez',
      position: 'Property Manager',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg',
      experience: '10+ years',
    },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in complete transparency in all our dealings, providing clear information and honest advice.',
      icon: Shield,
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from property selection to customer support.',
      icon: Award,
    },
    {
      title: 'Trust',
      description: 'Building long-term relationships based on trust, reliability, and consistent delivery of promises.',
      icon: CheckCircle,
    },
    {
      title: 'Innovation',
      description: 'Embracing technology and innovative solutions to make real estate transactions seamless.',
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('aboutUsTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('aboutUsContent')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('ourMission')}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {t('missionContent')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-gray-700 text-center">Provide transparent and honest real estate services</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-gray-700 text-center">Ensure secure and legally protected transactions</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <p className="text-gray-700 text-center">Deliver exceptional customer experience throughout</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('ourValues')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our core values guide every decision we make and every service we provide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive real estate services tailored to your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Property Selection',
                description: 'Personalized property recommendations based on your budget and preferences',
                image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
              },
              {
                title: 'Viewing Organization',
                description: 'Convenient scheduling with calendar booking and flexible time slots',
                image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
              },
              {
                title: 'Client Support',
                description: 'On-site accompaniment and online consultations in multiple languages',
                image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
              },
              {
                title: 'Favorites Management',
                description: 'Save properties and plan multiple viewings efficiently',
                image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
              },
              {
                title: 'Post-Sale Support',
                description: 'Continued assistance after your property transaction is complete',
                image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
              },
              {
                title: 'Investment Guidance',
                description: 'Expert advice on property investment opportunities and market trends',
                image: 'https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg',
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Trust Home?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We stand out through our commitment to excellence and client satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Individual Approach',
                description: 'Every client receives personalized attention and customized solutions',
                gradient: 'from-orange-400 to-orange-500',
              },
              {
                title: 'Transparent Information',
                description: 'Complete transparency in all dealings with verified property details',
                gradient: 'from-blue-400 to-blue-500',
              },
              {
                title: 'Multilingual Support',
                description: 'Professional service in English, Russian, Georgian, Hebrew, and Arabic',
                gradient: 'from-green-400 to-green-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <div className="w-8 h-8 bg-white rounded-lg opacity-80"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to find and visit your perfect property
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Browse & Select',
                description: 'Explore our verified property listings and add favorites',
              },
              {
                step: '2',
                title: 'Schedule Viewing',
                description: 'Book convenient viewing times with our calendar system',
              },
              {
                step: '3',
                title: 'Visit Properties',
                description: 'Attend guided viewings with professional support',
              },
              {
                step: '4',
                title: 'Make Decision',
                description: 'Get assistance with negotiations and paperwork',
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <div className="w-full h-0.5 bg-gray-200 relative">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-700 rounded-full"></div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Property
            </h2>
            <p className="text-lg text-gray-600">
              Take our quick quiz to get personalized property recommendations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Property Preference Quiz
              </h3>
              <p className="text-gray-600 mb-8">
                Answer a few questions to help us understand your needs and preferences. 
                We'll provide tailored recommendations based on your responses.
              </p>
              <button 
                onClick={() => setShowQuiz(true)}
                className="bg-blue-700 text-white py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                Start Quiz
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Removed Team Section - keeping only the CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Find Your Dream Property?
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Let our experienced team guide you through every step of your real estate journey. 
                From initial search to final paperwork, we're here to make it seamless.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-800 transition-colors duration-200">
                  Browse Properties
                </button>
                <button className="border-2 border-blue-700 text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                  Schedule Consultation
                </button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                alt="Real estate consultation"
                className="rounded-2xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA - keeping the original one but updating content */}
      <section className="py-16 bg-gradient-to-r from-orange-400 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Property Journey Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied clients who found their perfect properties with Trust Home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg">
                Get Started
              </button>
              <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-orange-600 transition-colors duration-200">
                {t('contacts')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quiz Popup */}
      <QuizPopup isOpen={showQuiz} onClose={() => setShowQuiz(false)} />
    </div>
  );
};

export default About;