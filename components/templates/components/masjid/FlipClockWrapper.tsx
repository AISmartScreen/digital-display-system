import React, { useEffect, useRef } from "react";
import { flipClock, clock, theme, css as fcCss } from "flipclock";

const FlipClockWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container before creating clock
    containerRef.current.innerHTML = "";

    // Create custom styles to match your countdown design
    const customStyles = `
      .flip-clock-card {
        background-color: #1a1a1a !important;
        border-radius: 8px !important;
        border: 1px solid #0a0a0a !important;
        box-shadow: 
          0 8px 16px rgba(0,0,0,0.9),
          inset 0 -4px 8px rgba(0,0,0,0.6),
          inset 0 4px 8px rgba(255,255,255,0.03) !important;
        padding: 8px 16px !important;
        overflow: hidden !important;
      }
      .flip-clock-card-item-inner {
        padding: 0 !important;
        margin: 0 !important;
      }
      .flip-clock-card-item-inner .top,
      .flip-clock-card-item-inner .bottom {
        font-weight: 1000 !important;
        color: #ffffff !important;
        background: #0d0d0d !important;
        border-color: #000 !important;
        padding: 8px 0 !important;
        text-shadow:
          0 0 2px rgba(255,255,255,0.6),
          0 0 3px rgba(255,255,255,0.5) !important;
        font-family: inherit !important;
      }
      .flip-clock-divider {
        color: #666 !important;
        font-size: 32px !important;
        font-weight: 700 !important;
        animation: blink 1s step-start infinite !important;
      }
      @keyframes blink {
        0%, 49% {
          opacity: 1;
        }
        50%, 100% {
          opacity: 0;
        }
      }
    `;

    // Add custom styles to the document
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);

    const fc = flipClock({
      parent: containerRef.current,
      face: clock({
        format: "[hh]:[mm]:[ss]",
      }),
      theme: theme({
        dividers: ":",
        css: fcCss({
          fontSize: "288px", // Increased by 20% (240 * 1.2)
          lineHeight: "192px", // Increased by 20% (160 * 1.2)
        }),
        // Additional theme options if the library supports them
        faceWidth: 264, // Increased by 20% (220 * 1.2)
        faceHeight: 216, // Increased by 20% (180 * 1.2)
      }),
    });

    // Try to apply additional styling if possible
    setTimeout(() => {
      const cards = containerRef.current?.querySelectorAll(".flip-clock-card");
      cards?.forEach((card) => {
        (card as HTMLElement).style.padding = "8px 16px";
        (card as HTMLElement).style.width = "264px"; // Increased by 20%
        (card as HTMLElement).style.height = "216px"; // Increased by 20%
      });

      const tops = containerRef.current?.querySelectorAll(
        ".flip-clock-card-item-inner .top"
      );
      const bottoms = containerRef.current?.querySelectorAll(
        ".flip-clock-card-item-inner .bottom"
      );

      tops?.forEach((top) => {
        (top as HTMLElement).style.padding = "8px 0";
      });

      bottoms?.forEach((bottom) => {
        (bottom as HTMLElement).style.padding = "8px 0";
      });
    }, 100);

    return () => {
      fc.dispose?.(); // cleanup
      styleElement.remove(); // Remove custom styles
      if (containerRef.current) containerRef.current.innerHTML = ""; // clear on unmount
    };
  }, []);

  return (
    <div className="mb-6 mt-0 relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-2xl rounded-full"></div>
      <div className="relative">
        <div
          ref={containerRef}
          className="flex items-center justify-center gap-4"
        ></div>
      </div>
    </div>
  );
};

export default FlipClockWrapper;
