import React, { useState } from 'react';
import { MediaItem, Album } from '../types/gallery';
import { MediaGrid } from '../components/MediaGrid';
import { PhotoViewer } from '../components/PhotoViewer';
import { Plus, MoreVertical, Trash2, Share2, Copy } from 'lucide-react';

interface HomeScreenProps {
  allMedia: MediaItem[];
  albums: Album[];
  selectedIds: Set<string>;
  onSelectMedia: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onFavorite: (id: string) => void;
  onDelete: (ids: string[]) => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
  gridColumns: 2 | 3 | 4;
  sortBy: 'date' | 'name' | 'size';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  allMedia,
  albums,
  selectedIds,
  onSelectMedia,
  onSelectAll,
  onClearSelection,
  onFavorite,
  onDelete,
  onUpdate,
  gridColumns,
  sortBy,
}) => {
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const viewingIndex = allMedia.findIndex(m => m.id === viewingPhoto);
  const viewingItem = viewingIndex >= 0 ? allMedia[viewingIndex] : null;

  const recentMedia = [...allMedia].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  const favorites = allMedia.filter(m => m.isFavorite);

  const handleDeleteSelected = () => {
    if (selectedIds.size > 0) {
      onDelete(Array.from(selectedIds));
      onClearSelection();
      setShowMenu(false);
    }
  };

  const handleShareSelected = () => {
    if (selectedIds.size > 0) {
      const urls = Array.from(selectedIds)
        .map(id => allMedia.find(m => m.id === id)?.uri)
        .filter(Boolean);
      const text = `Check out these ${selectedIds.size} photos!`;
      if (navigator.share) {
        navigator.share({ text, title: 'Arvind Gallery' });
      } else {
        alert(`Share these ${selectedIds.size} photos`);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex justify-between items-center sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Arvind Gallery</h1>
          <p className="text-xs text-muted-foreground">{allMedia.length} items</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.size > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 smooth"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-30">
                  <button
                    onClick={handleShareSelected}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Share ({selectedIds.size})
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="w-full px-4 py-2 text-sm text-destructive hover:bg-muted flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
                  </button>
                  <button
                    onClick={onSelectAll}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Select All
                  </button>
                  <button
                    onClick={onClearSelection}
                    className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    Deselect All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {allMedia.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center pb-20">
          <div className="text-center">
            <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No photos yet</h2>
            <p className="text-muted-foreground text-sm">
              Your photos and videos will appear here
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-20">
          {/* Recent Section */}
          {recentMedia.length > 0 && (
            <div className="px-4 py-6">
              <h2 className="text-lg font-semibold text-foreground mb-3">Recent</h2>
              <div className="grid grid-cols-3 gap-2">
                {recentMedia.map(item => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    onClick={() => setViewingPhoto(item.id)}
                  >
                    <img
                      src={item.uri}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 smooth"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 smooth" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div className="px-4 py-6 border-t border-border">
              <h2 className="text-lg font-semibold text-foreground mb-3">Favorites</h2>
              <div className="grid grid-cols-3 gap-2">
                {favorites.slice(0, 6).map(item => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                    onClick={() => setViewingPhoto(item.id)}
                  >
                    <img
                      src={item.uri}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 smooth"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 smooth" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Media Grid */}
          <div className="px-4 py-6 border-t border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3">All Photos</h2>
            <MediaGrid
              media={allMedia}
              columns={gridColumns}
              selectedIds={selectedIds}
              onSelect={onSelectMedia}
              onLongPress={onSelectMedia}
              onTap={item => setViewingPhoto(item)}
              sortBy={sortBy}
            />
          </div>
        </div>
      )}

      {/* Photo Viewer */}
      {viewingItem && viewingIndex >= 0 && (
        <PhotoViewer
          item={viewingItem}
          onClose={() => setViewingPhoto(null)}
          onFavorite={onFavorite}
          onDelete={(id) => {
            onDelete([id]);
            setViewingPhoto(null);
          }}
          onUpdate={onUpdate}
          allMedia={allMedia}
          currentIndex={viewingIndex}
          onNavigate={(idx) => setViewingPhoto(allMedia[idx].id)}
        />
      )}
    </div>
  );
};

const Images = () => <div />;
