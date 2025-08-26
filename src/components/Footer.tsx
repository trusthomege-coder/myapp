import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Trust</span>
                <span className="text-sm font-medium text-orange-400 -mt-1">Home</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('catalog')}
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('rent')}
                </Link>
              </li>
              <li>
                <Link to="/buy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('buy')}
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('projects')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {t('aboutUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-orange-400" />
                <div className="text-sm text-gray-400">
                  <div>Currently serving: Batumi</div>
                  <div>Coming soon: Tbilisi</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-400">+995 598 901 366</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-orange-400" />
                <span className="text-sm text-gray-400">trusthome.ge@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Trust Home. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;