import React, { useState, useEffect } from "react";

// Configuration JSON - Edit this to customize the display
const CONFIG = {
  hospital: {
    name: "OLIVIA MEDICAL CENTER",
    tagline: "Excellence in Healthcare Since 1995",
    address: "123 Medical Plaza, Healthcare District, City 12345",
    emergencyNumber: "911",
    website: "www.oliviamedical.com",
    email: "info@oliviamedical.com",
    phone: "+1 (555) 123-4567",
  },

  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#7c3aed",
    accentColor: "#f59e0b",
    textColor: "#ffffff",
    backgroundColor: "#1e293b",
    font: "Inter, system-ui, sans-serif",
  },

  features: {
    showDoctorProfiles: true,
    showQueueNumbers: true,
    showWeather: true,
    showTestimonials: true,
    showHealthTips: true,
    showNewsticker: true,
    showFacilities: true,
    enableParticles: true,
    enableVideoBackground: false,
    showLanguageToggle: true,
    showQRCodes: true,
  },

  animations: {
    healthTipInterval: 8000,
    doctorProfileInterval: 6000,
    testimonialInterval: 10000,
    particleCount: 30,
    enableGlowEffects: true,
    enableParallax: true,
  },

  visitingHours: {
    morning: "8:00 AM - 11:00 AM",
    evening: "4:00 PM - 7:00 PM",
  },
};

