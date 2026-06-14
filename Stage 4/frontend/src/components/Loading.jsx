import React from "react";

function Loading() {
  const containerStyle = {
    position: "fixed",
    inset: 0,
    background: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  const spinnerStyle = {
    width: "45px",
    height: "45px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #f97316",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    </>
  );
}

export default Loading;
