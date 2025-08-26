import React, { useState, useEffect } from 'react';
import { Building, MapPin, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import PropertyModal from '../components/PropertyModal';
import { supabase } from '../lib/supabase';

const Rent: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800',
    'pre-construction': 'bg-blue-100 text-blue-800',
    'under-construction': 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('category', 'rent');

      if (error) {
        console.error('Ошибка при загрузке объектов:', error);
      } else {
        setProperties(data || []);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = filter === 'all' 
    ? properties 
    : properties.filter(prop => prop.status === filter);

  const handleViewProperty = (property: any) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleContactAgent = () => {
    window.location.href = '/contacts';
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('rentProperties')}
            </h1>
          </motion.div>

          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            {['all', 'planning', 'pre-construction', 'under-construction', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                  filter === f ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 hover:bg-blue-50'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={prop.image_url}
                    alt={prop.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[prop.status]}`}>
                      {prop.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{prop.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{prop.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">{prop.description}</p>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-blue-700">
                        ${prop.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">ROI Potential</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      className="flex-1 bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 text-sm font-medium"
                      onClick={() => handleViewProperty(prop)}
                    >
                      {t('viewProperty')}
                    </button>
                    <button 
                      className="flex-1 border border-blue-700 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
                      onClick={handleContactAgent}
                    >
                      {t('learnMore')}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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

export default Rent;
