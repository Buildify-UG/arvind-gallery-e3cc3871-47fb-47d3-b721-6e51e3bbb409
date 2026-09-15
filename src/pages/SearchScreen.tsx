import React, { useState, useMemo } from 'react';
import { MediaItem } from '../types/gallery';
import { Search, X } from 'lucide-react';

interface SearchScreenProps {
  allMedia: MediaItem[];
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ allMedia }) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'photos' | 'videos'>('all');

  const results = useMemo(() => {
    let filtered = allMedia;

    // Filter by type
    if (filterType === 'photos') {
      filtered = filtered.filter(m => m.type === 'photo');
    } else if (filterType === 'videos') {
      filtered = filtered.filter(m => m.type === 'video');
    }

    // Filter by query
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(m =>
        m.filename.toLowerCase().includes(q) ||
        new Date(m.createdAt).toLocaleDateString().includes(q)
      );
    }

    return filtered;
  }, [allMedia, query, filterType]);

  return (
    <div className="h-full flex flex-col bg-background pb-20">
      {/* Search Bar */}
      <div className="bg-card border-b border-border p-4 sticky top-0 z-20">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search photos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['all', 'photos', 'videos'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium smooth ${
                filterType === type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Search className="w-16 h-16 text-muted-foreground opacity-20 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {query ? 'No results found' : 'Start searching'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {query
                ? `Try different keywords`
                : 'Search by filename or date'}
            </p>
          </div>
        ) : (
          <div className="px-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Found {results.length} {results.length === 1 ? 'item' : 'items'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {results.map(item => (
                <div
                  key={item.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
                >
                  <img
                    src={item.uri}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 smooth"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 smooth" />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-white text-2xl">▶</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
