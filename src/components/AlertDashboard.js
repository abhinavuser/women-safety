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
'use client'

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AlertList from "./AlertList"
import Map from "./Map"

export default function AlertDashboard() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Mock data for SOS alerts
    const mockAlerts = [
      {
        $id: "1",
        user_id: "User_123",
        location: { latitude: 41.8781, longitude: -87.6298 },
        timestamp: new Date(),
        status: "active",
      },
      {
        $id: "2",
        user_id: "User_456",
        location: { latitude: 34.0522, longitude: -118.2437 },
        timestamp: new Date(),
        status: "active",
      },
      {
        $id: "3",
        user_id: "User_789",
        location: { latitude: 40.7128, longitude: -74.006 },
        timestamp: new Date(),
        status: "active",
      },
    ]

    // Simulate fetching data
    setAlerts(mockAlerts)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl bg-white shadow-2xl rounded-lg overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        <AlertList alerts={alerts} setAlerts={setAlerts} />
        <Map alerts={alerts} />
      </div>
    </motion.div>
  )
}

