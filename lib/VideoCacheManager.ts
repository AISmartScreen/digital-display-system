// videoCacheManager.ts
// This manages downloading and caching videos in IndexedDB for zero-buffer playback

const DB_NAME = 'VideoCache';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

export interface CachedVideo {
  id: string;
  blob: Blob;
  url: string;
  size: number;
  cachedAt: number;
}

export interface DownloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class VideoCacheManager {
  private db: IDBDatabase | null = null;

  // Initialize IndexedDB
  async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('cachedAt', 'cachedAt', { unique: false });
        }
      };
    });
  }

  // Download video with progress tracking
  async downloadVideo(
    url: string,
    id: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<Blob> {
    console.log(`📥 Downloading video: ${id}`);

    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const chunks: Uint8Array[] = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress && total > 0) {
        onProgress({
          loaded,
          total,
          percentage: Math.round((loaded / total) * 100),
        });
      }
    }

    console.log(`✓ Download complete: ${id} (${loaded} bytes)`);
    return new Blob(chunks, { type: 'video/mp4' });
  }

  // Save video to IndexedDB
  async saveVideo(id: string, blob: Blob, url: string): Promise<void> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      const video: CachedVideo = {
        id,
        blob,
        url,
        size: blob.size,
        cachedAt: Date.now(),
      };

      const request = store.put(video);

      request.onsuccess = () => {
        console.log(`💾 Saved to cache: ${id}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get cached video
  async getVideo(id: string): Promise<CachedVideo | null> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as CachedVideo | undefined;
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Check if video is cached
  async isCached(id: string): Promise<boolean> {
    const video = await this.getVideo(id);
    return video !== null;
  }

  // Get blob URL for cached video
  async getBlobUrl(id: string): Promise<string | null> {
    const video = await this.getVideo(id);
    if (!video) return null;

    return URL.createObjectURL(video.blob);
  }

  // Delete cached video
  async deleteVideo(id: string): Promise<void> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`🗑️ Deleted from cache: ${id}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // List all cached videos
  async listCached(): Promise<CachedVideo[]> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all cached videos
  async clearAll(): Promise<void> {
    const db = await this.initDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('🗑️ Cleared all cached videos');
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get total cache size
  async getCacheSize(): Promise<number> {
    const videos = await this.listCached();
    return videos.reduce((total, video) => total + video.size, 0);
  }

  // Download and cache video if not already cached
  async ensureCached(
    url: string,
    id: string,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<string> {
    // Check if already cached
    const cached = await this.getVideo(id);
    if (cached) {
      console.log(`✓ Video already cached: ${id}`);
      return URL.createObjectURL(cached.blob);
    }

    // Download and cache
    const blob = await this.downloadVideo(url, id, onProgress);
    await this.saveVideo(id, blob, url);

    return URL.createObjectURL(blob);
  }
}

// Export singleton instance
export const videoCacheManager = new VideoCacheManager();

// Helper hook for React components
export function useVideoCache() {
  return videoCacheManager;
}