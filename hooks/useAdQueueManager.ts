// hooks/useAdQueueManager.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export interface Advertisement {
  id: string;
  title: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration: number; // milliseconds for images
  playCount: number; // for videos
  animation: string;
  schedule: {
    timeRange: { start: string; end: string };
    frequency: number; // seconds
    daysOfWeek: number[];
    startDate: string;
    endDate: string;
  };
  priority?: number; // Lower number = higher priority
}

interface AdQueueState {
  queue: Advertisement[];
  currentAd: Advertisement | null;
  isPlaying: boolean;
  currentIndex: number;
}

interface UseAdQueueManagerProps {
  advertisements: Advertisement[];
  onReturnToNormalDisplay: () => void;
}

export function useAdQueueManager({ 
  advertisements, 
  onReturnToNormalDisplay 
}: UseAdQueueManagerProps) {
  const [queueState, setQueueState] = useState<AdQueueState>({
    queue: [],
    currentAd: null,
    isPlaying: false,
    currentIndex: 0,
  });

  const lastCheckTimeRef = useRef<number>(0);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scheduledAdsRef = useRef<Set<string>>(new Set());
  
  // Store callback in ref to avoid stale closures
  const onReturnToNormalRef = useRef(onReturnToNormalDisplay);
  useEffect(() => {
    onReturnToNormalRef.current = onReturnToNormalDisplay;
  }, [onReturnToNormalDisplay]);

  // Check if ad should play now based on schedule
  const isAdScheduledNow = useCallback((ad: Advertisement, now: Date): boolean => {
    const { schedule } = ad;
    
    // Check date range
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);
    if (now < startDate || now > endDate) {
      return false;
    }

    // Check day of week
    const currentDay = now.getDay();
    if (!schedule.daysOfWeek.includes(currentDay)) {
      return false;
    }

    // Check time range
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = schedule.timeRange.start.split(':').map(Number);
    const [endHour, endMin] = schedule.timeRange.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (currentTime < startMinutes || currentTime > endMinutes) {
      return false;
    }

    // Check frequency (has enough time passed since last check)
    const secondsSinceLastCheck = (now.getTime() - lastCheckTimeRef.current) / 1000;
    if (secondsSinceLastCheck < schedule.frequency) {
      // Check if this ad was already scheduled in this frequency window
      if (scheduledAdsRef.current.has(ad.id)) {
        return false;
      }
    } else {
      // New frequency window - clear scheduled ads
      scheduledAdsRef.current.clear();
    }

    return true;
  }, []);

  // Find all ads that should play now
  const findScheduledAds = useCallback((now: Date): Advertisement[] => {
    const matchingAds = advertisements.filter(ad => 
      isAdScheduledNow(ad, now)
    );

    // Sort by priority (lower number = higher priority)
    return matchingAds.sort((a, b) => 
      (a.priority || 999) - (b.priority || 999)
    );
  }, [advertisements, isAdScheduledNow]);

  // Start playing the next ad in queue
  const playNext = useCallback(() => {
    setQueueState(prev => {
      // No more ads in queue
      if (prev.currentIndex >= prev.queue.length) {
        console.log('✅ Ad queue completed, returning to normal display');
        // Return to normal display after short delay
        setTimeout(() => {
          onReturnToNormalRef.current();
        }, 500);
        
        return {
          queue: [],
          currentAd: null,
          isPlaying: false,
          currentIndex: 0,
        };
      }

      const nextAd = prev.queue[prev.currentIndex];
      console.log(`▶️ Playing ad ${prev.currentIndex + 1}/${prev.queue.length}:`, {
        title: nextAd.title,
        type: nextAd.mediaType,
        duration: nextAd.mediaType === 'image' ? `${nextAd.duration}ms` : `${nextAd.playCount} plays`
      });

      return {
        ...prev,
        currentAd: nextAd,
        isPlaying: true,
      };
    });
  }, []);

  // Handle ad completion
  const handleAdComplete = useCallback(() => {
    console.log('✓ Ad completed');
    
    setQueueState(prev => ({
      ...prev,
      currentAd: null,
      isPlaying: false,
      currentIndex: prev.currentIndex + 1,
    }));

    // Small delay before next ad
    setTimeout(() => {
      playNext();
    }, 300);
  }, [playNext]);

  // Check schedule periodically
  const checkSchedule = useCallback(() => {
    // Don't check if currently playing
    if (queueState.isPlaying) {
      return;
    }

    const now = new Date();
    const matchingAds = findScheduledAds(now);

    if (matchingAds.length > 0) {
      console.log(`🎬 Found ${matchingAds.length} scheduled ad(s):`, 
        matchingAds.map(ad => ({ title: ad.title, priority: ad.priority }))
      );

      // Mark these ads as scheduled for this frequency window
      matchingAds.forEach(ad => scheduledAdsRef.current.add(ad.id));

      // Start the queue
      setQueueState({
        queue: matchingAds,
        currentAd: null,
        isPlaying: false,
        currentIndex: 0,
      });

      // Update last check time
      lastCheckTimeRef.current = now.getTime();

      // Start playing first ad
      setTimeout(() => {
        playNext();
      }, 100);
    }
  }, [queueState.isPlaying, findScheduledAds, playNext]);

  // Set up periodic schedule checking
  useEffect(() => {
    console.log('🔄 Starting ad schedule checker');
    
    // Initial check
    checkSchedule();

    // Check every 10 seconds
    checkIntervalRef.current = setInterval(() => {
      checkSchedule();
    }, 10000);

    return () => {
      console.log('🛑 Stopping ad schedule checker');
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [checkSchedule]);

  // Auto-play next ad when currentIndex changes
  useEffect(() => {
    if (queueState.currentIndex > 0 && !queueState.isPlaying && queueState.currentIndex < queueState.queue.length) {
      playNext();
    }
  }, [queueState.currentIndex, queueState.isPlaying, queueState.queue.length, playNext]);

  return {
    currentAd: queueState.currentAd,
    isPlaying: queueState.isPlaying,
    queueLength: queueState.queue.length,
    currentPosition: queueState.currentIndex + 1,
    onAdComplete: handleAdComplete,
  };
}