// Mock Data
const MOCK_DATA = {
  appointments: [
    {
      title: "Dr. Sarah Johnson - Cardiologist",
      time: "9:00 AM - 2:00 PM",
      days: "Mon, Wed, Fri",
      status: "Available",
    },
    {
      title: "Dr. Michael Chen - Neurologist",
      time: "10:00 AM - 4:00 PM",
      days: "Tue, Thu",
      status: "Busy",
    },
    {
      title: "Dr. Emily Rodriguez - Pediatrician",
      time: "8:00 AM - 6:00 PM",
      days: "Mon - Fri",
      status: "Available",
    },
    {
      title: "Dr. James Wilson - Orthopedic",
      time: "2:00 PM - 7:00 PM",
      days: "Mon - Sat",
      status: "Available",
    },
    {
      title: "Dr. Lisa Brown - Dermatologist",
      time: "11:00 AM - 5:00 PM",
      days: "Wed, Fri, Sat",
      status: "Next: 3:00 PM",
    },
    {
      title: "Dr. Robert Taylor - ENT Specialist",
      time: "9:00 AM - 3:00 PM",
      days: "Mon, Thu",
      status: "Available",
    },
    {
      title: "Dr. Maria Garcia - Gynecologist",
      time: "1:00 PM - 6:00 PM",
      days: "Tue, Wed, Fri",
      status: "Available",
    },
    {
      title: "Dr. David Lee - General Physician",
      time: "8:00 AM - 8:00 PM",
      days: "Daily",
      status: "Available",
    },
    {
      title: "Dr. Amanda White - Ophthalmologist",
      time: "10:00 AM - 4:00 PM",
      days: "Mon, Wed, Sat",
      status: "Busy",
    },
    {
      title: "Dr. Christopher Davis - Psychiatrist",
      time: "2:00 PM - 8:00 PM",
      days: "Tue, Thu, Sat",
      status: "Available",
    },
  ],

  doctors: [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      experience: "15+ years",
      image: "👩‍⚕️",
      rating: 4.9,
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      experience: "12+ years",
      image: "👨‍⚕️",
      rating: 4.8,
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      experience: "10+ years",
      image: "👩‍⚕️",
      rating: 5.0,
    },
    {
      name: "Dr. James Wilson",
      specialty: "Orthopedics",
      experience: "18+ years",
      image: "👨‍⚕️",
      rating: 4.9,
    },
  ],

  facilities: [
    { name: "24/7 Emergency", icon: "🚑", status: "Active" },
    { name: "ICU (12 beds)", icon: "🏥", status: "4 Available" },
    { name: "Pharmacy", icon: "💊", status: "Open" },
    { name: "Laboratory", icon: "🔬", status: "Open" },
    { name: "X-Ray & CT Scan", icon: "📷", status: "Available" },
    { name: "Ambulance", icon: "🚨", status: "3 Ready" },
    { name: "Blood Bank", icon: "🩸", status: "All Groups" },
    { name: "Dialysis", icon: "⚕️", status: "6 Machines" },
    { name: "Maternity Ward", icon: "👶", status: "Open" },
  ],

  queueNumbers: [
    { department: "General OPD", current: 47, waiting: 12 },
    { department: "Cardiology", current: 23, waiting: 5 },
    { department: "Pediatrics", current: 31, waiting: 8 },
    { department: "Orthopedics", current: 15, waiting: 3 },
  ],

  healthTips: [
    {
      icon: "💧",
      tip: "Drink 8-10 glasses of water daily to stay hydrated and support kidney function",
    },
    {
      icon: "🏃",
      tip: "30 minutes of daily exercise can reduce heart disease risk by 50%",
    },
    {
      icon: "🥗",
      tip: "Eat 5 servings of fruits and vegetables daily for optimal nutrition",
    },
    {
      icon: "😴",
      tip: "Quality sleep of 7-8 hours improves memory, immune system, and mood",
    },
    {
      icon: "🧘",
      tip: "Practice deep breathing or meditation to reduce stress and lower blood pressure",
    },
    {
      icon: "🚭",
      tip: "Quitting smoking can add 10 years to your life expectancy",
    },
    {
      icon: "🦷",
      tip: "Brush twice daily and floss to prevent 90% of dental problems",
    },
    {
      icon: "☀️",
      tip: "Get 15 minutes of morning sunlight for natural Vitamin D synthesis",
    },
    {
      icon: "🧼",
      tip: "Wash hands for 20 seconds with soap to prevent 80% of infections",
    },
    {
      icon: "📱",
      tip: "Limit screen time before bed for better sleep quality and eye health",
    },
  ],

  testimonials: [
    {
      patient: "John D.",
      message:
        "Excellent care during my cardiac surgery. The staff was amazing!",
      rating: 5,
    },
    {
      patient: "Maria S.",
      message: "Best pediatric care for my daughter. Highly professional team.",
      rating: 5,
    },
    {
      patient: "Robert K.",
      message: "Quick emergency response saved my life. Forever grateful!",
      rating: 5,
    },
    {
      patient: "Lisa M.",
      message:
        "Clean facility, caring nurses, and expert doctors. Recommended!",
      rating: 5,
    },
  ],

  newsItems: [
    "🎉 New State-of-the-Art Cardiac Care Unit Now Open",
    "🏆 Awarded 'Best Hospital 2024' by Healthcare Excellence Board",
    "💉 Free Health Checkup Camp Every Sunday 9 AM - 1 PM",
    "🩺 COVID-19, Flu & Pneumonia Vaccines Available",
    "🚑 Free Ambulance Service for Senior Citizens",
    "👶 Special Neonatal ICU with 24/7 Pediatrician",
    "🔬 Advanced Cancer Screening Programs Available",
    "💪 Free Physiotherapy Session for New Patients",
    "📱 Download Our App for Easy Appointment Booking",
    "🌟 Join Our Health Awareness Webinar Every Friday",
  ],

  achievements: [
    { title: "JCI Accredited", year: "2023", icon: "🏅" },
    { title: "ISO 9001 Certified", year: "2022", icon: "✅" },
    { title: "NABH Accredited", year: "2021", icon: "⭐" },
    { title: "Green Hospital", year: "2024", icon: "🌱" },
  ],
};

