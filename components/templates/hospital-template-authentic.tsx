import React, { useState, useEffect, useRef } from "react";

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  image: string;
  available: string;
}

interface HospitalCustomization {
  hospitalName?: string;
  hospitalLogo?: string;
  backgroundImage?: string;
  backgroundImages?: string[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  slideSpeed?: number;
  slideshowSpeed?: number;
  enableSlideshow?: boolean;
  doctors?: Doctor[];
}

interface HospitalTemplateAuthenticProps {
  customization?: HospitalCustomization;
  backgroundStyle?: React.CSSProperties;
}

export default function HospitalTemplateAuthentic({
  customization = {},
  backgroundStyle = {},
}: HospitalTemplateAuthenticProps) {
  // Extract values from customization with defaults
  const settings = {
    hospitalName: customization.hospitalName || "OLIVIA Hospital",
    hospitalLogo: customization.hospitalLogo || "",
    backgroundImage:
      customization.backgroundImage ||
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop",
    backgroundImages: customization.backgroundImages || [],
    primaryColor: customization.primaryColor || "#06b6d4",
    secondaryColor: customization.secondaryColor || "#14b8a6",
    accentColor: customization.accentColor || "#f59e0b",
    slideSpeed: customization.slideSpeed || 20, // Slightly slower for larger cards
    slideshowSpeed: customization.slideshowSpeed || 10000,
    enableSlideshow: customization.enableSlideshow || false,
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
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
            available: "Mon-Fri, 9 AM - 5 PM",
          },
          {
            name: "Dr. Michael Chen",
            specialty: "Neurology",
            experience: "12+ Years",
            image:
              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
            available: "Mon-Thu, 10 AM - 6 PM",
          },
          {
            name: "Dr. Emily Rodriguez",
            specialty: "Pediatrics",
            experience: "10+ Years",
            image:
              "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
            available: "Mon-Sat, 8 AM - 4 PM",
          },
        ];

  const [currentTime, setCurrentTime] = useState(new Date());
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Default placeholder image
  const defaultDoctorImage =
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop";

  // Determine which images to use for slideshow
  const bgImages =
    settings.enableSlideshow &&
    settings.backgroundImages &&
    settings.backgroundImages.length > 0
      ? settings.backgroundImages
      : [settings.backgroundImage];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Smooth animation using requestAnimationFrame
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Calculate smooth scroll based on time elapsed
      setScrollPosition((prev) => {
        const speed = settings.slideSpeed / 80; // Adjusted for larger cards
        const newPosition = prev + (speed * delta) / 16.67;
        return newPosition;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [settings.slideSpeed]);

  // Background slideshow
  useEffect(() => {
    if (!settings.enableSlideshow || bgImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
    }, settings.slideshowSpeed);

    return () => clearInterval(interval);
  }, [settings.enableSlideshow, bgImages.length, settings.slideshowSpeed]);

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

