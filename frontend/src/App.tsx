import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ProteinSearch from "./components/pages/ProteinSearch"
import ProteinDetails from "./components/pages/ProteinDetails"

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">Biographica</h1>
          </div>
        </header>

        <main className="flex-grow py-6">
          <Routes>
            <Route path="/" element={<ProteinSearch />} />
            <Route path="/proteins/:id" element={<ProteinDetails />} />
          </Routes>
        </main>

        <footer className="bg-white shadow-inner py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Biographica
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App

