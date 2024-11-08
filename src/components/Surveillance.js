import React, { useState, useEffect } from "react";

export default function Surveillance() {
  const [sosDetected, setSosDetected] = useState(false);

  const checkForSOS = async () => {
    try {
      const response = await fetch("http://localhost:5001/run_sos_model");
      const data = await response.json();
      setSosDetected(data.sos_detected);
    } catch (error) {
      console.error("Error fetching SOS data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkForSOS, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Surveillance</h2>
      <div className="mb-4">
        {sosDetected ? (
          <p className="text-red-600 font-semibold">SOS Alert Detected!</p>
        ) : (
          <p>Monitoring for SOS gestures...</p>
        )}
      </div>
      <div className="w-full h-96 overflow-hidden rounded-lg">
        <img
          src="http://localhost:5001/video_feed"
          alt="Live Video Feed"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
