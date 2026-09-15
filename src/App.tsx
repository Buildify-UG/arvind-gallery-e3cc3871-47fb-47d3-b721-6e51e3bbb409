import React, { useState, useEffect } from 'react';
import { useMediaScanner } from './hooks/useMediaScanner';
import { MediaItem, Album } from './types/gallery';
import { HomeScreen } from './pages/HomeScreen';
import { AlbumsScreen } from './pages/AlbumsScreen';
import { FavoritesScreen } from './pages/FavoritesScreen';
import { SearchScreen } from './pages/SearchScreen';
import { SettingsScreen } from './pages/SettingsScreen';
import { BottomNavigation } from './components/BottomNavigation';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [autoScan, setAutoScan] = useState(true);

  const { media: scannedMedia, loading, error, hasPermission, requestPermission } = useMediaScanner();

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('arvind-gallery-state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setTheme(state.theme || 'auto');
        setGridColumns(state.gridColumns || 3);
        setSortBy(state.sortBy || 'date');
        setAutoScan(state.autoScan !== false);
      } catch (e) {
        console.error('Failed to load state:', e);
      }
    }

    // Apply theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveTheme = theme === 'auto' ? (prefersDark ? 'dark' : 'light') : theme;
    if (effectiveTheme === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Update media from scanner
  useEffect(() => {
    if (scannedMedia.length > 0) {
      setMedia(scannedMedia);
    }
  }, [scannedMedia]);

  // Save state to localStorage
  useEffect(() => {
    const state = { theme, gridColumns, sortBy, autoScan };
    localStorage.setItem('arvind-gallery-state', JSON.stringify(state));
  }, [theme, gridColumns, sortBy, autoScan]);

  const handleSelectMedia = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(media.map(m => m.id)));
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleFavorite = (id: string) => {
    setMedia(media.map(m =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    ));
  };

  const handleDelete = (ids: string[]) => {
    setMedia(media.filter(m => !ids.includes(m.id)));
  };

  const handleUpdate = (id: string, updates: Partial<MediaItem>) => {
    setMedia(media.map(m =>
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const handleCreateAlbum = (name: string) => {
    const album: Album = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      isPrivate: false,
      mediaIds: [],
      count: 0,
    };
    setAlbums([...albums, album]);
  };

  const handleDeleteAlbum = (id: string) => {
    setAlbums(albums.filter(a => a.id !== id));
  };

  if (!hasPermission) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Arvind Gallery</h1>
          <p className="text-muted-foreground">
            Permission required to access your photos
          </p>
          <button
            onClick={requestPermission}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
          >
            Grant Permission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'home' && (
          <HomeScreen
            allMedia={media}
            albums={albums}
            selectedIds={selectedIds}
            onSelectMedia={handleSelectMedia}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onFavorite={handleFavorite}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            gridColumns={gridColumns}
            sortBy={sortBy}
          />
        )}

        {activeTab === 'albums' && (
          <AlbumsScreen
            albums={albums}
            allMedia={media}
            onCreateAlbum={handleCreateAlbum}
            onDeleteAlbum={handleDeleteAlbum}
            onSelectAlbum={() => {}}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesScreen
            allMedia={media}
            selectedIds={selectedIds}
            onSelectMedia={handleSelectMedia}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onFavorite={handleFavorite}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            gridColumns={gridColumns}
            sortBy={sortBy}
          />
        )}

        {activeTab === 'search' && (
          <SearchScreen allMedia={media} />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            theme={theme}
            onThemeChange={setTheme}
            gridColumns={gridColumns}
            onGridColumnsChange={setGridColumns}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            autoScan={autoScan}
            onAutoScanChange={setAutoScan}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
