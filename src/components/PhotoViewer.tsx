import React, { useState, useRef, useEffect } from 'react';
import { MediaItem, ImageFilters } from '../types/gallery';
import { X, Heart, Share2, Trash2, RotateCw, Maximize2, Minimize2, Sun, Contrast2 } from 'lucide-react';

interface PhotoViewerProps {
  item: MediaItem;
  onClose: () => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MediaItem>) => void;
  allMedia: MediaItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  item,
  onClose,
  onFavorite,
  onDelete,
  onUpdate,
  allMedia,
  currentIndex,
  onNavigate,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(item.rotation || 0);
  const [filters, setFilters] = useState<ImageFilters>(
    item.filters || { brightness: 100, contrast: 100, saturation: 100, blur: 0 }
  );
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  let controlsTimer: NodeJS.Timeout;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(Math.max(0, currentIndex - 1));
      if (e.key === 'ArrowRight') onNavigate(Math.min(allMedia.length - 1, currentIndex + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allMedia.length, onNavigate, onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(1, Math.min(5, prev + delta)));
  };

  const handleDoubleClick = () => {
    setZoom(zoom === 1 ? 2 : 1);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < allMedia.length - 1) {
      onNavigate(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    clearTimeout(controlsTimer);
    if (!showControls) {
      controlsTimer = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const filterStyle = {
    filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`,
    transform: `rotate(${rotation}deg) scale(${zoom})`,
  };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-black flex flex-col smooth ${fullscreen ? 'p-0' : 'p-4'}`}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onClick={toggleControls}
    >
      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <SwipeContainer onSwipe={handleSwipe}>
          <img
            ref={imgRef}
            src={item.uri}
            alt={item.filename}
            className="max-w-full max-h-full object-contain smooth"
            style={filterStyle}
            draggable={false}
          />
        </SwipeContainer>
      </div>

      {/* Top Bar */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 smooth"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <p className="text-white text-sm font-medium">{currentIndex + 1} / {allMedia.length}</p>
          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 smooth"
          >
            {fullscreen ? (
              <Minimize2 className="w-6 h-6 text-white" />
            ) : (
              <Maximize2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => onFavorite(item.id)}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 smooth"
            >
              <Heart className={`w-6 h-6 ${item.isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 smooth"
            >
              <RotateCw className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = item.uri;
                link.download = item.filename;
                link.click();
              }}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 smooth"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
              className="bg-white/20 hover:bg-white/30 rounded-full p-3 smooth"
            >
              <Trash2 className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Adjustment Sliders */}
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-white text-xs font-medium flex items-center gap-2">
                <Sun className="w-4 h-4" /> Brightness
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={filters.brightness}
                onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-white text-xs font-medium flex items-center gap-2">
                <Contrast2 className="w-4 h-4" /> Contrast
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={filters.contrast}
                onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SwipeContainerProps {
  children: React.ReactNode;
  onSwipe: (direction: 'left' | 'right') => void;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({ children, onSwipe }) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) onSwipe('left');
    if (isRightSwipe) onSwipe('right');
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {children}
    </div>
  );
};
