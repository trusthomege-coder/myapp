import React, { useState, useEffect } from 'react';
import { Building, MapPin, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import PropertyModal from '../components/PropertyModal';
import { supabase } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';
import { handleContactAgentSubmission } from '../lib/notifications';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusColors = {
    planning: 'bg-yellow-100 text-yellow-800',
    'pre-construction': 'bg-blue-100 text-blue-800',
    'under-construction': 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('category', 'project');

        if (error) {
          throw error;
        }

        const processedData = (data || []).map(project => ({
          ...project,
          image_url: typeof project.image_url === 'string' && project.image_url.startsWith('[')
            ? JSON.parse(project.image_url)
            : project.image_url
        }));

        setProjects(processedData);
      } catch (err: any) {
        console.error('Ошибка при загрузке проектов:', err.message);
        setError('Не удалось загрузить проекты. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(project => project.status === filter);

  const handleViewProject = (project: any) => {
    const propertyData = {
      ...project,
      image_url: Array.isArray(project.image_url) ? project.image_url : [project.image_url],
    };
    setSelectedProject(propertyData);
    setIsModalOpen(true);
  };

  const handleContactAgent = (property: any) => {
    handleContactAgentSubmission(property);
    alert('Ваша заявка отправлена!');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('developmentProjects')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('investmentOpportunities')}
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { key: 'all', label: 'All Projects' },
                { key: 'planning', label: 'Planning' },
                { key: 'pre-construction', label: 'Pre-Construction' },
                { key: 'under-construction', label: 'Under Construction' },
                { key: 'completed', label: 'Completed' },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                    filter === filterOption.key
                      ? 'bg-blue-700 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Условный рендеринг */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">Загрузка проектов...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              К сожалению, проекты пока отсутствуют.
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <PropertyCard
                  key={project.id}
                  {...project}
                  image={project.image_url}
                  onContactAgent={() => handleContactAgent(project)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProject && (
        <PropertyModal
          property={selectedProject}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}
    </>
  );
};

export default Projects;
