import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, X, Globe, User } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const navigation = [
    { name: t('catalog'), href: '/catalog' },
    { name: t('aboutUs'), href: '/about' },
    { name: t('rent'), href: '/rent' },
    { name: t('buy'), href: '/buy' },
    { name: t('projects'), href: '/projects' },
    { name: t('contacts'), href: '/contacts' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'ge', label: 'ქართული', flag: '🇬🇪' },
    { code: 'he', label: 'עברית', flag: '🇮🇱' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Trust</span>
              <span className="text-sm font-medium text-orange-500 -mt-1">Home</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-600 hover:text-blue-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* User Account Button */}
            <button
              onClick={() => {
                const event = new CustomEvent('openAuthModal');
                window.dispatchEvent(event);
              }}
              className="p-2 text-gray-600 hover:text-blue-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
            >
              <User className="h-4 w-4" />
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-orange-50"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                  {language === 'en' && <span className="text-sm">🇺🇸</span>}
                  {language === 'ru' && <span className="text-sm">🇷🇺</span>}
                  {language === 'ge' && <span className="text-sm">🇬🇪</span>}
                  {language === 'he' && <span className="text-sm">🇮🇱</span>}
                  {language === 'ar' && <span className="text-sm">🇸🇦</span>}
                </div>
                <span className="font-medium">
                  {language.toUpperCase()}
                </span>
              </button>
              
              {isLanguageOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm transition-colors duration-200 rounded-md mx-1 ${
                        language === lang.code
                          ? 'text-orange-600 bg-orange-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                        <span className="text-sm">{lang.flag}</span>
                      </div>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;