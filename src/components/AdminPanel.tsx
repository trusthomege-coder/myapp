import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Trash2, Save, X, Building, MessageSquare, Home, Calendar, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageUpload from './ImageUpload';

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
  status?: string;
  // НОВАЯ СТРОКА: добавляем поле для "топ-объявления"
  is_featured: boolean; 
}

interface QuizQuestion {
  id: string;
  question: string;
  question_en: string;
  options: string[];
  options_en: string[];
  order_index: number;
}

const AdminPanel: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'catalog' | 'rent' | 'sale' | 'projects' | 'quiz'>('catalog');
  const [properties, setProperties] = useState<Property[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [error, setError] = useState('');

  const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    image_url: [],
    category: 'sale',
    type: 'apartment',
    status: 'planning',
    // НОВАЯ СТРОКА: устанавливаем значение по умолчанию
    is_featured: false, 
  });

  const [newQuestion, setNewQuestion] = useState<Omit<QuizQuestion, 'id'>>({
    question: '',
    question_en: '',
    options: ['', ''],
    options_en: ['', ''],
    order_index: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchProperties();
      fetchQuizQuestions();
    }
  }, [isAdmin]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      const processedData = (data || []).map(property => ({
        ...property,
        image_url: typeof property.image_url === 'string' && property.image_url.startsWith('[')
          ? JSON.parse(property.image_url)
          : property.image_url
      }));
      
      setProperties(processedData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    }
  };

  const fetchQuizQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setQuizQuestions(data || []);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async () => {
    try {
      // Set category based on active tab
      const categoryMap = {
        'rent': 'rent',
        'sale': 'sale', 
        'projects': 'project',
        'catalog': 'sale'
      };
      
      const propertyData = {
        ...newProperty,
        category: categoryMap[activeTab as keyof typeof categoryMap] || 'sale',
        image_url: Array.isArray(newProperty.image_url) 
          ? JSON.stringify(newProperty.image_url)
          : newProperty.image_url
      };
      
      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) throw error;
      
      setNewProperty({
        title: '',
        description: '',
        price: 0,
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        area: 0,
        image_url: [],
        category: 'sale',
        type: 'apartment',
        status: 'planning',
        // НОВАЯ СТРОКА: сбрасываем состояние
        is_featured: false, 
      });
      setShowAddProperty(false);
      fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Ошибка при добавлении объекта: ' + (error as Error).message);
    }
  };

  const handleUpdateProperty = async () => {
    if (!editingProperty) return;

    try {
      const propertyData = {
        ...editingProperty,
        image_url: Array.isArray(editingProperty.image_url) 
          ? JSON.stringify(editingProperty.image_url)
          : editingProperty.image_url
      };
      
      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', editingProperty.id);

      if (error) throw error;
      
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот объект?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .insert([{
          ...newQuestion,
          order_index: quizQuestions.length
        }]);

      if (error) throw error;
      
      setNewQuestion({
        question: '',
        question_en: '',
        options: ['', ''],
        options_en: ['', ''],
        order_index: 0,
      });
      setShowAddQuestion(false);
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .update(editingQuestion)
        .eq('id', editingQuestion.id);

      if (error) throw error;
      
      setEditingQuestion(null);
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchQuizQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const addOption = (isEnglish = false) => {
    if (editingQuestion) {
      const key = isEnglish ? 'options_en' : 'options';
      setEditingQuestion({
        ...editingQuestion,
        [key]: [...editingQuestion[key], '']
      });
    } else {
      const key = isEnglish ? 'options_en' : 'options';
      setNewQuestion({
        ...newQuestion,
        [key]: [...newQuestion[key], '']
      });
    }
  };

  const removeOption = (index: number, isEnglish = false) => {
    if (editingQuestion) {
      const key = isEnglish ? 'options_en' : 'options';
      const newOptions = editingQuestion[key].filter((_, i) => i !== index);
      setEditingQuestion({
        ...editingQuestion,
        [key]: newOptions
      });
    } else {
      const key = isEnglish ? 'options_en' : 'options';
      const newOptions = newQuestion[key].filter((_, i) => i !== index);
      setNewQuestion({
        ...newQuestion,
        [key]: newOptions
      });
    }
  };

  const updateOption = (index: number, value: string, isEnglish = false) => {
    if (editingQuestion) {
      const key = isEnglish ? 'options_en' : 'options';
      const newOptions = [...editingQuestion[key]];
      newOptions[index] = value;
      setEditingQuestion({
        ...editingQuestion,
        [key]: newOptions
      });
    } else {
      const key = isEnglish ? 'options_en' : 'options';
      const newOptions = [...newQuestion[key]];
      newOptions[index] = value;
      setNewQuestion({
        ...newQuestion,
        [key]: newOptions
      });
    }
  };

  const getFilteredProperties = () => {
    if (activeTab === 'catalog') return properties;
    if (activeTab === 'rent') return properties.filter(p => p.category === 'rent');
    if (activeTab === 'sale') return properties.filter(p => p.category === 'sale');
    if (activeTab === 'projects') return properties.filter(p => p.category === 'project');
    return [];
  };

  const getTabCounts = () => {
    return {
      catalog: properties.length,
      rent: properties.filter(p => p.category === 'rent').length,
      sale: properties.filter(p => p.category === 'sale').length,
      projects: properties.filter(p => p.category === 'project').length,
      quiz: quizQuestions.length
    };
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
            <p className="text-gray-600">У вас нет прав для доступа к админ-панели.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </div>
    );
  }

  const counts = getTabCounts();
  const filteredProperties = getFilteredProperties();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Админ-панель
          </h1>
          <p className="text-lg text-gray-600">
            Управление объектами недвижимости и вопросами квиза
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'catalog'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building className="h-5 w-5 inline mr-2" />
                Каталог ({counts.catalog})
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'rent'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Home className="h-5 w-5 inline mr-2" />
                Аренда ({counts.rent})
              </button>
              <button
                onClick={() => setActiveTab('sale')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'sale'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ShoppingBag className="h-5 w-5 inline mr-2" />
                Продажа ({counts.sale})
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'projects'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-5 w-5 inline mr-2" />
                Проекты ({counts.projects})
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'quiz'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="h-5 w-5 inline mr-2" />
                Квиз ({counts.quiz})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab !== 'quiz' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeTab === 'catalog' && 'Управление каталогом'}
                    {activeTab === 'rent' && 'Управление арендой'}
                    {activeTab === 'sale' && 'Управление продажей'}
                    {activeTab === 'projects' && 'Управление проектами'}
                  </h2>
                  <div className="flex items-center space-x-4">
                    {/* Search by ID */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by ID..."
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-40"
                        onChange={(e) => {
                          const searchId = e.target.value;
                          if (searchId) {
                            const foundProperty = filteredProperties.find(p => p.id.toString() === searchId);
                            if (foundProperty) {
                              setEditingProperty(foundProperty);
                            }
                          }
                        }}
                      />
                    </div>
                    <button
                    onClick={() => setShowAddProperty(true)}
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Добавить объект</span>
                  </button>
                  </div>
                </div>

                {/* Add Property Form */}
                {showAddProperty && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Добавить новый объект</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                        <input
                          type="text"
                          placeholder="Современная квартира в центре"
                          value={newProperty.title}
                          onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Местоположение</label>
                        <input
                          type="text"
                          placeholder="Батуми, район Старый город"
                          value={newProperty.location}
                          onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цена (USD)</label>
                        <input
                          type="number"
                          placeholder="350000"
                          value={newProperty.price}
                          onChange={(e) => setNewProperty({ ...newProperty, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Тип недвижимости</label>
                        <select
                          value={newProperty.type}
                          onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                        >
                          <option value="apartment">Квартира</option>
                          <option value="house">Дом</option>
                          <option value="villa">Вилла</option>
                          <option value="commercial">Коммерческая</option>
                        </select>
                      </div>
                      {activeTab === 'projects' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Статус проекта</label>
                          <select
                            value={newProperty.status || 'planning'}
                            onChange={(e) => setNewProperty({ ...newProperty, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                          >
                            <option value="planning">Planning</option>
                            <option value="pre-construction">Pre-Construction</option>
                            <option value="under-construction">Under Construction</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      )}
                    </div>
                    {/* НОВЫЙ БЛОК: чекбокс для топ-объявления */}
                    <div className="mb-4">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={newProperty.is_featured}
                          onChange={(e) => setNewProperty({ ...newProperty, is_featured: e.target.checked })}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span>Топ-объявление</span>
                      </label>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                      <textarea
                        placeholder="Подробное описание объекта..."
                        value={newProperty.description}
                        onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Спальни</label>
                        <input
                          type="number"
                          min="0"
                          value={newProperty.bedrooms}
                          onChange={(e) => setNewProperty({ ...newProperty, bedrooms: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ванные</label>
                        <input
                          type="number"
                          min="0"
                          value={newProperty.bathrooms}
                          onChange={(e) => setNewProperty({ ...newProperty, bathrooms: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Площадь (кв.м)</label>
                        <input
                          type="number"
                          min="0"
                          value={newProperty.area}
                          onChange={(e) => setNewProperty({ ...newProperty, area: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <ImageUpload
                        images={Array.isArray(newProperty.image_url) ? newProperty.image_url : []}
                        onImagesChange={(images) => setNewProperty({ ...newProperty, image_url: images })}
                        maxImages={15}
                        maxSizeMB={5}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddProperty}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-1"
                      >
                        <Save className="h-4 w-4" />
                        <span>Сохранить</span>
                      </button>
                      <button
                        onClick={() => setShowAddProperty(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center space-x-1"
                      >
                        <X className="h-4 w-4" />
                        <span>Отмена</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Properties List */}
                <div className="space-y-4">
                  {filteredProperties.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Нет объектов в этой категории
                    </div>
                  ) : (
                    filteredProperties.map((property) => (
                      <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                        {editingProperty?.id === property.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingProperty.title}
                                onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Название"
                              />
                              <input
                                type="text"
                                value={editingProperty.location}
                                onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Местоположение"
                              />
                              <input
                                type="number"
                                value={editingProperty.price}
                                onChange={(e) => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Цена"
                              />
                              <select
                                value={editingProperty.type}
                                onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                              >
                                <option value="apartment">Квартира</option>
                                <option value="house">Дом</option>
                                <option value="villa">Вилла</option>
                                <option value="commercial">Коммерческая</option>
                              </select>
                              <input
                                type="number"
                                value={editingProperty.bedrooms}
                                onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Спальни"
                              />
                              <input
                                type="number"
                                value={editingProperty.bathrooms}
                                onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Ванные"
                              />
                              <input
                                type="number"
                                value={editingProperty.area}
                                onChange={(e) => setEditingProperty({ ...editingProperty, area: Number(e.target.value) })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Площадь"
                              />
                              <select
                                value={editingProperty.category}
                                onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value as 'rent' | 'sale' | 'project' })}
                                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                              >
                                <option value="sale">Продажа</option>
                                <option value="rent">Аренда</option>
                                <option value="project">Проект</option>
                              </select>
                            </div>
                            {editingProperty.category === 'project' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Статус проекта</label>
                                <select
                                  value={editingProperty.status || 'planning'}
                                  onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value })}
                                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                >
                                  <option value="planning">Planning</option>
                                  <option value="pre-construction">Pre-Construction</option>
                                  <option value="under-construction">Under Construction</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </div>
                            )}
                            {/* НОВЫЙ БЛОК: чекбокс для редактирования */}
                            <div className="mb-4">
                              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={editingProperty.is_featured}
                                  onChange={(e) => setEditingProperty({ ...editingProperty, is_featured: e.target.checked })}
                                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span>Топ-объявление</span>
                              </label>
                            </div>
                            <div>
                              <textarea
                                value={editingProperty.description}
                                onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                placeholder="Описание"
                              />
                            </div>
                            <div>
                              <ImageUpload
                                images={Array.isArray(editingProperty.image_url) ? editingProperty.image_url : []}
                                onImagesChange={(images) => setEditingProperty({ ...editingProperty, image_url: images })}
                                maxImages={15}
                                maxSizeMB={5}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={handleUpdateProperty}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
                              >
                                <Save className="h-4 w-4" />
                                <span>Сохранить</span>
                              </button>
                              <button
                                onClick={() => setEditingProperty(null)}
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 flex items-center space-x-1"
                              >
                                <X className="h-4 w-4" />
                                <span>Отмена</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
