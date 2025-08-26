import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PropertyCard from '../components/PropertyCard';
import { supabase } from '../lib/supabase';

const Buy: React.FC = () => {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('category', 'rent'); // <-- фильтр по категории

      if (error) {
        console.error('Ошибка при загрузке объектов:', error);
      } else {
        setProperties(data);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('buyProperties')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buy;
