import React from "react";

const TimeoutModal = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.75rem",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          animation: "modalFade 0.3s ease-in-out",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            margin: "0 auto 1rem",
            backgroundColor: "#fee2e2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: "0.75rem",
          }}
        >
          Time's Up!
        </h2>
        <p
          style={{
            color: "#4b5563",
            marginBottom: "1.5rem",
            lineHeight: "1.5",
          }}
        >
          Sorry, you've run out of time for this section. Your responses up to
          this point have been saved.
        </p>
      </div>
    </div>
  );
};

export default TimeoutModal;
