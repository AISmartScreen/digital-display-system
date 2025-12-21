import React, { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  HardDrive,
} from "lucide-react";
import { videoCacheManager, DownloadProgress } from "./videoCacheManager";

interface Video {
  id: string;
  url: string;
  name: string;
}

export default function VideoPrecacheManager() {
  const [videos, setVideos] = useState<Video[]>([
    { id: "1", url: "https://example.com/video1.mp4", name: "Ad Video 1" },
    { id: "2", url: "https://example.com/video2.mp4", name: "Ad Video 2" },
    { id: "3", url: "https://example.com/video3.mp4", name: "Ad Video 3" },
  ]);

  const [cachedVideos, setCachedVideos] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState<Map<string, DownloadProgress>>(
    new Map()
  );
  const [cacheSize, setCacheSize] = useState(0);

  const getVideoId = (url: string) => {
    return btoa(url)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 50);
  };

  // Check which videos are cached
  useEffect(() => {
    const checkCached = async () => {
      const cached = new Set<string>();
      for (const video of videos) {
        const videoId = getVideoId(video.url);
        if (await videoCacheManager.isCached(videoId)) {
          cached.add(video.id);
        }
      }
      setCachedVideos(cached);

      const size = await videoCacheManager.getCacheSize();
      setCacheSize(size);
    };
    checkCached();
  }, [videos]);

  const downloadVideo = async (video: Video) => {
    const videoId = getVideoId(video.url);

    try {
      await videoCacheManager.ensureCached(video.url, videoId, (progress) => {
        setDownloading((prev) => new Map(prev).set(video.id, progress));
      });

      setCachedVideos((prev) => new Set(prev).add(video.id));
      setDownloading((prev) => {
        const next = new Map(prev);
        next.delete(video.id);
        return next;
      });

      const size = await videoCacheManager.getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloading((prev) => {
        const next = new Map(prev);
        next.delete(video.id);
        return next;
      });
    }
  };

  const deleteVideo = async (video: Video) => {
    const videoId = getVideoId(video.url);
    await videoCacheManager.deleteVideo(videoId);
    setCachedVideos((prev) => {
      const next = new Set(prev);
      next.delete(video.id);
      return next;
    });

    const size = await videoCacheManager.getCacheSize();
    setCacheSize(size);
  };

  const downloadAll = async () => {
    for (const video of videos) {
      if (!cachedVideos.has(video.id) && !downloading.has(video.id)) {
        await downloadVideo(video);
      }
    }
  };

  const clearAll = async () => {
    await videoCacheManager.clearAll();
    setCachedVideos(new Set());
    setCacheSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Video Cache Manager</h1>
            <p className="text-white/80">
              Pre-download videos for zero-buffer playback
            </p>
          </div>
          <HardDrive className="w-16 h-16 opacity-50" />
        </div>

        <div className="mt-6 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div>
            <div className="text-sm text-white/70">Total Cache Size</div>
            <div className="text-2xl font-bold">{formatSize(cacheSize)}</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadAll}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Cache All
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {videos.map((video) => {
          const isCached = cachedVideos.has(video.id);
          const progress = downloading.get(video.id);
          const isDownloading = progress !== undefined;

          return (
            <div
              key={video.id}
              className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {video.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate max-w-md">
                    {video.url}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {isCached && !isDownloading && (
                    <>
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Cached</span>
                      </div>
                      <button
                        onClick={() => deleteVideo(video)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {!isCached && !isDownloading && (
                    <button
                      onClick={() => downloadVideo(video)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  )}

                  {isDownloading && progress && (
                    <div className="w-64">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Downloading...</span>
                        <span className="font-semibold text-blue-600">
                          {progress.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{formatSize(progress.loaded)}</span>
                        <span>{formatSize(progress.total)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Videos are downloaded completely to browser memory (IndexedDB)
              </li>
              <li>• Once cached, videos play instantly with zero buffering</li>
              <li>• Cache persists across browser sessions</li>
              <li>• Perfect for TV boxes with unreliable internet</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
