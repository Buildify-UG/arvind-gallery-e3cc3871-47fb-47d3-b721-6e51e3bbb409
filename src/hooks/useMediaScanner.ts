import { useEffect, useState } from 'react';
import { MediaItem } from '../types/gallery';

const DEMO_MEDIA: MediaItem[] = [
  {
    id: '1',
    uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop',
    filename: 'portrait_1.jpg',
    type: 'photo',
    width: 400,
    height: 300,
    fileSize: 120000,
    createdAt: Date.now() - 86400000 * 2,
    modifiedAt: Date.now() - 86400000 * 2,
    isFavorite: true,
    isHidden: false,
  },
  {
    id: '2',
    uri: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dae?w=400&h=300&fit=crop',
    filename: 'landscape_1.jpg',
    type: 'photo',
    width: 400,
    height: 300,
    fileSize: 145000,
    createdAt: Date.now() - 86400000,
    modifiedAt: Date.now() - 86400000,
    isFavorite: false,
    isHidden: false,
  },
  {
    id: '3',
    uri: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&h=300&fit=crop',
    filename: 'nature_1.jpg',
    type: 'photo',
    width: 400,
    height: 300,
    fileSize: 165000,
    createdAt: Date.now() - 3600000,
    modifiedAt: Date.now() - 3600000,
    isFavorite: true,
    isHidden: false,
  },
  {
    id: '4',
    uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop',
    filename: 'portrait_2.jpg',
    type: 'photo',
    width: 400,
    height: 600,
    fileSize: 155000,
    createdAt: Date.now() - 7200000,
    modifiedAt: Date.now() - 7200000,
    isFavorite: false,
    isHidden: false,
  },
  {
    id: '5',
    uri: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    filename: 'sunset.jpg',
    type: 'photo',
    width: 400,
    height: 300,
    fileSize: 175000,
    createdAt: Date.now() - 10800000,
    modifiedAt: Date.now() - 10800000,
    isFavorite: true,
    isHidden: false,
  },
  {
    id: '6',
    uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop',
    filename: 'music_festival.jpg',
    type: 'photo',
    width: 400,
    height: 300,
    fileSize: 190000,
    createdAt: Date.now() - 172800000,
    modifiedAt: Date.now() - 172800000,
    isFavorite: false,
    isHidden: false,
  },
  {
    id: '7',
    uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop',
    filename: 'portrait_3.jpg',
    type: 'photo',
    width: 300,
    height: 400,
    fileSize: 130000,
    createdAt: Date.now() - 259200000,
    modifiedAt: Date.now() - 259200000,
    isFavorite: false,
    isHidden: false,
  },
  {
    id: '8',
    uri: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=400&h=400&fit=crop',
    filename: 'nature_2.jpg',
    type: 'photo',
    width: 400,
    height: 400,
    fileSize: 160000,
    createdAt: Date.now() - 345600000,
    modifiedAt: Date.now() - 345600000,
    isFavorite: true,
    isHidden: false,
  },
];

export const useMediaScanner = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(true);

  const scanMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setMedia(DEMO_MEDIA);
      setHasPermission(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan media');
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    scanMedia();
  }, [scanMedia]);

  const requestPermission = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate permission request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasPermission(true);
      await scanMedia();
    } catch (err) {
      setError('Permission denied');
      setHasPermission(false);
    } finally {
      setLoading(false);
    }
  }, [scanMedia]);

  return {
    media,
    loading,
    error,
    hasPermission,
    scanMedia,
    requestPermission,
  };
};
