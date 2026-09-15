import React, { useState } from 'react';
import { Album, MediaItem } from '../types/gallery';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface AlbumsScreenProps {
  albums: Album[];
  allMedia: MediaItem[];
  onCreateAlbum: (name: string) => void;
  onDeleteAlbum: (id: string) => void;
  onSelectAlbum: (id: string) => void;
}

export const AlbumsScreen: React.FC<AlbumsScreenProps> = ({
  albums,
  allMedia,
  onCreateAlbum,
  onDeleteAlbum,
  onSelectAlbum,
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');

  const handleCreate = () => {
    if (newAlbumName.trim()) {
      onCreateAlbum(newAlbumName);
      setNewAlbumName('');
      setShowCreateDialog(false);
    }
  };

  const defaultAlbums = [
    { name: 'Screenshots', icon: '📸', count: 0 },
    { name: 'Downloads', icon: '⬇️', count: 0 },
    { name: 'Camera', icon: '📷', count: 0 },
    { name: 'Recently Deleted', icon: '🗑️', count: 0 },
  ];

  return (
    <div className="h-full flex flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-2xl font-bold text-foreground">Albums</h1>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 smooth"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Default Albums */}
        <div className="px-4 py-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Collections
          </h2>
          <div className="space-y-2">
            {defaultAlbums.map((album, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-muted smooth"
              >
                <div className="text-2xl">{album.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{album.name}</p>
                  <p className="text-xs text-muted-foreground">{album.count} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Albums */}
        {albums.length > 0 && (
          <div className="px-4 py-4 border-t border-border">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              My Albums
            </h2>
            <div className="space-y-2">
              {albums.map(album => (
                <div
                  key={album.id}
                  className="bg-card border border-border rounded-lg p-3 flex items-center gap-3 group"
                >
                  <div
                    className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex-shrink-0 cursor-pointer"
                    onClick={() => onSelectAlbum(album.id)}
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => onSelectAlbum(album.id)}>
                    <p className="font-medium text-foreground">{album.name}</p>
                    <p className="text-xs text-muted-foreground">{album.mediaIds.length} items</p>
                  </div>
                  <button
                    onClick={() => onDeleteAlbum(album.id)}
                    className="opacity-0 group-hover:opacity-100 text-destructive p-2 hover:bg-destructive/10 rounded smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {albums.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center px-4">
            <div>
              <p className="text-muted-foreground">No albums yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create an album to organize your photos
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Album Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="bg-card w-full rounded-t-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">Create Album</h2>
            <input
              type="text"
              placeholder="Album name"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateDialog(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted smooth"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 smooth font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
