import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface FavoritesContextType {
  favorites: number[];
  loading: boolean;
  addToFavorites: (propertyId: number) => Promise<void>;
  removeFromFavorites: (propertyId: number) => Promise<void>;
  isFavorite: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const favoriteIds = (data || []).map(item => item.property_id);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (propertyId: number) => {
    if (!user) {
      // Trigger auth modal
      const event = new CustomEvent('openAuthModal');
      window.dispatchEvent(event);
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, property_id: propertyId }]);

      if (error) throw error;
      
      setFavorites(prev => [...prev, propertyId]);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (propertyId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;
      
      setFavorites(prev => prev.filter(id => id !== propertyId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const isFavorite = (propertyId: number) => {
    return favorites.includes(propertyId);
  };

  const toggleFavorite = async (propertyId: number) => {
    if (isFavorite(propertyId)) {
      await removeFromFavorites(propertyId);
    } else {
      await addToFavorites(propertyId);
    }
  };

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};