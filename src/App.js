// src/App.js
import React from "react";
import AlertDashboard from "./components/AlertDashboard";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">
        Women Safety SOS Dashboard
      </h1>
      <AlertDashboard />
    </div>
  );
}

export default App;
