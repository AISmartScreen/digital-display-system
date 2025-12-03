import React, { useState, useEffect } from "react";
import {
  Sun,
  MapPin,
  Calendar,
  User,
  Clock,
  Stethoscope,
  Heart,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HospitalDigitalSignage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDoctor, setCurrentDoctor] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentRightSlide, setCurrentRightSlide] = useState(0);

  // ========== CUSTOMIZATION SETTINGS ==========
  const settings = {
    hospitalName: "MediTech Hospital",
    tagline: "Excellence in Healthcare Since 1995",
    tokenNumber: "A-127",

    // Background & Colors
    backgroundImage: "/hospital-reception.png",
    primaryColor: "#06b6d4",
    secondaryColor: "#14b8a6",
    accentColor: "#f59e0b",

    // Contact Info
    phone: "+1 (555) 123-4567",
    emergency: "911 / +1 (555) 999-0000",
    website: "www.meditech.org",
    address: "123 Medical Center Blvd, Healthcare City, HC 12345",

    // Timing
    slideInterval: 8000,
  };

  const doctors = [
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

  const services = [
    { icon: Heart, name: "Cardiology", desc: "Heart Care Excellence" },
    { icon: Stethoscope, name: "General Medicine", desc: "Primary Healthcare" },
    { icon: Users, name: "Pediatrics", desc: "Child Healthcare" },
    { icon: Award, name: "Surgery", desc: "Advanced Surgical Care" },
  ];

  const testimonials = [
    {
      text: "The best healthcare experience I've ever had. Professional, caring staff and state-of-the-art facilities.",
      author: "John Smith",
      rating: 5,
    },
    {
      text: "Outstanding service! The doctors took time to explain everything and the facility is immaculate.",
      author: "Maria Garcia",
      rating: 5,
    },
    {
      text: "Highly recommend! Quick appointments, minimal wait times, and exceptional care quality.",
      author: "David Lee",
      rating: 5,
    },
  ];

  const stats = [
    { number: "25K+", label: "Patients Treated Annually" },
    { number: "50+", label: "Expert Doctors" },
    { number: "98%", label: "Patient Satisfaction" },
    { number: "24/7", label: "Emergency Services" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDoctor((prev) => (prev + 1) % doctors.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRightSlide((prev) => (prev + 1) % 3);
    }, settings.slideInterval);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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

  const nextDoctor = () => {
    setCurrentDoctor((prev) => (prev + 1) % doctors.length);
  };

  const prevDoctor = () => {
    setCurrentDoctor((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* Background Image with Subtle Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${settings.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Header Bar */}
        <header
          className="bg-black/60 backdrop-blur-md border-b-2 px-8 py-5"
          style={{ borderColor: settings.primaryColor }}
        >
          <div className="flex items-center justify-between">
            {/* Logo & Hospital Name */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                }}
              >
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
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

            {/* Time & Date */}
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

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden min-h-0">
          {/* Left Panel - Doctor Carousel Only */}
          <div className="flex flex-col justify-center">
            <div
              className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border-2 shadow-2xl mb-6"
              style={{ borderColor: settings.primaryColor + "60" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <User
                  className="w-7 h-7"
                  style={{ color: settings.primaryColor }}
                />
                <h2 className="text-2xl font-bold text-white">
                  Meet Our Doctors
                </h2>
              </div>
            </div>

            {/* Main Doctor Card */}
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
              <div className="flex flex-col items-center">
                {/* Large Doctor Image */}
                <div className="relative w-64 h-64 mb-6">
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

                {/* Doctor Info */}
                <h3 className="text-3xl font-bold text-white mb-3">
                  {doctors[currentDoctor].name}
                </h3>
                <div
                  className="inline-block px-6 py-2 rounded-full text-lg font-bold text-white mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${settings.secondaryColor}, ${settings.primaryColor})`,
                  }}
                >
                  {doctors[currentDoctor].specialty}
                </div>
                <div className="text-base text-gray-300 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <span>{doctors[currentDoctor].experience}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl">📅</span>
                    <span>{doctors[currentDoctor].available}</span>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button
                  onClick={prevDoctor}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/30 hover:border-white/50"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <div className="flex gap-2">
                  {doctors.map((_, idx) => (
                    <div
                      key={idx}
                      className="w-2 h-2 rounded-full transition-all"
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
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all border border-white/30 hover:border-white/50"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Center Panel - Token & Emergency */}
          <div className="flex flex-col justify-center gap-6">
            {/* Token Number Display */}
            <div
              className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border-2 shadow-2xl text-center"
              style={{ borderColor: settings.primaryColor + "60" }}
            >
              <div className="text-lg font-semibold text-white mb-3">
                Current Token Number
              </div>
              <div
                className="text-8xl font-bold py-6 rounded-xl"
                style={{
                  color: settings.primaryColor,
                  textShadow: `0 0 30px ${settings.primaryColor}80`,
                }}
              >
                {settings.tokenNumber}
              </div>
              <div className="text-base text-gray-300 mt-3">
                Please wait for your number
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-900/40 backdrop-blur-md rounded-2xl p-6 border-2 border-red-500/60 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <span className="text-2xl">🚨</span>
                </div>
                <div className="text-2xl font-bold text-white">Emergency</div>
              </div>
              <div className="text-3xl font-bold text-red-400">
                {settings.emergency}
              </div>
              <div className="text-sm text-gray-300 mt-2">
                Available 24/7 for emergencies
              </div>
            </div>

            {/* Quick Stats */}
            <div
              className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border-2 shadow-2xl"
              style={{ borderColor: settings.primaryColor + "60" }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: settings.primaryColor }}
                  >
                    98%
                  </div>
                  <div className="text-xs text-gray-300">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold"
                    style={{ color: settings.accentColor }}
                  >
                    50+
                  </div>
                  <div className="text-xs text-gray-300">Doctors</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Contact Info with Services/Excellence Carousel */}
          <div className="flex flex-col overflow-hidden">
            {/* Contact Info Header */}
            <div
              className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border-2 shadow-2xl mb-4"
              style={{ borderColor: settings.primaryColor + "60" }}
            >
              <div className="flex items-center gap-3 mb-2">
                <MapPin
                  className="w-7 h-7"
                  style={{ color: settings.primaryColor }}
                />
                <h2 className="text-2xl font-bold text-white">
                  Contact & Information
                </h2>
              </div>
            </div>

            {/* Carousel Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Slide 1: Contact Details */}
              {currentRightSlide === 0 && (
                <div className="flex-1 flex flex-col justify-center animate-in fade-in duration-1000">
                  <div className="space-y-4">
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-xl">
                      <div
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: settings.accentColor }}
                      >
                        <span className="text-2xl">📞</span>
                        <span>Phone</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {settings.phone}
                      </div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-xl">
                      <div
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: settings.accentColor }}
                      >
                        <span className="text-2xl">🌐</span>
                        <span>Website</span>
                      </div>
                      <div className="text-xl font-bold text-white">
                        {settings.website}
                      </div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-xl">
                      <div
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: settings.accentColor }}
                      >
                        <span className="text-2xl">📍</span>
                        <span>Address</span>
                      </div>
                      <div className="text-base text-gray-300 leading-relaxed">
                        {settings.address}
                      </div>
                    </div>

                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-xl">
                      <div
                        className="text-base font-semibold mb-2 flex items-center gap-2"
                        style={{ color: settings.accentColor }}
                      >
                        <span className="text-2xl">⏰</span>
                        <span>Hours</span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Monday - Friday: 8 AM - 8 PM</div>
                        <div>Saturday: 9 AM - 5 PM</div>
                        <div>Sunday: Emergency Only</div>
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
                      <div
                        className="text-base font-semibold mb-4 flex items-center gap-2"
                        style={{ color: settings.accentColor }}
                      >
                        <Users className="w-5 h-5" />
                        <span>Patient Testimonial</span>
                      </div>
                      <div className="flex gap-1 mb-3">
                        {[
                          ...Array(testimonials[currentTestimonial].rating),
                        ].map((_, i) => (
                          <span
                            key={i}
                            className="text-xl"
                            style={{ color: settings.accentColor }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed mb-3 italic">
                        "{testimonials[currentTestimonial].text}"
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: settings.primaryColor }}
                      >
                        — {testimonials[currentTestimonial].author}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 2: Services */}
              {currentRightSlide === 1 && (
                <div className="flex-1 space-y-4 animate-in fade-in duration-1000">
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:border-white/40 hover:bg-black/40 transition-all shadow-xl"
                    >
                      <div className="flex items-center gap-4">
                        <service.icon
                          className="w-10 h-10"
                          style={{ color: settings.accentColor }}
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {service.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Slide 3: Excellence Stats */}
              {currentRightSlide === 2 && (
                <div className="flex-1 space-y-4 animate-in fade-in duration-1000">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center shadow-xl"
                    >
                      <div
                        className="text-4xl font-bold mb-1"
                        style={{ color: settings.primaryColor }}
                      >
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: idx === currentRightSlide ? "2.5rem" : "0.5rem",
                    backgroundColor:
                      idx === currentRightSlide
                        ? settings.primaryColor
                        : "#64748b",
                  }}
                />
              ))}
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
              ⚕️ Quality Healthcare • Compassionate Service • Advanced
              Technology
            </div>
            <div className="font-bold" style={{ color: settings.accentColor }}>
              {settings.hospitalName} - Your Health, Our Priority
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
