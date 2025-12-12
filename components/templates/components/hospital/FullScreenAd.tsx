import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, Play } from "lucide-react";

interface FullScreenAdProps {
  title: string;
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  mediaType: "image" | "video";
  playCount?: number;
  animation?: string;
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  duration: number;
  showTimer?: boolean;
  showScheduleInfo?: boolean;
  scheduleInfo?: {
    timeRange: { start: string; end: string };
    frequency: number;
    daysOfWeek: number[];
  };
  onClose?: () => void;
  onDurationEnd?: () => void;
}

// Utility function to detect video source type
const detectVideoSource = (
  url: string
): "youtube" | "cloudinary" | "direct" => {
  if (!url) return "direct";

  // YouTube detection
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }

  // Cloudinary detection
  if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
    return "cloudinary";
  }

  return "direct";
};

// Extract YouTube video ID
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
};

// Optimize Cloudinary URL for video playback
const optimizeCloudinaryUrl = (url: string): string => {
  // If already optimized, return as is
  if (url.includes("/upload/") && url.includes("q_auto")) {
    return url;
  }

  // Add video optimization parameters
  const urlParts = url.split("/upload/");
  if (urlParts.length === 2) {
    return `${urlParts[0]}/upload/q_auto,f_auto/${urlParts[1]}`;
  }

  return url;
};

const getAnimationClass = (animation: string) => {
  const animations: { [key: string]: string } = {
    fade: "animate-fadeIn",
    "slide-left": "animate-slideInLeft",
    "slide-right": "animate-slideInRight",
    "slide-up": "animate-slideInUp",
    "slide-down": "animate-slideInDown",
    zoom: "animate-zoomIn",
    "zoom-out": "animate-zoomOut",
    flip: "animate-flip",
    bounce: "animate-bounceIn",
    rotate: "animate-rotateIn",
  };
  return animations[animation] || "animate-fadeIn";
};

