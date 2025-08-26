import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, Bed } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SearchBar: React.FC = () => {
  const { t } = useLanguage();
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    priceRange: '',
    bedrooms: '',
  });

  const propertyTypes = [
    { value: 'apartment', label: t('apartment') },
    { value: 'house', label: t('house') },
    { value: 'villa', label: t('villa') },
    { value: 'commercial', label: t('commercial') },
  ];

  const priceRanges = [
    { value: '0-100000', label: '$0 - $100,000' },
    { value: '100000-300000', label: '$100,000 - $300,000' },
    { value: '300000-500000', label: '$300,000 - $500,000' },
    { value: '500000-1000000', label: '$500,000 - $1,000,000' },
    { value: '1000000+', label: '$1,000,000+' },
  ];

  const bedroomOptions = [
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search data:', searchData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto -mt-16 relative z-10">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchLocation')}
            value={searchData.location}
            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>

        {/* Property Type */}
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={searchData.propertyType}
            onChange={(e) => setSearchData({ ...searchData, propertyType: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
          >
            <option value="">{t('propertyType')}</option>
            {propertyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={searchData.priceRange}
            onChange={(e) => setSearchData({ ...searchData, priceRange: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
          >
            <option value="">{t('priceRange')}</option>
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={searchData.bedrooms}
            onChange={(e) => setSearchData({ ...searchData, bedrooms: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
          >
            <option value="">{t('bedrooms')}</option>
            {bedroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} {t('bedrooms_count')}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
        >
          <Search className="h-5 w-5" />
          <span className="hidden sm:block">{t('searchButton')}</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;