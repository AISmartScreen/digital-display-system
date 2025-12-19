"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function MasjidPreview({ config }: { config: any }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle through announcements
  useEffect(() => {
    if (config.announcements && config.announcements.length > 0) {
      const announcement = config.announcements[currentAnnouncementIndex];
      const duration =
        typeof announcement === "object" ? announcement.duration : 5;

      const timer = setInterval(() => {
        setCurrentAnnouncementIndex(
          (prev) => (prev + 1) % config.announcements.length
        );
      }, duration * 1000);

      return () => clearInterval(timer);
    }
  }, [config.announcements, currentAnnouncementIndex]);

  // Slideshow for background images
  useEffect(() => {
    if (
      config.backgroundType === "slideshow" &&
      config.backgroundImage?.length > 1
    ) {
      const timer = setInterval(() => {
        setCurrentSlideIndex(
          (prev) => (prev + 1) % config.backgroundImage.length
        );
      }, (config.slideshowDuration || 10) * 1000);
      return () => clearInterval(timer);
    }
  }, [config.backgroundType, config.backgroundImage, config.slideshowDuration]);

  // Default values
  const prayerTimes = config.prayerTimes || {
    fajr: "05:30",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:00",
    isha: "19:30",
  };

  const iqamahOffsets = config.iqamahOffsets || {
    fajr: 15,
    dhuhr: 10,
    asr: 10,
    maghrib: 5,
    isha: 10,
  };

  const colorTheme = config.colorTheme ||
    config.colors || {
      primary: "#10b981",
      secondary: "#059669",
      text: "#ffffff",
      accent: "#fbbf24",
    };

  const layout = config.layout || "authentic";

  const prayers = [
    {
      name: "Fajr",
      time: prayerTimes.fajr,
      offset: iqamahOffsets.fajr,
    },
    {
      name: "Dhuhr",
      time: prayerTimes.dhuhr,
      offset: iqamahOffsets.dhuhr,
    },
    {
      name: "Asr",
      time: prayerTimes.asr,
      offset: iqamahOffsets.asr,
    },
    {
      name: "Maghrib",
      time: prayerTimes.maghrib,
      offset: iqamahOffsets.maghrib,
    },
    {
      name: "Isha",
      time: prayerTimes.isha,
      offset: iqamahOffsets.isha,
    },
  ];

  // Calculate Iqamah time
  const getIqamahTime = (adhanTime: string, offset: number) => {
    const [hours, minutes] = adhanTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + offset;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(
      2,
      "0"
    )}`;
  };

  // Format time to 12h or 24h
  const formatTime = (time: string) => {
    const clockFormat = config.clockFormat || "12h";
    if (clockFormat === "24h") return time;

    const [hours, minutes] = time.split(":");
    const hour = Number.parseInt(hours);
    const isAM = hour < 12;
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, "0")}:${minutes} ${
      isAM ? "AM" : "PM"
    }`;
  };

  // Get next prayer and calculate countdown
  const getNextPrayerInfo = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerMinutes = hours * 60 + minutes;
      const iqamahMinutes = prayerMinutes + prayer.offset;

      if (prayerMinutes > currentMinutes) {
        const diff = prayerMinutes - currentMinutes;
        const countdownHours = Math.floor(diff / 60);
        const countdownMinutes = diff % 60;
        const seconds = 60 - now.getSeconds();
        return {
          prayer: prayer.name,
          type: "adhan",
          countdown: `${String(countdownHours).padStart(2, "0")}:${String(
            countdownMinutes
          ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
        };
      }

      if (prayerMinutes <= currentMinutes && iqamahMinutes > currentMinutes) {
        const diff = iqamahMinutes - currentMinutes;
        const countdownHours = Math.floor(diff / 60);
        const countdownMinutes = diff % 60;
        const seconds = 60 - now.getSeconds();
        return {
          prayer: prayer.name,
          type: "iqamah",
          countdown: `${String(countdownHours).padStart(2, "0")}:${String(
            countdownMinutes
          ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
        };
      }
    }

    // Next is Fajr tomorrow
    const [hours, minutes] = prayers[0].time.split(":").map(Number);
    const fajrMinutes = hours * 60 + minutes;
    const diff = 24 * 60 - currentMinutes + fajrMinutes;
    const countdownHours = Math.floor(diff / 60);
    const countdownMinutes = diff % 60;
    return {
      prayer: prayers[0].name,
      type: "adhan",
      countdown: `${String(countdownHours).padStart(2, "0")}:${String(
        countdownMinutes
      ).padStart(2, "0")}:00`,
    };
  };

  const nextPrayerInfo = getNextPrayerInfo();

  // Get Hijri date
  const getHijriDate = () => {
    const hijriDate = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(currentTime);
    return hijriDate;
  };

  // Background style
  const getBackgroundStyle = () => {
    switch (config.backgroundType) {
      case "solid":
        return { backgroundColor: config.backgroundColor || "#1e293b" };
      case "gradient":
        return {
          background: `linear-gradient(135deg, ${
            config.backgroundGradient?.from || "#1e293b"
          }, ${config.backgroundGradient?.to || "#0f172a"})`,
        };
      case "image":
        return config.backgroundImage?.[0]
          ? {
              backgroundImage: `url(${config.backgroundImage[0]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "#1e293b" };
      case "slideshow":
        return config.backgroundImage?.[currentSlideIndex]
          ? {
              backgroundImage: `url(${config.backgroundImage[currentSlideIndex]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "background-image 1s ease-in-out",
            }
          : { backgroundColor: "#1e293b" };
      default:
        return { backgroundColor: "#1e293b" };
    }
  };

  const currentAnnouncement = config.announcements?.[currentAnnouncementIndex];
  const announcementText =
    typeof currentAnnouncement === "string"
      ? currentAnnouncement
      : currentAnnouncement?.text || "";

  const textStyle = {
    color: colorTheme.text,
    fontFamily: config.font || "Roboto",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  };

  // Check if we're close to Adhan time (within 10 minutes)
  const isCloseToAdhan = () => {
    if (!nextPrayerInfo || nextPrayerInfo.type !== "adhan") return false;
    const [hours, minutes] = nextPrayerInfo.countdown.split(":").map(Number);
    return hours === 0 && minutes <= 10;
  };

  const isAdhanSoon = isCloseToAdhan();

  // VERTICAL LAYOUT - Exact match to MasjidTemplate
  const renderVerticalLayout = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return (
      <div className="w-full h-[80%] grid grid-cols-2 gap-6 p-8 overflow-hidden">
        {/* LEFT SIDE - All Prayer Times */}
        <div className="flex flex-col justify-center space-y-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.name}
              className="flex items-center justify-between p-5 rounded-lg backdrop-blur-sm"
              style={{
                backgroundColor: `${colorTheme.primary}40`,
                borderLeft: `4px solid ${colorTheme.accent}`,
              }}
            >
              <div className="flex-1">
                <h3
                  className="text-2xl font-bold leading-tight"
                  style={textStyle}
                >
                  {prayer.name}
                </h3>
                <p
                  className="text-lg opacity-75 leading-tight mt-1"
                  style={textStyle}
                >
                  Iqamah:{" "}
                  {formatTime(getIqamahTime(prayer.time, prayer.offset))}
                </p>
              </div>
              <div
                className="text-3xl font-bold"
                style={{ ...textStyle, color: colorTheme.accent }}
              >
                {formatTime(prayer.time)}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - Current Time, Countdown, Date */}
        <div className="flex flex-col justify-center space-y-4">
          {/* Next Prayer Countdown - Larger when Adhan is soon */}
          <div
            className={`rounded-xl backdrop-blur-sm text-center transition-all ${
              isAdhanSoon ? "p-8" : "p-6"
            }`}
            style={{ backgroundColor: `${colorTheme.accent}DD` }}
          >
            <p
              className={`mb-3 ${isAdhanSoon ? "text-2xl" : "text-xl"}`}
              style={textStyle}
            >
              {nextPrayerInfo.type === "adhan"
                ? `Next Adhan: ${nextPrayerInfo.prayer}`
                : `${nextPrayerInfo.prayer} Iqamah`}
            </p>
            <p
              className={`font-bold font-mono ${
                isAdhanSoon ? "text-7xl" : "text-6xl"
              }`}
              style={textStyle}
            >
              {nextPrayerInfo.countdown}
            </p>
            {isAdhanSoon && (
              <p className="text-xl mt-3 animate-pulse" style={textStyle}>
                🕌 Adhan Time Approaching
              </p>
            )}
          </div>

          {/* Current Time Display */}
          {config.showCurrentTime !== false && (
            <div
              className="p-6 rounded-xl backdrop-blur-sm text-center"
              style={{ backgroundColor: `${colorTheme.primary}60` }}
            >
              <p className="text-base opacity-80 mb-2" style={textStyle}>
                Current Time
              </p>
              <p
                className="text-5xl font-bold font-mono mb-2"
                style={textStyle}
              >
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: config.clockFormat !== "24h",
                })}
              </p>
              {config.showDate !== false && (
                <p className="text-lg opacity-90" style={textStyle}>
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}

          {/* Hijri Date */}
          {config.showHijriDate && (
            <div
              className="p-5 rounded-xl backdrop-blur-sm text-center"
              style={{ backgroundColor: `${colorTheme.primary}50` }}
            >
              <p className="text-base opacity-80 mb-2" style={textStyle}>
                Islamic Date
              </p>
              <p className="text-lg font-semibold" style={textStyle}>
                {getHijriDate()}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // HORIZONTAL LAYOUT - Exact match to MasjidTemplate
  const renderHorizontalLayout = () => {
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return (
      <div className="w-full h-[80%] flex flex-col justify-center px-12 py-8 space-y-8 overflow-hidden">
        {/* Top Section - Current Time & Date */}
        <div className="grid grid-cols-3 gap-8">
          <div
            className="col-span-2 p-10 rounded-2xl backdrop-blur-sm"
            style={{ backgroundColor: `${colorTheme.primary}60` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl opacity-80 mb-3" style={textStyle}>
                  Current Time
                </p>
                <p className="text-8xl font-bold font-mono" style={textStyle}>
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: config.clockFormat !== "24h",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl" style={textStyle}>
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {config.showHijriDate && (
                  <p className="text-xl opacity-80 mt-3" style={textStyle}>
                    {getHijriDate()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Countdown - Larger when Adhan is soon */}
          <div
            className={`rounded-2xl backdrop-blur-sm flex flex-col justify-center items-center transition-all ${
              isAdhanSoon ? "p-8 animate-pulse" : "p-8"
            }`}
            style={{ backgroundColor: `${colorTheme.accent}DD` }}
          >
            <p
              className={`mb-3 ${isAdhanSoon ? "text-2xl" : "text-xl"}`}
              style={textStyle}
            >
              {nextPrayerInfo.type === "adhan" ? "Next Adhan" : "Iqamah"}
            </p>
            <p
              className={`font-bold mb-3 ${
                isAdhanSoon ? "text-4xl" : "text-3xl"
              }`}
              style={textStyle}
            >
              {nextPrayerInfo.prayer}
            </p>
            <p
              className={`font-bold font-mono ${
                isAdhanSoon ? "text-7xl" : "text-6xl"
              }`}
              style={textStyle}
            >
              {nextPrayerInfo.countdown}
            </p>
          </div>
        </div>

        {/* Bottom Section - Prayer Times in Cards */}
        <div className="grid grid-cols-5 gap-6">
          {prayers.map((prayer) => {
            const [prayerHours, prayerMinutes] = prayer.time
              .split(":")
              .map(Number);
            const prayerTime = prayerHours * 60 + prayerMinutes;
            const isPassed = currentMinutes > prayerTime;

            return (
              <div
                key={prayer.name}
                className="p-6 rounded-xl backdrop-blur-sm text-center transition-all"
                style={{
                  backgroundColor: isPassed
                    ? `${colorTheme.primary}30`
                    : `${colorTheme.primary}60`,
                  border: `4px solid ${
                    isPassed ? colorTheme.primary : colorTheme.accent
                  }`,
                  opacity: isPassed ? 0.7 : 1,
                }}
              >
                <h3 className="text-2xl font-bold mb-3" style={textStyle}>
                  {prayer.name}
                </h3>
                <div
                  className="text-5xl font-bold mb-4"
                  style={{ ...textStyle, color: colorTheme.accent }}
                >
                  {formatTime(prayer.time)}
                </div>
                <div className="pt-3 border-t-2 border-white/20">
                  <p className="text-lg opacity-80 mb-1" style={textStyle}>
                    Iqamah
                  </p>
                  <p className="text-xl font-semibold" style={textStyle}>
                    {formatTime(getIqamahTime(prayer.time, prayer.offset))}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // CENTERED LAYOUT - Exact match to MasjidTemplate
  const renderCenteredLayout = () => {
    return (
      <div className="w-full h-[80%] flex items-center justify-center px-12 py-8 overflow-hidden">
        <div className="text-center space-y-10 w-full max-w-7xl">
          {/* Hijri Date */}
          {config.showHijriDate && (
            <div className="text-3xl mb-4" style={textStyle}>
              📅 {getHijriDate()}
            </div>
          )}

          {/* Large Countdown - Extra large when Adhan is soon */}
          <div
            className={`rounded-2xl backdrop-blur-sm transition-all ${
              isAdhanSoon ? "p-16 animate-pulse" : "p-12"
            }`}
            style={{ backgroundColor: `${colorTheme.accent}DD` }}
          >
            <p
              className={`mb-6 ${isAdhanSoon ? "text-5xl" : "text-4xl"}`}
              style={textStyle}
            >
              {nextPrayerInfo.type === "adhan"
                ? `${nextPrayerInfo.prayer} Adhan`
                : `${nextPrayerInfo.prayer} Iqamah`}
            </p>
            <p
              className={`font-bold font-mono ${
                isAdhanSoon ? "text-9xl" : "text-8xl"
              }`}
              style={textStyle}
            >
              {nextPrayerInfo.countdown}
            </p>
            {isAdhanSoon && (
              <p className="text-4xl mt-6" style={textStyle}>
                🕌 Adhan Time Approaching
              </p>
            )}
          </div>

          {/* Compact Prayer Grid */}
          <div className="grid grid-cols-5 gap-6">
            {prayers.map((prayer) => (
              <div
                key={prayer.name}
                className="p-6 rounded-xl backdrop-blur-sm"
                style={{
                  backgroundColor: `${colorTheme.primary}50`,
                  border: `4px solid ${colorTheme.accent}`,
                }}
              >
                <h4 className="text-2xl font-bold mb-3" style={textStyle}>
                  {prayer.name}
                </h4>
                <p
                  className="text-5xl font-bold mb-2"
                  style={{ ...textStyle, color: colorTheme.accent }}
                >
                  {formatTime(prayer.time)}
                </p>
                <p className="text-xl opacity-70" style={textStyle}>
                  +{prayer.offset}m
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{
        width: "1920px",
        height: "1080px",
        ...getBackgroundStyle(),
        fontFamily: config.font || "Roboto",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Header with Logo and Masjid Name */}
      {config.masjidName && (
        <div className="absolute top-0 left-0 right-0 p-6 text-center z-10">
          <div className="flex items-center justify-center gap-3">
            {config.logo && (
              <img
                src={config.logo}
                alt="Logo"
                className="object-contain"
                style={{ height: "48px", width: "48px" }}
              />
            )}
            <h1 className="text-4xl font-bold" style={textStyle}>
              {config.masjidName}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {layout === "authentic" && renderVerticalLayout()}
        {layout === "vertical" && renderVerticalLayout()}
        {layout === "horizontal" && renderHorizontalLayout()}
        {layout === "centered" && renderCenteredLayout()}
      </div>

      {/* Announcements Ticker */}
      {config.announcements &&
        config.announcements.length > 0 &&
        announcementText && (
          <div
            className="absolute bottom-0 left-0 right-0 py-4 overflow-hidden z-20"
            style={{
              backgroundColor: `${colorTheme.primary}DD`,
            }}
          >
            <div
              className="whitespace-nowrap text-xl font-semibold px-8"
              style={textStyle}
            >
              📢 {announcementText}
            </div>
          </div>
        )}
    </div>
  );
}
