// src/components/Map.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Map({ alerts }) {
  const center = [41.8781, -87.6298]; // Example: Chicago coordinates

  return (
    <div className="flex-1 h-96 md:h-auto relative">
      <MapContainer
        center={center}
        zoom={10}
        className="w-full h-full rounded-lg shadow"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {alerts.map(alert => (
          <Marker key={alert.id} position={[alert.location.latitude, alert.location.longitude]}>
            <Popup>
              SOS Alert from {alert.user_id} at {new Date(alert.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
