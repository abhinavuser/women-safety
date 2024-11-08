'use client'

import React from "react"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { firestore } from "../firebaseConfig"
import { doc, updateDoc } from "firebase/firestore"

export default function AlertList({ alerts, setAlerts }) {
  // Sort alerts by timestamp in descending order (most recent first)
  const sortedAlerts = [...alerts].sort((a, b) => 
    b.timestamp.toDate() - a.timestamp.toDate()
  )

  const markResolved = async (alertId) => {
    try {
      const alertRef = doc(firestore, "sos", alertId)
      await updateDoc(alertRef, { status: "resolved" })

      // Update the local alerts state to reflect the resolved status
      setAlerts(
        alerts.map((alert) =>
          alert.$id === alertId ? { ...alert, status: "resolved" } : alert
        )
      )
    } catch (error) {
      console.error("Error updating alert:", error)
    }
  }

  const getStatusDisplay = (status) => {
    switch(status?.toLowerCase()) {
      case "resolved":
        return (
          <span className="flex items-center text-green-500">
            <CheckCircle className="w-4 h-4 mr-1" />
            Resolved
          </span>
        )
      case "pending":
        return (
          <span className="flex items-center text-yellow-500">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Pending
          </span>
        )
      default:
        return (
          <span className="flex items-center text-red-500">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Active
          </span>
        )
    }
  }

  return (
    <div className="w-full lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200 overflow-y-auto max-h-[calc(100vh-12rem)]">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Active SOS Alerts</h2>
      <ul className="space-y-4">
        {sortedAlerts.map((alert) => {
          const { latitude, longitude, status } = alert || {}
          return (
            <motion.li
              key={alert.$id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                status === "resolved" 
                  ? "border-green-500" 
                  : status === "pending" 
                    ? "border-yellow-500" 
                    : "border-red-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">Alert ID: {alert.$id}</span>
                {getStatusDisplay(status)}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Name:</strong> {alert.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Location:</strong>{" "}
                {latitude && longitude
                  ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                  : "Location data unavailable"}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Timestamp:</strong> {new Date(alert.timestamp.toDate()).toLocaleString()}
              </p>
              {status !== "resolved" && (
                <button
                  onClick={() => markResolved(alert.$id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Mark as Resolved
                </button>
              )}
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

/*

'use client'

  import React from "react"
  import { motion } from "framer-motion"
  import { AlertTriangle, CheckCircle } from "lucide-react"

  export default function AlertList({ alerts, setAlerts }) {
    const markResolved = async (alertId) => {
      // In a real application, you would call your API here
      // For now, we'll just update the local state
      setAlerts(
        alerts.map((alert) =>
          alert.$id === alertId ? { ...alert, status: "resolved" } : alert
        )
      )
    }

    return (
      <div className="w-full lg:w-1/3 p-6 bg-gray-50 border-r border-gray-200 overflow-y-auto max-h-[calc(100vh-12rem)]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Active SOS Alerts</h2>
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <motion.li
              key={alert.$id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">Alert ID: {alert.$id}</span>
                {alert.status === "active" ? (
                  <span className="flex items-center text-red-500">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center text-green-500">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resolved
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>User ID:</strong> {alert.user_id}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Location:</strong> {alert.location.latitude.toFixed(4)},{" "}
                {alert.location.longitude.toFixed(4)}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}
              </p>
              {alert.status === "active" && (
                <button
                  onClick={() => markResolved(alert.$id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Mark as Resolved
                </button>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    )
  }

*/