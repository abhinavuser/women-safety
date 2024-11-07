/*
// src/components/AlertDashboard.js
import React, { useState, useEffect } from "react";
import { databases } from "../appwrite"; // Use Appwrite for fetching alerts
import AlertList from "../components/AlertList";
import Map from "./Map";

function AlertDashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await databases.listDocuments(
          "YOUR_DATABASE_ID",
          "YOUR_COLLECTION_ID"
        );
        setAlerts(response.documents);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full gap-6 p-6 bg-white shadow-lg rounded-lg h-screen">
      <AlertList alerts={alerts} />
      <Map alerts={alerts} />
    </div>
  );
}

export default AlertDashboard;
*/
// src/components/AlertDashboard.js
import React, { useState, useEffect } from "react";
import AlertList from "../components/AlertList";
import Map from "./Map";

function AlertDashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Mock data for SOS alerts
    const mockAlerts = [
      {
        $id: "1",
        user_id: "User_123",
        location: { latitude: 41.8781, longitude: -87.6298 },
        timestamp: new Date(),
      },
      {
        $id: "2",
        user_id: "User_456",
        location: { latitude: 34.0522, longitude: -118.2437 },
        timestamp: new Date(),
      },
      {
        $id: "3",
        user_id: "User_789",
        location: { latitude: 40.7128, longitude: -74.0060 },
        timestamp: new Date(),
      },
    ];

    // Simulate fetching data
    setAlerts(mockAlerts);
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full gap-6 p-6 bg-white shadow-lg rounded-lg h-screen">
      <AlertList alerts={alerts} />
      <Map alerts={alerts} />
    </div>
  );
}

export default AlertDashboard;

