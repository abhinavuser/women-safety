'use client'

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import AlertDashboard from "./components/AlertDashboard"

const menuItems = [
  { title: "Dashboard", id: "dashboard" },
  { title: "Documentation", id: "documentation" },
  { title: "Surveillance", id: "surveillance" },
  { title: "About Us", id: "about" },
]

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState("dashboard")

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleMenuItemClick = (id) => {
    setActivePage(id)
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col">
      <header className="w-full bg-blue-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold">Women Safety SOS Dashboard</h1>
          <div className="w-6" /> {/* Placeholder for symmetry */}
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white p-4 shadow-lg z-50"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
            <nav className="mt-16">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full text-left py-2 px-4 rounded-md transition-colors ${
                        activePage === item.id
                          ? "bg-blue-700 text-white"
                          : "text-blue-100 hover:bg-blue-700"
                      }`}
                    >
                      {item.title}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {activePage === "dashboard" && <AlertDashboard />}
          {activePage === "documentation" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Documentation</h2>
              <p>Here you can add the documentation for your project.</p>
            </div>
          )}
          {activePage === "surveillance" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Surveillance</h2>
              <p>This section will integrate your ML model for surveillance.</p>
            </div>
          )}
          {activePage === "about" && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About Us</h2>
              <p>Add information about your organization or project here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}