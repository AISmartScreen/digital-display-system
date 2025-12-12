import React, { useEffect, useState, useRef, useCallback } from "react";
import { X, Play, Loader2 } from "lucide-react";

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
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const animationClass = getAnimationClass(animation);

  // Store initial values in refs to prevent re-renders
  const durationRef = useRef(duration);
  const playCountRef = useRef(playCount);
  const videoUrlRef = useRef(videoUrl);
  const onDurationEndRef = useRef(onDurationEnd);

  // Update refs when props change
  useEffect(() => {
    durationRef.current = duration;
    playCountRef.current = playCount;
    videoUrlRef.current = videoUrl;
    onDurationEndRef.current = onDurationEnd;
  }, [duration, playCount, videoUrl, onDurationEnd]);

  // Image timer functionality - SIMPLIFIED
  useEffect(() => {
    if (mediaType === "image" && showTimer && duration > 0) {
      setTimeRemaining(duration);
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 100) {
            clearInterval(interval);
            onDurationEndRef.current?.();
            return 0;
          }
          return prev - 100;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [mediaType, showTimer]);

  // Video initialization - SIMPLIFIED VERSION
  useEffect(() => {
    if (mediaType !== "video" || !videoUrl || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    let isMounted = true;
    let cleanupTimeout: NodeJS.Timeout;

    console.log("Setting up video player");

    const handleCanPlay = () => {
      if (!isMounted) return;
      console.log("Video can play");
      setIsVideoReady(true);
      setIsVideoLoading(false);
    };

    const handlePlaying = () => {
      if (!isMounted) return;
      console.log("Video playing");
      setIsPlaying(true);
      setIsVideoLoading(false);
    };

    const handleWaiting = () => {
      if (!isMounted) return;
      console.log("Video waiting");
      setIsVideoLoading(true);
    };

    const handleEnded = () => {
      if (!isMounted) return;
      console.log("Video ended");

      setCurrentPlayCount((prev) => {
        const newCount = prev + 1;
        const totalPlays = playCountRef.current;

        if (newCount >= totalPlays) {
          setIsPlaying(false);
          onDurationEndRef.current?.();
        } else {
          // Restart video
          if (video) {
            video.currentTime = 0;
            video.play().catch((error) => {
              console.error("Error replaying video:", error);
            });
          }
        }
        return newCount;
      });
    };

    const handleError = (e: Event) => {
      if (!isMounted) return;
      const videoElement = e.target as HTMLVideoElement;
      console.error("Video error:", videoElement.error);
      setIsVideoLoading(false);
      setHasVideoError(true);
      setIsVideoReady(false);
    };

    // Reset states
    setIsVideoReady(false);
    setIsPlaying(false);
    setIsVideoLoading(true);
    setHasVideoError(false);
    setShowPlayButton(false);
    setCurrentPlayCount(0);

    // Setup video element
    video.src = videoUrl;
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.loop = playCount > 1;

    // Add event listeners
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);

    // Try to play after a delay
    cleanupTimeout = setTimeout(() => {
      if (isMounted && video.readyState >= 2) {
        video
          .play()
          .then(() => {
            if (isMounted) {
              setIsPlaying(true);
            }
          })
          .catch((error) => {
            console.log("Autoplay blocked, showing manual play button:", error);
            if (isMounted) {
              setShowPlayButton(true);
            }
          });
      }
    }, 500);

    // Cleanup function
    return () => {
      console.log("Cleaning up video player");
      isMounted = false;
      clearTimeout(cleanupTimeout);

      // Remove event listeners
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);

      // Clean up video element
      if (video) {
        video.pause();
        video.src = "";
        video.load();
      }
    };
  }, [mediaType, videoUrl]); // Only depend on mediaType and videoUrl

  // Fallback timer for videos
  useEffect(() => {
    if (mediaType === "video" && duration > 0 && isPlaying) {
      console.log("Starting fallback timer for video");
      const timeout = setTimeout(() => {
        console.log("Video fallback timer expired");
        onDurationEndRef.current?.();
      }, duration);

      return () => {
        console.log("Clearing fallback timer");
        clearTimeout(timeout);
      };
    }
  }, [mediaType, duration, isPlaying]);

  const handleManualPlay = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setIsVideoLoading(true);
      await videoRef.current.play();
      setIsPlaying(true);
      setShowPlayButton(false);
      setIsVideoLoading(false);
    } catch (error) {
      console.error("Manual play failed:", error);
      setIsVideoLoading(false);
    }
  }, []);

  const progressPercentage =
    mediaType === "image" && duration > 0
      ? ((duration - timeRemaining) / duration) * 100
      : 0;

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
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
        .animate-spin {
          animation: spin 1s linear infinite;
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
          {mediaType === "video" && videoUrl ? (
            <>
              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${
                  isVideoLoading ? "opacity-50" : "opacity-100"
                } transition-opacity duration-300`}
                muted
                playsInline
                preload="auto"
                crossOrigin="anonymous"
                aria-label={`Video ad: ${title}`}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Loading overlay */}
              {(isVideoLoading || !isVideoReady) &&
                !hasVideoError &&
                !showPlayButton && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2
                        className="w-10 h-10 text-white animate-spin"
                        style={{ color: accentColor }}
                      />
                      <span className="text-white text-lg">
                        Loading video...
                      </span>
                    </div>
                  </div>
                )}

              {/* Manual play overlay */}
              {showPlayButton && !hasVideoError && (
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

              {/* Error overlay */}
              {hasVideoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="text-center p-8 max-w-md">
                    <div
                      className="text-5xl mb-4"
                      style={{ color: accentColor }}
                    >
                      ⚠️
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Video Failed to Load
                    </h3>
                    <p className="text-white/70 mb-6">
                      Unable to load the video content.
                    </p>
                    {onDurationEnd && (
                      <button
                        onClick={onDurationEnd}
                        className="px-6 py-3 rounded-lg font-medium"
                        style={{
                          backgroundColor: accentColor,
                          color: "white",
                        }}
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </div>
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

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
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

            {mediaType === "image" && showTimer && duration > 0 && (
              <div className="mb-4">
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-100 ease-linear rounded-full"
                    style={{
                      width: `${Math.min(progressPercentage, 100)}%`,
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

            {mediaType === "video" && (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-white/70 text-sm">
                    {isVideoLoading
                      ? "Loading..."
                      : isPlaying
                      ? "Now playing"
                      : showPlayButton
                      ? "Click to play"
                      : "Ready"}
                    : {Math.min(currentPlayCount + 1, playCount)} of {playCount}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: playCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          idx < currentPlayCount ? "bg-white" : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  {isVideoLoading && (
                    <Loader2 className="w-3 h-3 text-white animate-spin ml-2" />
                  )}
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
