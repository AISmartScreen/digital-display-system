import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  MapPin,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty: string;
  room: string;
  appointmentDate: Date | string;
  priority: "normal" | "urgent" | "follow-up";
}

interface AppointmentRemindersProps {
  appointments?: Appointment[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function AppointmentReminders({
  appointments,
  primaryColor = "#06b6d4",
  secondaryColor = "#14b8a6",
  accentColor = "#f59e0b",
}: AppointmentRemindersProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mock appointments if none provided
  const defaultAppointments: Appointment[] = [
    {
      id: "1",
      patientName: "John Smith",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      room: "101",
      appointmentDate: new Date(Date.now() + 15 * 60000), // 15 minutes from now
      priority: "urgent",
    },
    {
      id: "2",
      patientName: "Emma Wilson",
      doctorName: "Dr. Michael Chen",
      specialty: "Neurology",
      room: "202",
      appointmentDate: new Date(Date.now() + 45 * 60000), // 45 minutes from now
      priority: "normal",
    },
    {
      id: "3",
      patientName: "Robert Brown",
      doctorName: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      room: "303",
      appointmentDate: new Date(Date.now() + 75 * 60000), // 75 minutes from now
      priority: "follow-up",
    },
    {
      id: "4",
      patientName: "Lisa Anderson",
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      room: "101",
      appointmentDate: new Date(Date.now() + 105 * 60000), // 105 minutes from now
      priority: "normal",
    },
    {
      id: "5",
      patientName: "David Martinez",
      doctorName: "Dr. Michael Chen",
      specialty: "Neurology",
      room: "202",
      appointmentDate: new Date(Date.now() + 165 * 60000), // 165 minutes from now
      priority: "urgent",
    },
  ];

  // Filter appointments: only show those within 30 minutes before to future
  const filterValidAppointments = (appts: Appointment[]) => {
    const now = currentTime.getTime();
    const thirtyMinutesAgo = now - 30 * 60000;

    return appts
      .filter((apt) => {
        const aptDate =
          typeof apt.appointmentDate === "string"
            ? new Date(apt.appointmentDate)
            : apt.appointmentDate;
        return aptDate.getTime() >= thirtyMinutesAgo;
      })
      .sort((a, b) => {
        const dateA =
          typeof a.appointmentDate === "string"
            ? new Date(a.appointmentDate)
            : a.appointmentDate;
        const dateB =
          typeof b.appointmentDate === "string"
            ? new Date(b.appointmentDate)
            : b.appointmentDate;
        return dateA.getTime() - dateB.getTime();
      });
  };

  const appointmentList = filterValidAppointments(
    appointments || defaultAppointments
  );

  // Format time for display
  const formatDisplayTime = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Only auto-rotate if there's more than one appointment
    if (appointmentList.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % appointmentList.length);
        setIsTransitioning(false);
      }, 300);
    }, 8000); // Auto-rotate every 8 seconds
    return () => clearInterval(interval);
  }, [appointmentList.length]);

  const calculateTimeRemaining = (appointmentDate: Date | string) => {
    const date =
      typeof appointmentDate === "string"
        ? new Date(appointmentDate)
        : appointmentDate;
    const diff = date.getTime() - currentTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (minutes < 0) return { text: "In Progress", urgent: true };
    if (minutes < 5) return { text: `${minutes}m`, urgent: true };
    if (minutes < 60) return { text: `${minutes}m`, urgent: false };
    return { text: `${hours}h ${remainingMinutes}m`, urgent: false };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "#ef4444";
      case "follow-up":
        return accentColor;
      default:
        return primaryColor;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "URGENT";
      case "follow-up":
        return "FOLLOW-UP";
      default:
        return "SCHEDULED";
    }
  };

  const nextAppointment = () => {
    if (isTransitioning || appointmentList.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % appointmentList.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevAppointment = () => {
    if (isTransitioning || appointmentList.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + appointmentList.length) % appointmentList.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  // Show message if no valid appointments
  if (appointmentList.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-full flex items-center justify-center">
        {/* <pre>{JSON.stringify(appointments, null, 2)}</pre> */}
        <div className="text-center p-8">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            No Upcoming Appointments
          </h3>
          <p className="text-gray-400">
            All appointments have been completed or expired
          </p>
        </div>
      </div>
    );
  }

  const currentAppointment = appointmentList[currentIndex];
  const timeRemaining = calculateTimeRemaining(
    currentAppointment.appointmentDate
  );

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-full flex flex-col">
      {/* Header */}
      <div
        className="px-8 py-6 border-b border-white/20"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              }}
            >
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Upcoming Appointments
              </h2>
              <p className="text-sm text-gray-300">
                {appointmentList.length} appointment
                {appointmentList.length !== 1 ? "s" : ""} scheduled today
              </p>
            </div>
          </div>

          {/* Navigation Arrows - Only show if more than 1 */}
          {appointmentList.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prevAppointment}
                disabled={isTransitioning}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
              >
                <ChevronUp className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextAppointment}
                disabled={isTransitioning}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Appointment Card */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            appointmentList.length > 1 && isTransitioning
              ? "opacity-0 scale-95"
              : "opacity-100 scale-100"
          }`}
        >
          {/* Countdown Timer - Large Display */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div
                className={`w-4 h-4 rounded-full animate-pulse ${
                  timeRemaining.urgent ? "bg-red-500" : "bg-green-500"
                }`}
              ></div>
              <span className="text-xl text-gray-300 font-medium">
                Time Until Appointment
              </span>
            </div>
            <div
              className={`text-8xl font-bold mb-2 ${
                timeRemaining.urgent
                  ? "text-red-400 animate-pulse"
                  : "text-white"
              }`}
            >
              {timeRemaining.text}
            </div>
            <div
              className="inline-block px-6 py-2 rounded-full text-sm font-bold text-white"
              style={{
                backgroundColor: getPriorityColor(currentAppointment.priority),
              }}
            >
              {getPriorityLabel(currentAppointment.priority)}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Patient Name */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl py-4 px-6 border border-white/10">
              <User
                className="w-7 h-7 flex-shrink-0"
                style={{ color: primaryColor }}
              />
              <div>
                <p className="text-sm text-gray-400 mb-1">Patient</p>
                <p className="text-2xl font-bold text-white">
                  {currentAppointment.patientName}
                </p>
              </div>
            </div>

            {/* Doctor Info */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl py-4 px-6 border border-white/10">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {currentAppointment.doctorName}
                </p>
                <p className="text-lg text-gray-300">
                  {currentAppointment.specialty}
                </p>
              </div>
            </div>

            {/* Time and Room */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl py-4 px-6 border border-white/10">
                <Clock
                  className="w-7 h-7 flex-shrink-0"
                  style={{ color: accentColor }}
                />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Time</p>
                  <p className="text-xl font-bold text-white">
                    {formatDisplayTime(currentAppointment.appointmentDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl py-4 px-6 border border-white/10">
                <MapPin
                  className="w-7 h-7 flex-shrink-0"
                  style={{ color: secondaryColor }}
                />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Room</p>
                  <p className="text-xl font-bold text-white">
                    {currentAppointment.room}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots - Only show if more than 1 */}
      {appointmentList.length > 1 && (
        <div className="px-8 py-5 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="flex justify-center gap-2.5">
            {appointmentList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentIndex(idx);
                      setIsTransitioning(false);
                    }, 300);
                  }
                }}
                className="transition-all duration-300 rounded-full hover:scale-110"
                style={{
                  width: idx === currentIndex ? "32px" : "12px",
                  height: "12px",
                  backgroundColor:
                    idx === currentIndex ? primaryColor : "#64748b",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
