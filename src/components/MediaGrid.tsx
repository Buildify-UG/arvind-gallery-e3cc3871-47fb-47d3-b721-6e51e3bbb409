import React, { useMemo } from 'react';
import { MediaItem } from '../types/gallery';
import { Heart, Play } from 'lucide-react';

interface MediaGridProps {
  media: MediaItem[];
  columns: 2 | 3 | 4;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onLongPress: (id: string) => void;
  onTap: (id: string) => void;
  sortBy: 'date' | 'name' | 'size';
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  columns,
  selectedIds,
  onSelect,
  onLongPress,
  onTap,
  sortBy,
}) => {
  const sortedMedia = useMemo(() => {
    const sorted = [...media];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
      case 'name':
        return sorted.sort((a, b) => a.filename.localeCompare(b.filename));
      case 'size':
        return sorted.sort((a, b) => b.fileSize - a.fileSize);
      default:
        return sorted;
    }
  }, [media, sortBy]);

  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: MediaItem[] } = {};
    sortedMedia.forEach(item => {
      const date = new Date(item.createdAt);
      const key = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [sortedMedia]);

  const colWidth = `calc(100% / ${columns})`;

  return (
    <div className="flex-1 overflow-y-auto">
      {Object.entries(groupedByDate).map(([date, items]) => (
        <div key={date}>
          <div className="px-4 py-3 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <p className="text-sm font-semibold text-muted-foreground">{date}</p>
          </div>
          <div className="flex flex-wrap">
            {items.map(item => (
              <MediaThumbnail
                key={item.id}
                item={item}
                isSelected={selectedIds.has(item.id)}
                onSelect={() => onSelect(item.id)}
                onLongPress={() => onLongPress(item.id)}
                onTap={() => onTap(item.id)}
                width={colWidth}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface MediaThumbnailProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
  onLongPress: () => void;
  onTap: () => void;
  width: string;
}

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({
  item,
  isSelected,
  onSelect,
  onLongPress,
  onTap,
  width,
}) => {
  const [pressed, setPressedLocal] = React.useState(false);
  let pressTimer: NodeJS.Timeout;

  const handleMouseDown = () => {
    setPressedLocal(true);
    pressTimer = setTimeout(() => {
      onLongPress();
    }, 500);
  };

  const handleMouseUp = () => {
    setPressedLocal(false);
    clearTimeout(pressTimer);
    onTap();
  };

  return (
    <div
      style={{ width }}
      className="aspect-square relative overflow-hidden p-1"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setPressedLocal(false);
        clearTimeout(pressTimer);
      }}
    >
      <div
        className={`relative w-full h-full rounded-lg overflow-hidden smooth cursor-pointer ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
      >
        <img
          src={item.uri}
          alt={item.filename}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {item.type === 'video' && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 smooth" />

        {isSelected && (
          <div className="absolute inset-0 bg-primary/20" />
        )}

        <div className="absolute top-2 right-2 flex gap-1">
          {item.isFavorite && (
            <div className="bg-white/90 rounded-full p-1">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </div>
          )}
          {isSelected && (
            <div className="bg-primary rounded-full w-6 h-6 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          )}
        </div>

        {item.type === 'video' && item.duration && (
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(item.duration)}
          </div>
        )}
      </div>
    </div>
  );
};

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
