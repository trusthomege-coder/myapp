import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Проверенный путь к клиенту
import { Calendar, Clock, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import PriceRangeSlider from '../components/PriceRangeSlider';

const Rent: React.FC = () => {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState('price-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [rentalProperties, setRentalProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. ЗАГРУЗКА ДАННЫХ ИЗ SUPABASE ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
  useEffect(() => {
    const fetchRentalProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('properties') // Имя вашей таблицы
          .select('*')
          .eq('category', 'rent'); // Фильтрация по категории

        if (error) {
          throw error;
        }

        setRentalProperties(data || []);
      } catch (err: any) {
        console.error('Ошибка при загрузке данных об аренде:', err.message);
        setError('Не удалось загрузить объекты. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalProperties();
  }, []);

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'area-desc', label: 'Area: Largest First' },
    { value: 'bedrooms-desc', label: 'Most Bedrooms' },
  ];

  const sortProperties = (properties: typeof rentalProperties, sortBy: string) => {
    return [...properties].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'area-desc':
          return b.area - a.area;
        case 'bedrooms-desc':
          return b.bedrooms - a.bedrooms;
        default:
          return 0;
      }
    });
  };

  const getFilteredAndSortedProperties = () => {
    let filtered = rentalProperties;

    // Filter by price range
    filtered = filtered.filter(prop => prop.price >= priceRange[0] && prop.price <= priceRange[1]);

    return sortProperties(filtered, sortBy);
  };

  const sortedProperties = getFilteredAndSortedProperties();

  const handleContactAgent = () => {
    window.location.href = '/contacts';
  };

  return (
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
            <Calendar className="h-8 w-8 text-blue-700" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('propertiesFor')} {t('forRent')}
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Find your perfect rental property from our curated selection
          </p>
        </motion.div>

        {/* Rental Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start space-x-3">
            <Clock className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Quick Rental Process</h3>
              <p className="text-blue-700 text-sm">
                All rental properties come with transparent lease terms, verified landlords,
                and our rental guarantee program. Move-in ready properties available for immediate occupancy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Rentals</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Range Slider */}
            <div>
              <PriceRangeSlider
                min={0}
                max={5000}
                value={priceRange}
                onChange={setPriceRange}
                step={100}
                formatValue={(val) => `$${val.toLocaleString()}/mo`}
                collapsed={true}
              />
            </div>

            {/* Sort and Results */}
            <div className="flex flex-col justify-end">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-semibold">{sortedProperties.length}</span> rental properties available
                <div className="text-xs text-gray-500 mt-1">
                  Budget: ${priceRange[0].toLocaleString()}/mo - ${priceRange[1].toLocaleString()}/mo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Условный рендеринг */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Загрузка объектов...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : sortedProperties.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            К сожалению, объекты в аренду пока отсутствуют.
          </div>
        ) : (
          /* Properties Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <PropertyCard
                  {...property}
                  isForRent={true}
                  onContactAgent={handleContactAgent}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Rental Services Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-700 to-blue-800 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Need Help Finding the Perfect Rental?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our rental specialists can help you find properties that match your exact requirements,
            budget, and timeline. Free consultation and personalized recommendations.
          </p>
          <button className="bg-white text-blue-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            Contact Rental Specialist
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Rent;
