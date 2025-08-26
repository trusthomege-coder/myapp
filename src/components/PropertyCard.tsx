import React from 'react';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion } from 'framer-motion';
import ImageSlider from './ImageSlider';
import BookingModal from './BookingModal';

interface PropertyCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string | string[];
  isForRent?: boolean;
  onContactAgent?: () => void;
}

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

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  image,
  isForRent = false,
  onContactAgent,
}) => {
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);

  // Create property object for modal
  const property: Property = {
    id,
    title,
    description: 'Beautiful property with modern amenities and great location.',
    price,
    location,
    bedrooms,
    bathrooms,
    area,
    image_url: image,
    category: isForRent ? 'rent' : 'sale',
    type: 'apartment',
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleContactAgent = () => {
    setIsBookingModalOpen(true);
  };

  // Convert image to array format for slider
  const images = Array.isArray(image) ? image : [image];

  return (
    <>
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative overflow-hidden h-48 group">
        <ImageSlider
          images={images}
          alt={title}
          className="w-full h-full"
          showThumbnails={images.length > 1}
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110"
        >
          <Heart 
            className={`h-4 w-4 transition-colors duration-200 ${
              isFavorite(id) 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>
        <div className="absolute bottom-4 left-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {isForRent ? t('forRent') : t('forSale')}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h3>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-700">
              ${price.toLocaleString()}
              {isForRent && <span className="text-sm text-gray-600">{t('perMonth')}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{area} {t('sqft')}</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            onClick={() => setIsBookingModalOpen(true)}
            className="flex-1 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
          >
            {t('viewDetails')}
          </button>
          <button
            onClick={onContactAgent || handleContactAgent}
            className="flex-1 border border-blue-700 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
          >
            {t('contactAgent')}
          </button>
        </div>
      </div>
    </motion.div>

    <BookingModal
      property={property}
      isOpen={isBookingModalOpen}
      onClose={() => setIsBookingModalOpen(false)}
    />
    </>
  );
};

export default PropertyCard;