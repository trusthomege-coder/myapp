import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModernCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  minDate?: string;
  className?: string;
}

const ModernCalendar: React.FC<ModernCalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate = new Date().toISOString().split('T')[0],
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const selected = selectedDate ? new Date(selectedDate) : null;
  
  const monthNames = [
    'ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ',
    'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ'
  ];
  
  const weekDays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: true,
      });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selected && date.toDateString() === selected.toDateString();
      const isDisabled = dateString < minDate;
      
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isDisabled,
      });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false,
        isDisabled: true,
      });
    }
    
    return days;
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };
  
  const handleDateClick = (date: Date, isDisabled: boolean) => {
    if (isDisabled) return;
    const dateString = date.toISOString().split('T')[0];
    onDateSelect(dateString);
  };
  
  const days = getDaysInMonth(currentMonth);
  
  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`} style={{ maxWidth: '320px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900 tracking-wider">
            {monthNames[currentMonth.getMonth()]}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {currentMonth.getFullYear()}
          </p>
        </div>
        
        <button
          onClick={() => navigateMonth('next')}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      
      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {weekDays.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{day}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        <AnimatePresence mode="wait">
          {days.map((day, index) => (
            <motion.button
              key={`${day.date.getTime()}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, delay: index * 0.005 }}
              onClick={() => handleDateClick(day.date, day.isDisabled)}
              disabled={day.isDisabled}
              className={`
                h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 relative
                ${day.isCurrentMonth 
                  ? day.isSelected
                    ? 'bg-orange-500 text-white shadow-lg scale-110'
                    : day.isToday
                      ? 'bg-orange-100 text-orange-600 font-semibold'
                      : day.isDisabled
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:scale-105'
                  : 'text-gray-300 cursor-not-allowed'
                }
              `}
            >
              {day.date.getDate()}
              {day.isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 rounded-full bg-orange-500 -z-10"
                />
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernCalendar;