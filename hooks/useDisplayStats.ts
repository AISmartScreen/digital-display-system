// hooks/useDisplayStats.ts
import { useState, useEffect, useCallback } from 'react';

interface Display {
  id: string;
  status: string;
  user_id: string;
  name: string;
  location: string;
  created_at: string;
}

interface MediaItem {
  id: string;
  fileName: string;
  fileSize: number;
  userId: string;
}

interface Stats {
  totalDisplays: number;
  activeDisplays: number;
  inactiveDisplays: number;
  mediaFiles: number;
  storageUsed: number;
}

interface UseDisplayStatsReturn {
  stats: Stats;
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
  refetch: () => Promise<void>;
}

const DISPLAY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISABLED: 'disabled'
} as const;

export function useDisplayStats(): UseDisplayStatsReturn {
  const [stats, setStats] = useState<Stats>({
    totalDisplays: 0,
    activeDisplays: 0,
    inactiveDisplays: 0,
    mediaFiles: 0,
    storageUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateDisplayStats = (displays: Display[]) => {
    return {
      totalDisplays: displays.length,
      activeDisplays: displays.filter(
        (d) => d.status === DISPLAY_STATUS.ACTIVE
      ).length,
      inactiveDisplays: displays.filter(
        (d) => d.status === DISPLAY_STATUS.INACTIVE || d.status === DISPLAY_STATUS.DISABLED
      ).length,
    };
  };

  const calculateMediaStats = (mediaItems: MediaItem[]) => {
    return {
      mediaFiles: mediaItems.length,
      storageUsed: mediaItems.reduce((sum, item) => sum + (item.fileSize || 0), 0),
    };
  };

  const fetchAllStats = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch user info first
      const userRes = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!userRes.ok) {
        throw new Error('Please log in to view your statistics');
      }

      const userData = await userRes.json();
      const userId = userData.user.id;

      // Fetch displays
      const displaysRes = await fetch('/api/displays', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!displaysRes.ok) {
        if (displaysRes.status === 401) {
          throw new Error('Please log in to view your displays');
        }
        const data = await displaysRes.json();
        throw new Error(data.error || `Server error: ${displaysRes.status}`);
      }

      const displaysData = await displaysRes.json();

      // Handle display response
      let displays: Display[] = [];
      if (Array.isArray(displaysData)) {
        displays = displaysData;
      } else if (displaysData.success && Array.isArray(displaysData.displays)) {
        displays = displaysData.displays;
      } else if (displaysData.data && Array.isArray(displaysData.data)) {
        displays = displaysData.data;
      }

      // Fetch media
      const mediaRes = await fetch(`/api/media?userId=${userId}`, {
        credentials: 'include',
        cache: 'no-store',
      });

      let mediaItems: MediaItem[] = [];
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        mediaItems = Array.isArray(mediaData) ? mediaData : [];
      }

      // Calculate all stats
      const displayStats = calculateDisplayStats(displays);
      const mediaStats = calculateMediaStats(mediaItems);

      setStats({
        ...displayStats,
        ...mediaStats,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics';
      setError(errorMessage);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  const refetch = useCallback(async () => {
    await fetchAllStats(true);
  }, [fetchAllStats]);

  return {
    stats,
    loading,
    error,
    isRefreshing,
    refetch,
  };
}