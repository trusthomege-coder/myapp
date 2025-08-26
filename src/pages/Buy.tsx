import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PropertyModal from '../components/PropertyModal';
import { supabase } from '../lib/supabase';

const Buy: React.FC = () => {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('category', 'buy')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setProperties(data);
      }
    };
    fetchProperties();
  }, []);

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Тут оставляем весь существующий JSX и верстку страницы */}
      {properties.map((property) => (
        <div key={property.id}>
          <h3>{property.title}</h3>
          <p>{property.description}</p>
          <button onClick={() => handleViewProperty(property)}>
            {t('viewProperty')}
          </button>
        </div>
      ))}

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </>
  );
};

export default Buy;
