import { useState, useEffect, useCallback } from 'react';
import { MediaItem, Album, GalleryState } from '../types/gallery';

const STORAGE_KEY = 'arvind_gallery_state';

export const useGalleryStore = () => {
  const [state, setState] = useState<GalleryState>({
    allMedia: [],
    albums: [],
    selectedMedia: new Set(),
    currentTheme: 'auto',
    gridColumns: 3,
    sortBy: 'date',
    autoScan: true,
    showHidden: false,
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          ...parsed,
          selectedMedia: new Set(),
        }));
      } catch (e) {
        console.error('Failed to load gallery state:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    const toSave = {
      allMedia: state.allMedia,
      albums: state.albums,
      currentTheme: state.currentTheme,
      gridColumns: state.gridColumns,
      sortBy: state.sortBy,
      autoScan: state.autoScan,
      showHidden: state.showHidden,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  const addMedia = useCallback((media: MediaItem[]) => {
    setState(prev => {
      const existing = new Set(prev.allMedia.map(m => m.id));
      const newMedia = media.filter(m => !existing.has(m.id));
      return {
        ...prev,
        allMedia: [...prev.allMedia, ...newMedia],
      };
    });
  }, []);

  const updateMedia = useCallback((id: string, updates: Partial<MediaItem>) => {
    setState(prev => ({
      ...prev,
      allMedia: prev.allMedia.map(m => m.id === id ? { ...m, ...updates } : m),
    }));
  }, []);

  const deleteMedia = useCallback((ids: string[]) => {
    setState(prev => ({
      ...prev,
      allMedia: prev.allMedia.filter(m => !ids.includes(m.id)),
      selectedMedia: new Set([...prev.selectedMedia].filter(id => !ids.includes(id))),
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      allMedia: prev.allMedia.map(m => 
        m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
      ),
    }));
  }, []);

  const createAlbum = useCallback((name: string) => {
    const album: Album = {
      id: Date.now().toString(),
      name,
      count: 0,
      createdAt: Date.now(),
      isPrivate: false,
      mediaIds: [],
    };
    setState(prev => ({
      ...prev,
      albums: [...prev.albums, album],
    }));
    return album;
  }, []);

  const deleteAlbum = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      albums: prev.albums.filter(a => a.id !== id),
    }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    setState(prev => ({ ...prev, currentTheme: theme }));
  }, []);

  const setGridColumns = useCallback((cols: 2 | 3 | 4) => {
    setState(prev => ({ ...prev, gridColumns: cols }));
  }, []);

  const setSortBy = useCallback((sort: 'date' | 'name' | 'size') => {
    setState(prev => ({ ...prev, sortBy: sort }));
  }, []);

  const toggleSelectMedia = useCallback((id: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedMedia);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { ...prev, selectedMedia: newSelected };
    });
  }, []);

  const selectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedMedia: new Set(prev.allMedia.map(m => m.id)),
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedMedia: new Set(),
    }));
  }, []);

  return {
    state,
    addMedia,
    updateMedia,
    deleteMedia,
    toggleFavorite,
    createAlbum,
    deleteAlbum,
    setTheme,
    setGridColumns,
    setSortBy,
    toggleSelectMedia,
    selectAll,
    clearSelection,
  };
};
