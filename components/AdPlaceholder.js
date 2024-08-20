import React from "react";

function AdPlaceholder({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        zIndex: 1000, // Ensure it covers the entire screen above all other content
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "24px", marginBottom: "20px" }}>
          Full-Screen Ad Placeholder
        </p>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            cursor: "pointer",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
          }}
        >
          Close Ad
        </button>
      </div>
    </div>
  );
}

export default AdPlaceholder;
