export interface MediaItem {
  id: string;
  uri: string;
  filename: string;
  type: 'photo' | 'video';
  duration?: number;
  width: number;
  height: number;
  fileSize: number;
  createdAt: number;
  modifiedAt: number;
  isFavorite: boolean;
  isHidden: boolean;
  albumId?: string;
  rotation?: number;
  filters?: ImageFilters;
}

export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
}

export interface Album {
  id: string;
  name: string;
  coverUri?: string;
  count: number;
  createdAt: number;
  isPrivate: boolean;
  mediaIds: string[];
}

export interface GalleryState {
  allMedia: MediaItem[];
  albums: Album[];
  selectedMedia: Set<string>;
  currentTheme: 'light' | 'dark' | 'auto';
  gridColumns: 2 | 3 | 4;
  sortBy: 'date' | 'name' | 'size';
  autoScan: boolean;
  showHidden: boolean;
}
