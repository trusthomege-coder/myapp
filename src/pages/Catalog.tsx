import React, { useEffect, useState } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import PriceRangeSlider from '../components/PriceRangeSlider';
import { handleContactAgentSubmission } from '../lib/notifications';

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

const Catalog: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [propertyType, setPropertyType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');


  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    let query = supabase
      .from('properties')
      .select('*');

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Ошибка при загрузке объектов:', error);
    } else {
      const processedData = (data || []).map(property => ({
        ...property,
        image_url: typeof property.image_url === 'string' && property.image_url.startsWith('[')
          ? JSON.parse(property.image_url)
          : property.image_url
      }));
      setProperties(processedData as Property[]);
    }
    setLoading(false);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesType = propertyType === 'all' || property.type === propertyType;
    return matchesSearch && matchesPrice && matchesType;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{t('allProperties')}</h1>
          <p className="text-lg text-gray-600">{t('exploreListings')}</p>
        </motion.div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('filters')}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-200 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-200 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Filter by Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('category')}
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="all">{t('allCategories')}</option>
                <option value="rent">{t('forRent')}</option>
                <option value="sale">{t('forSale')}</option>
                <option value="project">{t('projects')}</option>
              </select>
            </div>
            
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('search')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                />
              </div>
            </div>
            
            {/* Sort by */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sortBy')}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
              >
                <option value="newest">{t('newest')}</option>
                <option value="price-asc">{t('priceLowToHigh')}</option>
                <option value="price-desc">{t('priceHighToLow')}</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">{t('priceRange')}</h4>
            <PriceRangeSlider
              min={0}
              max={1000000}
              value={priceRange}
              onChange={setPriceRange}
              step={10000}
              collapsed={false}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Загрузка объектов...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {t('noPropertiesFound')}
            <button
              onClick={() => {
                setFilter('all');
                setPriceRange([0, 1000000]);
                setPropertyType('all');
                setSearchTerm('');
              }}
              className="bg-blue-700 text-white py-2 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProperties.map((property, index) => (
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
      </div>
    </div>
  );
};

export default Catalog;
