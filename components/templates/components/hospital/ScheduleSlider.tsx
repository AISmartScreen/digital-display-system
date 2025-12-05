import { useState } from "react";
import { Clock, MapPin } from "lucide-react";

// Vertical Schedule Slider Component
export const ScheduleSlider = ({ schedules, settings }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  if (schedules.length === 0) {
    return (
      <div className="text-center text-gray-300 py-8 text-xl">
        No scheduled appointments today
      </div>
    );
  }

  // Fixed dimensions for consistency
  const visibleHeight = 520;
  const itemHeight = 140; // Increased for larger text
  const needsScroll = schedules.length > 3; // Show scroll if more than 3 items

  // Animation duration based on number of items (slower = smoother)
  const baseDuration = needsScroll ? schedules.length * 5 : 0; // 5 seconds per item
  const currentDuration = isHovered ? baseDuration * 3 : baseDuration; // 3x slower on hover

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border-2 border-white/30 shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Today's Schedule
      </h2>

      <div className="mb-6 text-center space-y-2">
        <div className="text-lg text-gray-300">{settings.departmentInfo}</div>
        <div
          className="text-xl font-semibold"
          style={{ color: settings.accentColor }}
        >
          Emergency: {settings.emergencyContact}
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ height: `${visibleHeight}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fade out effect at top - only show when scrolling */}
        {needsScroll && (
          <div
            className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)",
            }}
          />
        )}

        {/* Fade out effect at bottom - only show when scrolling */}
        {needsScroll && (
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
            }}
          />
        )}

        <div
          className="flex flex-col gap-5"
          style={{
            animation: needsScroll
              ? `slideUp ${currentDuration}s linear infinite`
              : "none",
          }}
        >
          {/* First set of schedules */}
          {schedules.map((schedule: any, idx: number) => (
            <div
              key={`first-${idx}`}
              className="relative rounded-2xl p-6 border-2 border-white/30 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg group"
              style={{ minHeight: `${itemHeight - 20}px` }}
            >
              {/* Subtle glow effect on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                }}
              />

              <div className="relative flex items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h4 className="text-2xl font-bold text-white mb-2 truncate">
                    {schedule.name}
                  </h4>
                  <div
                    className="inline-block px-5 py-2 rounded-full text-base font-semibold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                    }}
                  >
                    {schedule.specialty}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 space-y-2">
                  <div className="flex items-center justify-end gap-2">
                    <Clock
                      className="w-6 h-6"
                      style={{ color: settings.accentColor }}
                    />
                    <div
                      className="text-2xl font-bold"
                      style={{ color: settings.accentColor }}
                    >
                      {schedule.time}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <MapPin className="w-5 h-5 text-white" />
                    <div className="text-xl font-semibold text-white">
                      Room {schedule.room}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Duplicate set for seamless loop - only when scrolling */}
          {needsScroll &&
            schedules.map((schedule: any, idx: number) => (
              <div
                key={`second-${idx}`}
                className="relative rounded-2xl p-6 border-2 border-white/30 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg group"
                style={{ minHeight: `${itemHeight - 20}px` }}
              >
                {/* Subtle glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  }}
                />

                <div className="relative flex items-center justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-2xl font-bold text-white mb-2 truncate">
                      {schedule.name}
                    </h4>
                    <div
                      className="inline-block px-5 py-2 rounded-full text-base font-semibold text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                      }}
                    >
                      {schedule.specialty}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-2">
                    <div className="flex items-center justify-end gap-2">
                      <Clock
                        className="w-6 h-6"
                        style={{ color: settings.accentColor }}
                      />
                      <div
                        className="text-2xl font-bold"
                        style={{ color: settings.accentColor }}
                      >
                        {schedule.time}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <MapPin className="w-5 h-5 text-white" />
                      <div className="text-xl font-semibold text-white">
                        Room {schedule.room}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </div>
  );
};
