import React, { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

interface HospitalCustomization {
  hospitalName: string;
  tagline: string;
  hospitalLogo: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tickerMessage: string;
  tickerRightMessage: string;
  doctorRotationSpeed: number;
  departmentInfo: string;
  emergencyContact: string;
  doctors: Array<{
    name: string;
    specialty: string;
    experience: string;
    image: string;
    available: string;
  }>;
  doctorSchedules: Array<{
    name: string;
    specialty: string;
    time: string;
    room: string;
  }>;
}

interface HospitalTemplateProps {
  customization: HospitalCustomization;
  backgroundStyle: React.CSSProperties;
}

export function HospitalTemplate({
  customization,
  backgroundStyle,
}: HospitalTemplateProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDoctor, setCurrentDoctor] = useState(0);

  const settings = {
    hospitalName: customization.hospitalName || "MediTech Hospital",
    tagline: customization.tagline || "Excellence in Healthcare Since 1995",
    hospitalLogo: customization.hospitalLogo || "",
    backgroundImage: customization.backgroundImage || "",
    primaryColor: customization.primaryColor || "#06b6d4",
    secondaryColor: customization.secondaryColor || "#14b8a6",
    accentColor: customization.accentColor || "#f59e0b",
    tickerMessage:
      customization.tickerMessage ||
      "⚕️ Quality Healthcare • Compassionate Service • Advanced Technology",
    tickerRightMessage:
      customization.tickerRightMessage || "Your Health, Our Priority",
    doctorRotationSpeed: customization.doctorRotationSpeed || 6000,
    departmentInfo: customization.departmentInfo || "Emergency Department",
    emergencyContact: customization.emergencyContact || "911",
  };

  const doctors =
    customization.doctors && customization.doctors.length > 0
      ? customization.doctors
      : [
          {
            name: "Dr. Sarah Johnson",
            specialty: "Cardiology",
            experience: "15+ Years",
            image:
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
            available: "Mon-Fri, 9 AM - 5 PM",
          },
          {
            name: "Dr. Michael Chen",
            specialty: "Neurology",
            experience: "12+ Years",
            image:
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
            available: "Mon-Thu, 10 AM - 6 PM",
          },
          {
            name: "Dr. Emily Rodriguez",
            specialty: "Pediatrics",
            experience: "10+ Years",
            image:
              "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
            available: "Mon-Sat, 8 AM - 4 PM",
          },
        ];

  const doctorSchedules = customization.doctorSchedules || [];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (doctors.length === 0) return;
    const interval = setInterval(() => {
      setCurrentDoctor((prev) => (prev + 1) % doctors.length);
    }, settings.doctorRotationSpeed);
    return () => clearInterval(interval);
  }, [doctors.length, settings.doctorRotationSpeed]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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

  const nextDoctor = () => {
    if (doctors.length === 0) return;
    setCurrentDoctor((prev) => (prev + 1) % doctors.length);
  };

  const prevDoctor = () => {
    if (doctors.length === 0) return;
    setCurrentDoctor((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  const dynamicBackgroundStyle = settings.backgroundImage
    ? {
        ...backgroundStyle,
        backgroundImage: `url(${settings.backgroundImage})`,
      }
    : backgroundStyle;

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={dynamicBackgroundStyle}
    >
      {/* Dark overlay */}
      {settings.backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
      )}
      {!settings.backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Header Bar */}
        <header
          className="bg-black/60 backdrop-blur-md border-b-2 px-8 py-5"
          style={{ borderColor: settings.primaryColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {settings.hospitalLogo ? (
                <img
                  src={settings.hospitalLogo}
                  alt="Hospital Logo"
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  }}
                >
                  <Heart className="w-8 h-8 text-white fill-white" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">
                  {settings.hospitalName}
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

        {/* Main Content Area - 2 Columns */}
        <div className="flex-1 grid grid-cols-2 gap-6 p-6 overflow-hidden min-h-0">
          {/* Left Panel - Doctor Carousel */}
          <div className="flex flex-col justify-center">
            {doctors.length > 0 && (
              <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
                <div className="flex flex-col items-center">
                  <div className="relative w-80 h-80 mb-6">
                    <div
                      className="absolute -inset-2 rounded-full opacity-50 animate-pulse"
                      style={{
                        background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                        filter: "blur(20px)",
                      }}
                    ></div>
                    <div
                      className="relative w-full h-full rounded-full p-2 shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                      }}
                    >
                      <img
                        src={doctors[currentDoctor].image}
                        alt={doctors[currentDoctor].name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>

                  <h3 className="text-4xl font-bold text-white mb-3">
                    {doctors[currentDoctor].name}
                  </h3>
                  <div
                    className="inline-block px-8 py-3 rounded-full text-xl font-bold text-white mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${settings.secondaryColor}, ${settings.primaryColor})`,
                    }}
                  >
                    {doctors[currentDoctor].specialty}
                  </div>
                  <div className="text-lg text-gray-300 space-y-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">⏱️</span>
                      <span>{doctors[currentDoctor].experience}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">📅</span>
                      <span>{doctors[currentDoctor].available}</span>
                    </div>
                  </div>
                </div>

                {doctors.length > 1 && (
                  <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                      onClick={prevDoctor}
                      className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/30 hover:border-white/50"
                    >
                      <ChevronLeft className="w-7 h-7 text-white" />
                    </button>
                    <div className="flex gap-2">
                      {doctors.map((_, idx) => (
                        <div
                          key={idx}
                          className="w-3 h-3 rounded-full transition-all"
                          style={{
                            backgroundColor:
                              idx === currentDoctor
                                ? settings.primaryColor
                                : "#64748b",
                          }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextDoctor}
                      className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/30 hover:border-white/50"
                    >
                      <ChevronRight className="w-7 h-7 text-white" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Doctor Schedules */}
          <div className="flex flex-col justify-center">
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Today's Schedule
              </h2>

              <div className="mb-6 text-center space-y-2">
                <div className="text-lg text-gray-300">
                  {settings.departmentInfo}
                </div>
                <div
                  className="text-xl font-semibold"
                  style={{ color: settings.accentColor }}
                >
                  Emergency: {settings.emergencyContact}
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {doctorSchedules.length > 0 ? (
                  doctorSchedules.map((schedule, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-white mb-1">
                            {schedule.name}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: settings.accentColor }}
                          >
                            {schedule.specialty}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {schedule.time}
                          </div>
                          <div className="text-sm text-gray-300">
                            Room {schedule.room}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No scheduled appointments today
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ticker */}
        <div
          className="bg-black/60 backdrop-blur-md border-t-2 px-8 py-3"
          style={{ borderColor: settings.primaryColor }}
        >
          <div className="flex items-center justify-between text-base">
            <div className="text-white font-semibold">
              {settings.tickerMessage}
            </div>
            <div className="font-bold" style={{ color: settings.accentColor }}>
              {settings.hospitalName} - {settings.tickerRightMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
