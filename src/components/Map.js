// src/components/Map.js
'use client'

import React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
})

export default function Map({ alerts }) {
  const center = [12.84189, 80.15483]  // VIT Chennai center

  return (
    <div className="w-full lg:w-2/3 h-[calc(100vh-12rem)]">
      <MapContainer
        center={center}
        zoom={12}  // Adjust zoom level for a better view of the area
        className="w-full h-full rounded-lg shadow-inner"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {alerts.map((alert) => (
          <Marker
            key={alert.$id}
            position={[alert.location.latitude, alert.location.longitude]}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">SOS Alert</p>
                <p>User ID: {alert.user_id}</p>
                <p>Status: {alert.status}</p>
                <p>Time: {new Date(alert.timestamp).toLocaleString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
