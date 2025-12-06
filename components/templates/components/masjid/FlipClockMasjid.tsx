"use client";

import { useState, useEffect } from "react";

interface FlipClockMasjidProps {
  masjidName: string;
  date: string;
  prayerTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  iqamahTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  backgroundImage?: string;
}

export function FlipClockMasjid({
  masjidName,
  date,
  prayerTimes,
  iqamahTimes,
  backgroundImage,
}: FlipClockMasjidProps) {
  const [currentTime, setCurrentTime] = useState("00:00:00");
  const [nextPrayer, setNextPrayer] = useState({
    name: "Fajr",
    type: "adhan" as "adhan" | "iqamah",
    time: "00:00",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );

      // Calculate next prayer
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const prayers = [
        { name: "Fajr", adhan: prayerTimes.fajr, iqamah: iqamahTimes.fajr },
        { name: "Dhuhr", adhan: prayerTimes.dhuhr, iqamah: iqamahTimes.dhuhr },
        { name: "Asr", adhan: prayerTimes.asr, iqamah: iqamahTimes.asr },
        {
          name: "Maghrib",
          adhan: prayerTimes.maghrib,
          iqamah: iqamahTimes.maghrib,
        },
        { name: "Isha", adhan: prayerTimes.isha, iqamah: iqamahTimes.isha },
      ];

      for (const prayer of prayers) {
        const [adhanH, adhanM] = prayer.adhan.split(":").map(Number);
        const [iqamahH, iqamahM] = prayer.iqamah.split(":").map(Number);
        const adhanTime = adhanH * 60 + adhanM;
        const iqamahTime = iqamahH * 60 + iqamahM;

        if (currentMinutes < adhanTime) {
          setNextPrayer({
            name: prayer.name,
            type: "adhan",
            time: prayer.adhan,
          });
          return;
        }
        if (currentMinutes < iqamahTime) {
          setNextPrayer({
            name: prayer.name,
            type: "iqamah",
            time: prayer.iqamah,
          });
          return;
        }
      }

      // Default to tomorrow's Fajr
      setNextPrayer({
        name: "Fajr",
        type: "adhan",
        time: prayerTimes.fajr,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes, iqamahTimes]);

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex flex-col items-center gap-12 max-w-6xl w-full">
        {/* Header - Masjid Name and Date */}
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">{masjidName}</h1>
          <p className="text-4xl text-yellow-400 font-semibold">{date}</p>
        </div>

        {/* Main Flip Clock Section */}
        <div className="flex gap-8 items-center justify-center w-full flex-wrap">
          {/* Current Time Display */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl border-8 border-gray-800">
            <div className="text-center">
              <p className="text-gray-600 text-2xl font-semibold mb-4">
                Current Time
              </p>
              <div className="font-mono text-7xl font-bold text-gray-800 tracking-widest">
                {currentTime}
              </div>
            </div>
          </div>

          {/* Next Prayer Card */}
          <div className="bg-red-500 rounded-2xl p-8 shadow-2xl border-8 border-gray-800">
            <div className="text-center">
              <p className="text-white text-xl font-semibold mb-2">
                Next Prayer
              </p>
              <p className="text-white text-5xl font-bold mb-4">
                {nextPrayer.name}
              </p>
              <p className="text-white text-lg font-semibold mb-4">
                {nextPrayer.type === "adhan" ? "Adhan" : "Iqamah"}
              </p>
              <div className="font-mono text-6xl font-bold text-white">
                {nextPrayer.time}
              </div>
            </div>
          </div>
        </div>

        {/* Prayer Times Grid */}
        <div className="w-full grid grid-cols-5 gap-6">
          {[
            {
              label: "Fajr",
              adhan: prayerTimes.fajr,
              iqamah: iqamahTimes.fajr,
            },
            {
              label: "Dhuhr",
              adhan: prayerTimes.dhuhr,
              iqamah: iqamahTimes.dhuhr,
            },
            { label: "Asr", adhan: prayerTimes.asr, iqamah: iqamahTimes.asr },
            {
              label: "Maghrib",
              adhan: prayerTimes.maghrib,
              iqamah: iqamahTimes.maghrib,
            },
            {
              label: "Isha",
              adhan: prayerTimes.isha,
              iqamah: iqamahTimes.isha,
            },
          ].map((prayer) => (
            <div
              key={prayer.label}
              className="bg-teal-500 rounded-xl p-6 text-center shadow-lg border-4 border-gray-800"
            >
              <p className="text-white font-bold text-lg mb-3 italic">
                {prayer.label}
              </p>
              <div className="font-mono text-4xl font-bold text-white mb-3">
                {prayer.adhan}
              </div>
              <div className="pt-3 border-t-2 border-white/50">
                <p className="text-white text-sm font-semibold mb-2 italic">
                  Iqamah
                </p>
                <div className="font-mono text-3xl font-bold text-white">
                  {prayer.iqamah}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