  // Duplicate doctors array for seamless loop
  const duplicatedDoctors = [...doctors, ...doctors, ...doctors, ...doctors];
  const itemHeight = 220; // Increased card height for larger images
  const totalHeight = doctors.length * itemHeight;

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ backgroundColor: settings.primaryColor }}
    >
      {/* Background Images with Slideshow */}
      <div className="absolute inset-0">
        {bgImages.map((img, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: index === currentBgIndex ? 1 : 0,
              zIndex: index === currentBgIndex ? 1 : 0,
            }}
          />
        ))}
        {/* Subtle overlay for better text readability */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          style={{ zIndex: 2 }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col">
        {/* Header with Background */}
        <div className="bg-black/50 backdrop-blur-xl border-b border-white/20 shadow-2xl">
          <div className="flex items-center justify-between p-6">
            {/* Left: Logo and Name */}
            <div className="flex items-center gap-5">
              {settings.hospitalLogo && (
                <img
                  src={settings.hospitalLogo}
                  alt="Hospital Logo"
                  className="w-24 h-24 object-contain drop-shadow-2xl"
                />
              )}
              <div>
                <h1 className="text-6xl font-black text-white drop-shadow-2xl tracking-tight">
                  {settings.hospitalName}
                </h1>
              </div>
            </div>

            {/* Right: Time and Date */}
            <div className="text-right">
              <div
                className="text-7xl font-black drop-shadow-2xl tracking-tight"
                style={{ color: settings.accentColor }}
              >
                {formatTime(currentTime)}
              </div>
              <div
                className="text-xl font-semibold drop-shadow-lg mt-1 tracking-wide"
                style={{ color: settings.accentColor, opacity: 0.9 }}
              >
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Split into 2 columns */}
        <div className="flex-1 flex gap-8 px-8 pb-8 pt-8 overflow-hidden">
          {/* Left Column - Doctors Marquee */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div
              className="relative flex-1 overflow-hidden rounded-3xl shadow-2xl border-2"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(20px)",
                borderColor: `${settings.accentColor}40`,
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
              }}
            >
              {/* Decorative gradient overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                }}
              />

              <div
                className="absolute z-10 w-full px-6"
                style={{
                  transform: `translateY(-${
                    scrollPosition % (totalHeight * 3)
                  }px)`,
                  willChange: "transform",
                }}
              >
                {duplicatedDoctors.map((doctor, index) => (
                  <div
                    key={index}
                    className="mb-5"
                    style={{ height: `${itemHeight}px` }}
                  >
                    {/* Card for each doctor */}
                    <div
                      className="h-full rounded-2xl p-5 shadow-xl border-2 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group"
                      style={{
                        background: `linear-gradient(135deg, ${settings.primaryColor}20, ${settings.secondaryColor}20)`,
                        borderColor: `${settings.accentColor}60`,
                      }}
                    >
                      <div className="flex items-center h-full gap-6">
                        {/* Doctor Image - Much larger and prominent */}
                        <div className="relative flex-shrink-0">
                          <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                            {/* Background gradient for image container */}
                            <div
                              className="absolute inset-0 opacity-60 blur-sm"
                              style={{
                                background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                              }}
                            />

                            {/* Doctor Image */}
                            <img
                              src={doctor.image || defaultDoctorImage}
                              alt={doctor.name}
                              className="relative w-full h-full object-cover rounded-2xl border-4 border-white/40 group-hover:border-white/60 transition-all duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = defaultDoctorImage;
                              }}
                            />

                            {/* Decorative overlay */}
                            <div
                              className="absolute inset-0 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                              style={{
                                background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                              }}
                            />

                            {/* Experience badge - Larger and more prominent */}
                            {doctor.experience && (
                              <div
                                className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold shadow-2xl whitespace-nowrap z-20"
                                style={{
                                  background: `linear-gradient(135deg, ${settings.accentColor}, ${settings.secondaryColor})`,
                                  color: "white",
                                  border: `2px solid white`,
                                  minWidth: "120px",
                                  textAlign: "center",
                                }}
                              >
                                {doctor.experience}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Doctor info - Stacked vertically */}
                        <div className="flex-1 space-y-4">
                          {/* Name with accent line */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-2 h-10 rounded-full"
                                style={{
                                  backgroundColor: settings.accentColor,
                                  boxShadow: `0 0 15px ${settings.accentColor}`,
                                }}
                              />
                              <p
                                className="text-4xl font-black tracking-tight leading-tight"
                                style={{
                                  color: "white",
                                  textShadow: `0 3px 20px ${settings.accentColor}80`,
                                }}
                              >
                                {doctor.name}
                              </p>
                            </div>
                          </div>

                          {/* Specialty - More prominent */}
                          {doctor.specialty && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                                  style={{
                                    backgroundColor: settings.primaryColor,
                                  }}
                                >
                                  <span className="text-white text-lg">🩺</span>
                                </div>
                                <p
                                  className="text-2xl font-bold italic"
                                  style={{
                                    color: `${settings.accentColor}EE`,
                                    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                  }}
                                >
                                  {doctor.specialty}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Decorative separator */}
                          <div className="flex items-center gap-2 pt-2">
                            <div
                              className="flex-1 h-0.5 rounded-full opacity-40"
                              style={{
                                backgroundColor: settings.accentColor,
                              }}
                            />
                            <div
                              className="w-3 h-3 rounded-full animate-pulse"
                              style={{
                                backgroundColor: settings.accentColor,
                                boxShadow: `0 0 10px ${settings.accentColor}`,
                              }}
                            />
                            <div
                              className="flex-1 h-0.5 rounded-full opacity-40"
                              style={{
                                backgroundColor: settings.accentColor,
                              }}
                            />
                          </div>

                          {/* Status indicator - Simplified */}
                          {/* <div className="pt-2">
                            <div className="inline-flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full animate-pulse"
                                style={{
                                  backgroundColor: "#10b981",
                                  boxShadow: `0 0 10px #10b981`,
                                }}
                              />
                              <p
                                className="text-xl font-semibold"
                                style={{
                                  color: "#10b981",
                                  textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                                }}
                              >
                                Available for Consultation
                              </p>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fade edges for smoother visual effect */}
              <div
                className="absolute top-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)`,
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)`,
                }}
              />
            </div>
          </div>

          {/* Right Column - Empty for future content */}
          <div className="flex-1">
            {/* Empty space reserved for future content */}
          </div>
        </div>
      </div>
    </div>
  );
}
