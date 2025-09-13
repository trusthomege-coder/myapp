import React, { useState, useEffect } from 'react';
import { Building, MapPin, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import PropertyModal from '../components/PropertyModal';
import { supabase } from '../lib/supabase';

const Projects: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageIndices, setImageIndices] = useState<{ [key: number]: number }>({});

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
        const initialImageIndices = processedData.reduce((acc, project) => {
          acc[project.id] = 0;
          return acc;
        }, {});
        setImageIndices(initialImageIndices);
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

  const handleContactAgent = () => {
    window.location.href = '/contacts';
  };

  const handlePrev = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    setImageIndices(prev => {
      const images = Array.isArray(projects.find(p => p.id === projectId)?.image_url)
        ? projects.find(p => p.id === projectId)?.image_url
        : [];
      const newIndex = (prev[projectId] - 1 + images.length) % images.length;
      return { ...prev, [projectId]: newIndex };
    });
  };

  const handleNext = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation();
    setImageIndices(prev => {
      const images = Array.isArray(projects.find(p => p.id === projectId)?.image_url)
        ? projects.find(p => p.id === projectId)?.image_url
        : [];
      const newIndex = (prev[projectId] + 1) % images.length;
      return { ...prev, [projectId]: newIndex };
    });
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
              {filteredProjects.map((project, index) => {
                const images = Array.isArray(project.image_url) ? project.image_url : [project.image_url];
                const hasMultipleImages = images.length > 1;
                const currentImageIndex = imageIndices[project.id] || 0;
                const currentImageUrl = images[currentImageIndex];

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={currentImageUrl ? `${currentImageUrl}?v=${new Date().getTime()}` : '/placeholder.jpg'}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={(e) => handlePrev(e, project.id)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={(e) => handleNext(e, project.id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {project.title}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-2">
                      <Building className="h-4 w-4 mr-2" />
                      <span className="text-sm">{project.type}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{project.location}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-2xl font-bold text-blue-700">
                          {t('from')} ${project.price.toLocaleString()}
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
                      onClick={() => handleViewProject(project)}
                    >
                      {t('viewProject')}
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
              );
            })}
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
