'use client'

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AlertList from "./AlertList"
import Map from "./Map"
import { collection, getDocs } from "firebase/firestore"
import { firestore } from "../firebaseConfig" // Ensure Firestore instance is imported

export default function AlertDashboard() {
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "sos"));
        const alertsData = querySnapshot.docs.map(doc => ({
          $id: doc.id,
          ...doc.data(),
        }));
        setAlerts(alertsData);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    }

    fetchAlerts()
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

/*

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
        location: { latitude: 12.84189, longitude: 80.15483 }, // VIT Chennai
        timestamp: new Date(),
        status: "active",
      },
      {
        $id: "2",
        user_id: "User_456",
        location: { latitude: 13.060416, longitude: 80.249634 }, // Nearby Location
        timestamp: new Date(),
        status: "active",
      },
      {
        $id: "3",
        user_id: "User_789",
        location: { latitude: 12.9000, longitude: 80.2000 }, // Another nearby location
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

*/