export default function HospitalTemplate() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [healthTipIndex, setHealthTipIndex] = useState(0);
  const [doctorIndex, setDoctorIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [particles, setParticles] = useState([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate health tips
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthTipIndex((prev) => (prev + 1) % MOCK_DATA.healthTips.length);
    }, CONFIG.animations.healthTipInterval);
    return () => clearInterval(interval);
  }, []);

  // Rotate doctor profiles
  useEffect(() => {
    const interval = setInterval(() => {
      setDoctorIndex((prev) => (prev + 1) % MOCK_DATA.doctors.length);
    }, CONFIG.animations.doctorProfileInterval);
    return () => clearInterval(interval);
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % MOCK_DATA.testimonials.length);
    }, CONFIG.animations.testimonialInterval);
    return () => clearInterval(interval);
  }, []);

  // Generate floating particles
  useEffect(() => {
    if (CONFIG.features.enableParticles) {
      const newParticles = Array.from(
        { length: CONFIG.animations.particleCount },
        (_, i) => ({
          id: i,
          left: Math.random() * 100,
          duration: 15 + Math.random() * 20,
          delay: Math.random() * 10,
          size: 10 + Math.random() * 20,
        })
      );
      setParticles(newParticles);
    }
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundColor: CONFIG.theme.backgroundColor,
        fontFamily: CONFIG.theme.font,
        minHeight: "1080px",
      }}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 opacity-80"></div>

      {/* Floating Particles */}
      {CONFIG.features.enableParticles &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: CONFIG.theme.accentColor,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              filter: CONFIG.animations.enableGlowEffects
                ? "blur(2px)"
                : "none",
            }}
          ></div>
        ))}

      {/* Header */}
      <header
        className="relative z-10 px-8 py-6"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div className="flex items-center justify-between">
          {/* Left - Logo & Info */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-5xl">🏥</span>
            </div>
            <div>
              <h1
                className="text-5xl font-bold mb-2"
                style={{
                  color: CONFIG.theme.textColor,
                  textShadow: CONFIG.animations.enableGlowEffects
                    ? "0 0 20px rgba(255,255,255,0.5)"
                    : "none",
                }}
              >
                {CONFIG.hospital.name}
              </h1>
              <p
                className="text-xl opacity-90"
                style={{ color: CONFIG.theme.textColor }}
              >
                {CONFIG.hospital.tagline}
              </p>
              <p
                className="text-sm opacity-75 mt-1"
                style={{ color: CONFIG.theme.textColor }}
              >
                📍 {CONFIG.hospital.address}
              </p>
            </div>
          </div>

          {/* Right - Achievements */}
          <div className="flex gap-4">
            {MOCK_DATA.achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-md"
              >
                <div className="text-4xl mb-1">{achievement.icon}</div>
                <div
                  className="text-xs font-bold"
                  style={{ color: CONFIG.theme.textColor }}
                >
                  {achievement.title}
                </div>
                <div
                  className="text-xs opacity-75"
                  style={{ color: CONFIG.theme.textColor }}
                >
                  {achievement.year}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="relative z-10 flex gap-6 px-8 py-6"
        style={{ height: "calc(100% - 240px)" }}
      >
        {/* Left Column - Appointments & Queue */}
        <div className="w-1/4 space-y-4">
          {/* Queue Numbers */}
          {CONFIG.features.showQueueNumbers && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
              <h3
                className="text-xl font-bold mb-3 text-center"
                style={{ color: CONFIG.theme.accentColor }}
              >
                🎫 Live Queue Status
              </h3>
              <div className="space-y-2">
                {MOCK_DATA.queueNumbers.map((queue, idx) => (
                  <div key={idx} className="bg-black/30 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: CONFIG.theme.textColor }}
                      >
                        {queue.department}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: CONFIG.theme.accentColor }}
                      >
                        #{queue.current}
                      </span>
                      <span
                        className="text-sm opacity-75"
                        style={{ color: CONFIG.theme.textColor }}
                      >
                        Waiting: {queue.waiting}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scrolling Appointments */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl flex-1">
            <h3
              className="text-xl font-bold mb-3 text-center"
              style={{ color: CONFIG.theme.accentColor }}
            >
              👨‍⚕️ Today's Doctors
            </h3>
            <div
              className="space-y-2 overflow-hidden"
              style={{ height: "400px" }}
            >
              <div className="animate-scroll-smooth space-y-2">
                {[...MOCK_DATA.appointments, ...MOCK_DATA.appointments].map(
                  (apt, idx) => (
                    <div
                      key={idx}
                      className="bg-black/30 rounded-lg p-3 border border-white/10"
                    >
                      <div
                        className="font-bold text-sm mb-1"
                        style={{ color: CONFIG.theme.accentColor }}
                      >
                        {apt.title}
                      </div>
                      <div
                        className="text-xs opacity-90 flex justify-between"
                        style={{ color: CONFIG.theme.textColor }}
                      >
                        <span>⏰ {apt.time}</span>
                        <span
                          className={`px-2 py-1 rounded ${
                            apt.status === "Available"
                              ? "bg-green-500/30"
                              : "bg-yellow-500/30"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div
                        className="text-xs opacity-75 mt-1"
                        style={{ color: CONFIG.theme.textColor }}
                      >
                        📅 {apt.days}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Time, Featured Doctor, Health Tips */}
        <div className="flex-1 space-y-6 flex flex-col">
          {/* Time & Date */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl">
            <div
              className="text-8xl font-bold mb-2 tracking-wider"
              style={{
                color: "#ffd700",
                textShadow: CONFIG.animations.enableGlowEffects
                  ? "0 0 40px rgba(255,215,0,0.8)"
                  : "none",
              }}
            >
              {formatTime(currentTime)}
            </div>
            <div
              className="text-3xl font-semibold"
              style={{ color: "#ffd700" }}
            >
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Featured Doctor Profile */}
          {CONFIG.features.showDoctorProfiles && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl transition-all duration-700">
              <div className="flex items-center gap-6">
                <div className="text-8xl">
                  {MOCK_DATA.doctors[doctorIndex].image}
                </div>
                <div className="flex-1">
                  <div
                    className="text-sm opacity-75 mb-1"
                    style={{ color: CONFIG.theme.accentColor }}
                  >
                    ⭐ Featured Doctor
                  </div>
                  <h3
                    className="text-3xl font-bold mb-2"
                    style={{ color: CONFIG.theme.textColor }}
                  >
                    {MOCK_DATA.doctors[doctorIndex].name}
                  </h3>
                  <p
                    className="text-xl mb-2"
                    style={{ color: CONFIG.theme.accentColor }}
                  >
                    {MOCK_DATA.doctors[doctorIndex].specialty}
                  </p>
                  <div className="flex items-center gap-4">
                    <span
                      className="text-sm"
                      style={{ color: CONFIG.theme.textColor }}
                    >
                      🎓 {MOCK_DATA.doctors[doctorIndex].experience}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: CONFIG.theme.textColor }}
                    >
                      ⭐ {MOCK_DATA.doctors[doctorIndex].rating}/5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Tip */}
          {CONFIG.features.showHealthTips && (
            <div
              className="backdrop-blur-md rounded-2xl p-6 shadow-2xl transition-all duration-700"
              style={{ backgroundColor: `${CONFIG.theme.secondaryColor}40` }}
            >
              <div className="flex items-center gap-4">
                <div className="text-6xl">
                  {MOCK_DATA.healthTips[healthTipIndex].icon}
                </div>
                <div className="flex-1">
                  <div
                    className="text-lg font-bold mb-2"
                    style={{ color: CONFIG.theme.accentColor }}
                  >
                    💡 Health Tip of the Moment
                  </div>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: CONFIG.theme.textColor }}
                  >
                    {MOCK_DATA.healthTips[healthTipIndex].tip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Patient Testimonial */}
          {CONFIG.features.showTestimonials && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl transition-all duration-700">
              <div className="text-center">
                <div
                  className="text-sm font-bold mb-2"
                  style={{ color: CONFIG.theme.accentColor }}
                >
                  💬 Patient Testimonial
                </div>
                <p
                  className="text-lg italic mb-3"
                  style={{ color: CONFIG.theme.textColor }}
                >
                  "{MOCK_DATA.testimonials[testimonialIndex].message}"
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="font-semibold"
                    style={{ color: CONFIG.theme.textColor }}
                  >
                    - {MOCK_DATA.testimonials[testimonialIndex].patient}
                  </span>
                  <span style={{ color: CONFIG.theme.accentColor }}>
                    {"⭐".repeat(
                      MOCK_DATA.testimonials[testimonialIndex].rating
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Facilities & Info */}
        <div className="w-1/4 space-y-4">
          {/* Emergency */}
          <div
            className="bg-red-600 rounded-2xl p-6 text-center shadow-2xl animate-pulse-glow"
            style={{
              boxShadow: CONFIG.animations.enableGlowEffects
                ? "0 0 30px rgba(220, 38, 38, 0.6)"
                : "none",
            }}
          >
            <div className="text-5xl mb-3">🚑</div>
            <div className="text-xl font-bold text-white mb-2">EMERGENCY</div>
            <div className="text-4xl font-bold text-white mb-2">
              {CONFIG.hospital.emergencyNumber}
            </div>
            <div className="text-sm text-white/90">24/7 Available</div>
          </div>

          {/* Visiting Hours */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-2">🕐</div>
              <div
                className="text-lg font-bold mb-3"
                style={{ color: CONFIG.theme.textColor }}
              >
                Visiting Hours
              </div>
              <div
                className="space-y-2 text-sm"
                style={{ color: CONFIG.theme.textColor }}
              >
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="font-semibold">Morning</div>
                  <div className="opacity-90">
                    {CONFIG.visitingHours.morning}
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="font-semibold">Evening</div>
                  <div className="opacity-90">
                    {CONFIG.visitingHours.evening}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Facilities Grid */}
          {CONFIG.features.showFacilities && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
              <h3
                className="text-lg font-bold mb-3 text-center"
                style={{ color: CONFIG.theme.accentColor }}
              >
                🏥 Our Facilities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_DATA.facilities.slice(0, 8).map((facility, idx) => (
                  <div
                    key={idx}
                    className="bg-black/20 rounded-lg p-2 text-center hover:scale-105 transition-transform"
                  >
                    <div className="text-2xl mb-1">{facility.icon}</div>
                    <div
                      className="text-xs font-semibold mb-1"
                      style={{ color: CONFIG.theme.textColor }}
                    >
                      {facility.name}
                    </div>
                    <div
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${CONFIG.theme.accentColor}40`,
                        color: CONFIG.theme.textColor,
                      }}
                    >
                      {facility.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl">
            <div
              className="text-center space-y-2 text-sm"
              style={{ color: CONFIG.theme.textColor }}
            >
              <div>📞 {CONFIG.hospital.phone}</div>
              <div>✉️ {CONFIG.hospital.email}</div>
              <div>🌐 {CONFIG.hospital.website}</div>
            </div>
          </div>

          {/* QR Code */}
          {CONFIG.features.showQRCodes && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center shadow-2xl">
              <div className="text-6xl mb-2">📱</div>
              <div
                className="text-xs font-semibold mb-2"
                style={{ color: CONFIG.theme.textColor }}
              >
                Scan for Appointments
              </div>
              <div className="bg-white w-20 h-20 mx-auto rounded-lg"></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer News Ticker */}
      {CONFIG.features.showNewsticker && (
        <footer
          className="relative z-10 overflow-hidden py-4"
          style={{
            backgroundColor: CONFIG.theme.primaryColor,
            height: "80px",
          }}
        >
          <div className="flex items-center h-full">
            <div className="animate-scroll-ticker whitespace-nowrap">
              {[...MOCK_DATA.newsItems, ...MOCK_DATA.newsItems].map(
                (news, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-12 text-xl font-semibold"
                    style={{ color: CONFIG.theme.textColor }}
                  >
                    {news}
                  </span>
                )
              )}
            </div>
          </div>
        </footer>
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-30px) translateX(10px);
          }
          50% {
            transform: translateY(-60px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        @keyframes scroll-smooth {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-scroll-smooth {
          animation: scroll-smooth 30s linear infinite;
        }

        .animate-scroll-ticker {
          animation: scroll-ticker 50s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
