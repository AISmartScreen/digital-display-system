import React, { useState, useEffect } from "react";

interface Doctor {
  name: string;
  specialty: string;
  schedule: string;
}

interface SimpleHospitalProps {
  hospitalName?: string;
  logo?: string;
  backgroundImage?: string;
  doctors?: Doctor[];
  slideSpeed?: number;
}

export default function HospitalTemplate({
  hospitalName = "OLIVIA Hospital",
  logo = "",
  backgroundImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop",
  doctors = [
    {
      name: "Consultant Surgeon",
      specialty: "",
      schedule: "Daily 3.00 pm",
    },
    {
      name: "Consultant VOG",
      specialty: "",
      schedule: "Mon - Fri 5.00 pm",
    },
    {
      name: "Consultant Paediatrician",
      specialty: "",
      schedule: "Daily 7.00 pm",
    },
  ],
  slideSpeed = 3000,
}: SimpleHospitalProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (doctors.length === 0) return;
    const interval = setInterval(() => {
      setCurrentDoctorIndex((prev) => (prev + 1) % doctors.length);
    }, slideSpeed);
    return () => clearInterval(interval);
  }, [doctors.length, slideSpeed]);

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

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with Logo and Hospital Name */}
        <div className="flex items-start justify-between p-8">
          {/* Left: Logo and Name */}
          <div className="flex items-center gap-6">
            {logo && (
              <img
                src={logo}
                alt="Hospital Logo"
                className="w-32 h-32 object-contain bg-white/90 rounded-2xl p-4 shadow-2xl"
              />
            )}
            <div>
              <h1 className="text-7xl font-bold text-white drop-shadow-2xl">
                {hospitalName}
              </h1>
            </div>
          </div>

          {/* Right: Time and Date */}
          <div className="text-right bg-black/50 backdrop-blur-md rounded-2xl px-8 py-6 border border-yellow-400/50">
            <div className="text-6xl font-bold text-yellow-400 mb-2 drop-shadow-lg">
              {formatTime(currentTime)}
            </div>
            <div className="text-2xl text-yellow-300 drop-shadow-lg">
              {formatDate(currentTime)}
            </div>
          </div>
        </div>

        {/* Doctor Names - Vertical Sliding */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-6xl">
            <div className="relative h-[500px] overflow-hidden">
              {doctors.map((doctor, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentDoctorIndex
                      ? "opacity-100 translate-y-0"
                      : index < currentDoctorIndex
                      ? "opacity-0 -translate-y-full"
                      : "opacity-0 translate-y-full"
                  }`}
                >
                  <div className="h-full flex flex-col items-center justify-center bg-gradient-to-r from-red-600/80 to-pink-600/80 backdrop-blur-sm rounded-3xl border-4 border-red-400/50 shadow-2xl px-12 py-16">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl">
                      <span className="text-4xl">🩺</span>
                    </div>
                    <h2 className="text-8xl font-black text-white text-center mb-6 drop-shadow-2xl leading-tight">
                      {doctor.name}
                    </h2>
                    {doctor.specialty && (
                      <p className="text-4xl text-white/90 text-center mb-4 drop-shadow-lg">
                        {doctor.specialty}
                      </p>
                    )}
                    <p className="text-5xl font-bold text-yellow-300 text-center drop-shadow-lg">
                      {doctor.schedule}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {doctors.map((_, idx) => (
                <div
                  key={idx}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: idx === currentDoctorIndex ? "48px" : "16px",
                    height: "16px",
                    backgroundColor:
                      idx === currentDoctorIndex ? "#ef4444" : "#94a3b8",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
