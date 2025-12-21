import React, { useState, useEffect, useRef } from "react";
import { UtensilsCrossed, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import FullScreenAd from "./components/restaurant/FullScreenAd";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
  isSpecial?: boolean;
}

interface RestaurantCustomization {
  restaurantName: string;
  tagline: string;
  restaurantLogo: string;
  backgroundImage: string;
  backgroundImages: string[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tickerMessage: string;
  tickerRightMessage: string;
  enableSlideshow: boolean;
  slideshowSpeed: number;
  menuItems: MenuItem[];
  galleryImages: string[];
  advertisements: Array<{
    id: string;
    enabled: boolean;
    title: string;
    image: string;
    video: string;
    mediaType: "image" | "video";
    caption: string;
    frequency: number;
    duration: number;
    playCount: number;
    dateRange: {
      start: string;
      end: string;
    };
    timeRange: {
      start: string;
      end: string;
    };
    daysOfWeek: number[];
  }>;
}

interface RestaurantTemplateProps {
  customization: RestaurantCustomization;
  backgroundStyle: React.CSSProperties;
}

export function RestaurantTemplate({
  customization,
  backgroundStyle,
}: RestaurantTemplateProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [showAdvertisement, setShowAdvertisement] = useState(false);
  const [currentAd, setCurrentAd] = useState<any>(null);
  const isShowingAdRef = useRef(false);

  const settings = {
    restaurantName: customization.restaurantName || "Gourmet Delight",
    tagline: customization.tagline || "Where Every Meal is a Masterpiece",
    restaurantLogo: customization.restaurantLogo || "",
    backgroundImage: customization.backgroundImage || "",
    primaryColor: customization.primaryColor || "#f59e0b",
    secondaryColor: customization.secondaryColor || "#ef4444",
    accentColor: customization.accentColor || "#10b981",
    tickerMessage:
      customization.tickerMessage ||
      "🍽️ Fresh Ingredients • Authentic Flavors • Exceptional Service",
    tickerRightMessage:
      customization.tickerRightMessage || "Taste the Difference",
    enableSlideshow: customization.enableSlideshow || false,
    slideshowSpeed: customization.slideshowSpeed || 10000,
  };

  const menuItems = customization.menuItems || [];
  const galleryImages = customization.galleryImages || [];
  const backgroundImages = customization.backgroundImages || [];
  const advertisements = customization.advertisements || [];

  // Time update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Gallery rotation
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000); // 5 seconds per gallery image
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  // Menu rotation
  useEffect(() => {
    if (menuItems.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMenuIndex((prev) => (prev + 1) % menuItems.length);
    }, 8000); // 8 seconds per menu item
    return () => clearInterval(interval);
  }, [menuItems.length]);

  // Background slideshow
  useEffect(() => {
    if (!settings.enableSlideshow || backgroundImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
    }, settings.slideshowSpeed);
    return () => clearInterval(interval);
  }, [
    settings.enableSlideshow,
    backgroundImages.length,
    settings.slideshowSpeed,
  ]);

  // Advertisement scheduling logic with queue for consecutive ads
  useEffect(() => {
    const adTimers = new Map<string, NodeJS.Timeout>();
    const adLastShown = new Map<string, number>();
    let adQueue: any[] = [];
    let isProcessingQueue = false;

    const isAdActive = (ad: any) => {
      if (!ad.enabled) return false;

      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      // Check date range
      const startDate = new Date(ad.dateRange.start);
      const endDate = new Date(ad.dateRange.end);
      if (now < startDate || now > endDate) return false;

      // Check day of week
      if (!ad.daysOfWeek.includes(currentDay)) return false;

      // Check time range
      const [startHour, startMin] = ad.timeRange.start.split(":").map(Number);
      const [endHour, endMin] = ad.timeRange.end.split(":").map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      if (currentTime < startTime || currentTime > endTime) return false;

      return true;
    };

    const processNextAd = () => {
      if (isProcessingQueue || adQueue.length === 0) {
        isProcessingQueue = false;
        return;
      }

      // Check if an ad is currently showing
      if (isShowingAdRef.current) {
        return;
      }

      // Get next ad from queue
      const nextAd = adQueue.shift();
      if (!nextAd) {
        isProcessingQueue = false;
        return;
      }

      // Check if this ad is still active
      if (!isAdActive(nextAd)) {
        // Skip this ad and try the next one
        processNextAd();
        return;
      }

      const now = Date.now();
      const lastShown = adLastShown.get(nextAd.id) || 0;
      const timeSinceLastShown = now - lastShown;

      // Check if enough time has passed based on frequency
      if (timeSinceLastShown < nextAd.frequency * 1000) {
        // Not ready yet, try next ad
        processNextAd();
        return;
      }

      // Show this ad
      isProcessingQueue = true;
      isShowingAdRef.current = true;
      setCurrentAd(nextAd);
      setShowAdvertisement(true);
      adLastShown.set(nextAd.id, now);

      console.log(
        `📺 Showing ad: ${nextAd.title || nextAd.id} (${
          adQueue.length
        } remaining in queue)`
      );
    };

    const queueAd = (ad: any) => {
      const now = Date.now();
      const lastShown = adLastShown.get(ad.id) || 0;
      const timeSinceLastShown = now - lastShown;

      // Check if enough time has passed based on frequency
      if (timeSinceLastShown >= ad.frequency * 1000) {
        // Don't add duplicate ads to queue
        const alreadyQueued = adQueue.some((queuedAd) => queuedAd.id === ad.id);
        if (!alreadyQueued) {
          adQueue.push(ad);
          console.log(
            `➕ Queued ad: ${ad.title || ad.id} (Queue size: ${adQueue.length})`
          );

          // Try to process immediately if nothing is showing
          if (!isShowingAdRef.current && !isProcessingQueue) {
            processNextAd();
          }
        }
      }
    };

    const handleAdComplete = () => {
      console.log(`✅ Ad completed`);
      isProcessingQueue = false;
      isShowingAdRef.current = false;
      setShowAdvertisement(false);
      setCurrentAd(null);

      // After a brief pause, process next ad in queue
      setTimeout(() => {
        processNextAd();
      }, 1000); // 1 second gap between ads
    };

    // Store handler globally so onDurationEnd callback can access it
    (window as any).__handleAdComplete = handleAdComplete;

    const scheduleAds = () => {
      // Clear existing timers
      adTimers.forEach((timer) => clearInterval(timer));
      adTimers.clear();

      // Schedule each active advertisement based on its frequency
      advertisements.forEach((ad) => {
        if (isAdActive(ad)) {
          // Try to queue immediately if it's ready
          const lastShown = adLastShown.get(ad.id) || 0;
          const now = Date.now();

          if (now - lastShown >= ad.frequency * 1000) {
            // Add a small random delay to avoid all ads queuing at once
            setTimeout(() => {
              if (isAdActive(ad)) {
                queueAd(ad);
              }
            }, Math.random() * 3000); // 0-3 seconds
          }

          // Set up recurring schedule based on frequency
          const timer = setInterval(() => {
            if (isAdActive(ad)) {
              queueAd(ad);
            }
          }, ad.frequency * 1000);

          adTimers.set(ad.id, timer);
        }
      });
    };

    // Initial schedule
    scheduleAds();

    // Re-check active ads every minute to account for time range changes
    const recheckInterval = setInterval(() => {
      scheduleAds();
    }, 60000);

    return () => {
      adTimers.forEach((timer) => clearInterval(timer));
      clearInterval(recheckInterval);
      delete (window as any).__handleAdComplete;
      adQueue = [];
    };
  }, [advertisements]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Determine background image
  let dynamicBackgroundStyle = backgroundStyle;
  if (settings.enableSlideshow && backgroundImages.length > 0) {
    dynamicBackgroundStyle = {
      ...backgroundStyle,
      backgroundImage: `url(${backgroundImages[currentBackgroundIndex]})`,
    };
  } else if (settings.backgroundImage) {
    dynamicBackgroundStyle = {
      ...backgroundStyle,
      backgroundImage: `url(${settings.backgroundImage})`,
    };
  }

  // Show advertisement fullscreen if active
  if (showAdvertisement && currentAd) {
    return (
      <FullScreenAd
        title={currentAd.title}
        caption={currentAd.caption || ""}
        imageUrl={currentAd.mediaType === "image" ? currentAd.image : undefined}
        videoUrl={currentAd.mediaType === "video" ? currentAd.video : undefined}
        mediaType={currentAd.mediaType}
        playCount={currentAd.playCount || 1}
        animation="fade"
        accentColor={settings.accentColor}
        primaryColor={settings.primaryColor}
        secondaryColor={settings.secondaryColor}
        duration={currentAd.duration * 1000} // Convert seconds to milliseconds
        showTimer={currentAd.mediaType === "image"}
        showScheduleInfo={false}
        scheduleInfo={{
          timeRange: currentAd.timeRange,
          frequency: currentAd.frequency,
          daysOfWeek: currentAd.daysOfWeek,
        }}
        onDurationEnd={() => {
          // Call the global handler to process next ad in queue
          const handler = (window as any).__handleAdComplete;
          if (handler) {
            handler();
          }
        }}
      />
    );
  }

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={dynamicBackgroundStyle}
    >
      {/* Background overlay */}
      {(settings.backgroundImage ||
        (settings.enableSlideshow && backgroundImages.length > 0)) && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80"></div>
      )}
      {!settings.backgroundImage &&
        (!settings.enableSlideshow || backgroundImages.length === 0) && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        )}

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header
          className="bg-black/60 backdrop-blur-md border-b-2 px-8 py-5"
          style={{ borderColor: settings.primaryColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {settings.restaurantLogo ? (
                <img
                  src={settings.restaurantLogo}
                  alt="Restaurant Logo"
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  }}
                >
                  <UtensilsCrossed className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  {settings.restaurantName}
                </h1>
                <p
                  className="text-base"
                  style={{ color: settings.accentColor }}
                >
                  {settings.tagline}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div
                className="text-5xl font-bold mb-1"
                style={{ color: settings.primaryColor }}
              >
                {formatTime(currentTime)}
              </div>
              <div className="text-base text-gray-300">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Menu on Left, Gallery on Right */}
        <div className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden min-h-0">
          {/* Left Side - Menu Items */}
          <div className="flex flex-col justify-center">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-full flex flex-col">
              <div className="bg-black/30 backdrop-blur-sm px-6 py-4 border-b border-white/10">
                <h2
                  className="text-3xl font-bold text-center"
                  style={{ color: settings.primaryColor }}
                >
                  Today's Menu
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {menuItems.length > 0 ? (
                  menuItems
                    .filter((item) => item.available)
                    .map((item, idx) => (
                      <div
                        key={item.id}
                        className={`bg-white/5 backdrop-blur-sm rounded-2xl p-5 border transition-all duration-300 ${
                          item.isSpecial
                            ? "border-amber-400/50 shadow-lg shadow-amber-400/20"
                            : "border-white/10"
                        }`}
                      >
                        <div className="flex gap-4">
                          {item.image && (
                            <div className="flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-xl"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-2xl font-bold text-white">
                                {item.name}
                                {item.isSpecial && (
                                  <span className="ml-2 text-amber-400">
                                    ⭐
                                  </span>
                                )}
                              </h3>
                              <span
                                className="text-2xl font-bold"
                                style={{ color: settings.primaryColor }}
                              >
                                {item.price}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">
                              {item.description}
                            </p>
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: settings.accentColor + "30",
                                color: settings.accentColor,
                              }}
                            >
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No menu items available</p>
                  </div>
                )}
              </div>

              {menuItems.length > 3 && (
                <div className="bg-black/20 backdrop-blur-sm px-6 py-4 border-t border-white/10">
                  <div className="flex justify-center gap-2">
                    {menuItems.slice(0, 5).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-2 h-2 rounded-full bg-white/30"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Gallery */}
          <div className="flex flex-col justify-center">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-full flex flex-col">
              {galleryImages.length > 0 ? (
                <>
                  <div className="flex-1 relative">
                    <img
                      src={galleryImages[currentGalleryIndex]}
                      alt={`Gallery ${currentGalleryIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  {galleryImages.length > 1 && (
                    <div className="bg-black/30 backdrop-blur-sm px-6 py-4 border-t border-white/10">
                      <div className="flex justify-center gap-2">
                        {galleryImages.map((_, idx) => (
                          <div
                            key={idx}
                            className="transition-all duration-300 rounded-full"
                            style={{
                              width:
                                idx === currentGalleryIndex ? "32px" : "12px",
                              height: "12px",
                              backgroundColor:
                                idx === currentGalleryIndex
                                  ? settings.primaryColor
                                  : "#64748b",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <UtensilsCrossed className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-xl">No gallery images</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Ticker */}
        <div
          className="bg-black/60 backdrop-blur-md border-t-2 px-8 py-3"
          style={{ borderColor: settings.primaryColor }}
        >
          <div className="flex items-center justify-between text-base">
            <div className="text-white font-semibold">
              {settings.tickerMessage}
            </div>
            <div className="font-bold" style={{ color: settings.accentColor }}>
              {settings.restaurantName} - {settings.tickerRightMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