export default function FullScreenAd({
  title,
  caption,
  imageUrl,
  videoUrl,
  mediaType = "image",
  playCount = 1,
  animation = "fade",
  accentColor,
  primaryColor,
  secondaryColor,
  duration,
  showTimer = false,
  showScheduleInfo = false,
  scheduleInfo,
  onClose,
  onDurationEnd,
}: FullScreenAdProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [currentPlayCount, setCurrentPlayCount] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoSource, setVideoSource] = useState<
    "youtube" | "cloudinary" | "direct"
  >("direct");
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const animationClass = getAnimationClass(animation);

  // Process video URL on mount or when it changes
  useEffect(() => {
    if (videoUrl) {
      const source = detectVideoSource(videoUrl);
      setVideoSource(source);

      if (source === "youtube") {
        const embedUrl = getYouTubeEmbedUrl(videoUrl);
        setProcessedVideoUrl(embedUrl || videoUrl);
      } else if (source === "cloudinary") {
        setProcessedVideoUrl(optimizeCloudinaryUrl(videoUrl));
      } else {
        setProcessedVideoUrl(videoUrl);
      }
    }
  }, [videoUrl]);

  // Image timer functionality
  useEffect(() => {
    if (mediaType === "image" && showTimer) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 100) {
            clearInterval(interval);
            if (onDurationEnd) onDurationEnd();
            return 0;
          }
          return prev - 100;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, showTimer, mediaType, onDurationEnd]);

  // Safe video play function
  const playVideo = useCallback(async () => {
    if (!videoRef.current || !isVideoReady) return;

    try {
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (e) {
          // Ignore previous promise errors
        }
      }

      playPromiseRef.current = videoRef.current.play();
      await playPromiseRef.current;
      setIsPlaying(true);
      setShowPlayButton(false);
    } catch (error: any) {
      console.error("Video play failed:", error);
      if (error.name === "NotAllowedError") {
        setShowPlayButton(true);
      } else {
        if (onDurationEnd) {
          onDurationEnd();
        }
      }
    } finally {
      playPromiseRef.current = null;
    }
  }, [isVideoReady, onDurationEnd]);

  const pauseVideo = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (playPromiseRef.current) {
        await playPromiseRef.current;
      }
      videoRef.current.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error("Video pause failed:", error);
    }
  }, []);

  // Direct video (MP4, Cloudinary) initialization
  useEffect(() => {
    if (
      mediaType !== "video" ||
      !processedVideoUrl ||
      videoSource === "youtube" ||
      !videoRef.current
    )
      return;

    const video = videoRef.current;
    let isMounted = true;

    setCurrentPlayCount(0);
    setIsVideoReady(false);
    setIsPlaying(false);
    setShowPlayButton(false);

    const handleCanPlay = () => {
      if (isMounted) {
        setIsVideoReady(true);
      }
    };

    const handleEnded = () => {
      if (!isMounted) return;

      setCurrentPlayCount((prev) => {
        const newCount = prev + 1;

        if (newCount >= playCount) {
          setIsPlaying(false);
          if (onDurationEnd) {
            onDurationEnd();
          }
        } else {
          if (video) {
            video.currentTime = 0;
            setTimeout(() => {
              if (isMounted) {
                playVideo();
              }
            }, 100);
          }
        }
        return newCount;
      });
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      const errorDetails = {
        error: videoElement.error,
        code: videoElement.error?.code,
        message: videoElement.error?.message,
        videoUrl: processedVideoUrl,
        videoSource: videoSource,
        networkState: videoElement.networkState,
        readyState: videoElement.readyState,
      };
      console.error("Video error details:", errorDetails);

      if (videoSource === "cloudinary") {
        console.warn(
          "Cloudinary video failed. Check: 1) URL is accessible, 2) Format is supported, 3) CORS is configured"
        );
      } else {
        console.warn(
          "Failed to load video. Check: 1) URL is valid, 2) File format is MP4, 3) CORS headers if external"
        );
      }

      if (isMounted && onDurationEnd) {
        onDurationEnd();
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    video.src = processedVideoUrl;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.loop = playCount > 1;

    const playTimeout = setTimeout(() => {
      if (isMounted && video.readyState >= 2) {
        playVideo();
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(playTimeout);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      pauseVideo();
      video.src = "";
      video.load();
    };
  }, [
    mediaType,
    processedVideoUrl,
    videoSource,
    playCount,
    onDurationEnd,
    playVideo,
    pauseVideo,
  ]);

  // YouTube iframe handling
  useEffect(() => {
    if (
      mediaType !== "video" ||
      videoSource !== "youtube" ||
      !processedVideoUrl
    )
      return;

    let isMounted = true;
    setIsPlaying(true);

    // Auto-end after duration for YouTube videos
    const timeout = setTimeout(() => {
      if (isMounted && onDurationEnd) {
        console.log("YouTube video duration ended");
        onDurationEnd();
      }
    }, duration);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [mediaType, videoSource, processedVideoUrl, duration, onDurationEnd]);

  // Fallback timer for direct videos
  useEffect(() => {
    if (
      mediaType === "video" &&
      videoSource !== "youtube" &&
      duration > 0 &&
      isPlaying
    ) {
      const timeout = setTimeout(() => {
        if (onDurationEnd) {
          console.log("Ad duration ended automatically");
          onDurationEnd();
        }
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [mediaType, videoSource, duration, isPlaying, onDurationEnd]);

  const handleManualPlay = async () => {
    await playVideo();
  };

  const progressPercentage =
    mediaType === "image" ? ((duration - timeRemaining) / duration) * 100 : 0;

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const daysOfWeekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes zoomOut {
          from {
            transform: scale(2);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes flip {
          from {
            transform: perspective(400px) rotateY(90deg);
            opacity: 0;
          }
          to {
            transform: perspective(400px) rotateY(0deg);
            opacity: 1;
          }
        }
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes rotateIn {
          from {
            transform: rotate(-200deg) scale(0);
            opacity: 0;
          }
          to {
            transform: rotate(0) scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out;
        }
        .animate-slideInDown {
          animation: slideInDown 0.8s ease-out;
        }
        .animate-zoomIn {
          animation: zoomIn 0.8s ease-out;
        }
        .animate-zoomOut {
          animation: zoomOut 0.8s ease-out;
        }
        .animate-flip {
          animation: flip 0.8s ease-out;
        }
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-out;
        }
        .animate-rotateIn {
          animation: rotateIn 0.8s ease-out;
        }
      `}</style>

      <div
        className={`relative w-full h-full bg-black/95 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl ${animationClass}`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all group"
            style={{ borderColor: accentColor, borderWidth: "2px" }}
            aria-label="Close ad"
          >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
          </button>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          {mediaType === "video" && processedVideoUrl ? (
            <>
              {videoSource === "youtube" ? (
                <iframe
                  ref={iframeRef}
                  src={processedVideoUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  style={{ border: "none" }}
                  title={`YouTube video: ${title}`}
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="auto"
                    aria-label={`Video ad: ${title}`}
                  >
                    <source src={processedVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {showPlayButton && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                      <button
                        onClick={handleManualPlay}
                        className="px-10 py-6 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-lg transition-all duration-300 hover:scale-105 flex flex-col items-center gap-4"
                        style={{ border: `2px solid ${accentColor}` }}
                        aria-label="Play video"
                      >
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white ml-2" />
                        </div>
                        <span className="text-white text-xl font-semibold">
                          Click to Play Video
                        </span>
                        <span className="text-white/70 text-sm">
                          Autoplay was blocked by your browser
                        </span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Failed to load image:", imageUrl);
                  e.currentTarget.style.display = "none";
                }}
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-5xl font-bold mb-4 drop-shadow-lg"
              style={{ color: accentColor }}
            >
              {title}
            </h2>
            <p className="text-2xl text-white/90 mb-6 drop-shadow-lg">
              {caption}
            </p>

            {mediaType === "image" && showTimer && (
              <div className="mb-4">
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-100 ease-linear rounded-full"
                    style={{
                      width: `${progressPercentage}%`,
                      background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})`,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white/70 text-sm">
                    Time remaining: {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            )}

            {mediaType === "video" && videoSource !== "youtube" && (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-white/70 text-sm">
                    {isPlaying ? "Now playing" : "Paused"}:{" "}
                    {Math.min(currentPlayCount + 1, playCount)} of {playCount}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: playCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx < currentPlayCount ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {showScheduleInfo && scheduleInfo && (
              <div className="flex flex-wrap gap-3 text-sm">
                <div
                  className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border"
                  style={{ borderColor: `${primaryColor}40` }}
                >
                  <span className="text-white/70">
                    🕐 {scheduleInfo.timeRange.start} -{" "}
                    {scheduleInfo.timeRange.end}
                  </span>
                </div>
                <div
                  className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border"
                  style={{ borderColor: `${primaryColor}40` }}
                >
                  <span className="text-white/70">
                    📅{" "}
                    {scheduleInfo.daysOfWeek
                      .map((day) => daysOfWeekLabels[day])
                      .join(", ")}
                  </span>
                </div>
                <div
                  className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border"
                  style={{ borderColor: `${primaryColor}40` }}
                >
                  <span className="text-white/70">
                    🔄 Every {scheduleInfo.frequency / 60} min
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className="absolute top-0 left-0 w-32 h-32 opacity-20"
          style={{
            background: `radial-gradient(circle at top left, ${accentColor}, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-32 h-32 opacity-20"
          style={{
            background: `radial-gradient(circle at bottom right, ${secondaryColor}, transparent)`,
          }}
        />
      </div>
    </>
  );
}
