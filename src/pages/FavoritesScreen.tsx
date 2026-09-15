import React, { useState } from 'react';
import { MediaItem } from '../types/gallery';
import { MediaGrid } from '../components/MediaGrid';
import { PhotoViewer } from '../components/PhotoViewer';
import { Heart } from 'lucide-react';

interface FavoritesScreenProps {
  allMedia: MediaItem[];
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

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  allMedia,
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

  const favorites = allMedia.filter(m => m.isFavorite);
  const viewingIndex = favorites.findIndex(m => m.id === viewingPhoto);
  const viewingItem = viewingIndex >= 0 ? favorites[viewingIndex] : null;

  return (
    <div className="h-full flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-6 h-6 fill-red-500 text-red-500" />
          Favorites
        </h1>
        <p className="text-xs text-muted-foreground mt-1">{favorites.length} items</p>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Heart className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
          <p className="text-muted-foreground text-sm">
            Mark photos as favorites to see them here
          </p>
        </div>
      ) : (
        <MediaGrid
          media={favorites}
          columns={gridColumns}
          selectedIds={selectedIds}
          onSelect={onSelectMedia}
          onLongPress={onSelectMedia}
          onTap={item => setViewingPhoto(item)}
          sortBy={sortBy}
        />
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
          allMedia={favorites}
          currentIndex={viewingIndex}
          onNavigate={(idx) => setViewingPhoto(favorites[idx].id)}
        />
      )}
    </div>
  );
};
