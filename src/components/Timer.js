import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

const Timer = ({ isActive, onTimeUp }) => {
  const [timeDisplay, setTimeDisplay] = useState("01:00");
  const endTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && !endTimeRef.current) {
      // Set end time when timer becomes active
      endTimeRef.current = Date.now() + 1 * 60 * 1000; // 20 minutes in milliseconds
    }

    const updateTimer = () => {
      if (!endTimeRef.current) return;

      const now = Date.now();
      const timeLeft = Math.max(0, endTimeRef.current - now);

      if (timeLeft === 0) {
        clearInterval(timerRef.current);
        onTimeUp?.();
        return;
      }

      // Convert to minutes and seconds
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      setTimeDisplay(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    };

    if (isActive) {
      // Update immediately and then every 100ms
      updateTimer();
      timerRef.current = setInterval(updateTimer, 100);
    } else {
      clearInterval(timerRef.current);
      endTimeRef.current = null;
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isActive, onTimeUp]);

  const getTimerColor = () => {
    const [minutes] = timeDisplay.split(":").map(Number);
    if (minutes === 0) return "#dc2626"; // Red for last minute
    if (minutes <= 5) return "#ea580c"; // Orange for last 5 minutes
    return "#1e293b"; // Default blue-gray
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        color: getTimerColor(),
        border: "1px solid #e5e7eb",
        fontFamily: "monospace",
        zIndex: 1000,
        transition: "color 0.3s ease",
      }}
    >
      <Clock size={25} />
      <span style={{ fontSize: "1.5rem", fontWeight: "500" }}>
        {timeDisplay}
      </span>
    </div>
  );
};

export default Timer;
