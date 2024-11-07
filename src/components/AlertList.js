// src/components/AlertList.js
import React from "react";
import axios from "axios";

function AlertList({ alerts }) {
  const markResolved = async (alertId) => {
    try {
      await axios.put(`http://localhost:5000/api/alerts/${alertId}`, { status: "resolved" });
      alert("Alert marked as resolved");
    } catch (error) {
      console.error("Error updating alert:", error);
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">SOS Alerts</h2>
      <ul>
        {alerts.map(alert => (
          <li key={alert.$id} className="mb-4 p-4 border rounded-lg shadow">
            <p><strong>User ID:</strong> {alert.user_id}</p>
            <p><strong>Location:</strong> {alert.location.latitude}, {alert.location.longitude}</p>
            <p><strong>Timestamp:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
            <button 
              onClick={() => markResolved(alert.$id)}
              className="px-4 py-2 bg-blue-500 text-white rounded mt-2 hover:bg-blue-600"
            >
              Mark as Resolved
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlertList;
