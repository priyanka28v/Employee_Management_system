import React from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../context/authContext";

const HomeNavbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-[#f6f3f4] backdrop-blur-xl border-b border-gray-200 shadow-lg sticky top-0 z-30 px-6 py-3 md:px-8 flex items-center justify-between text-gray-800">
      {/* LOGO SECTION */}
      <div className="flex items-center gap-3 cursor-pointer flex-shrink-0" onClick={() => window.location.href = '/' }>
        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 flex items-center justify-center shadow-xl">
          <div className="w-6 h-6 border-2 border-white rounded-md rotate-12"></div>
          <div className="absolute inset-0 rounded-2xl bg-white/15 blur-md"></div>
        </div>
        <h1 className="text-2xl font-bold tracking-wide text-gray-800">WorkSphere</h1>
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
        {/* <Link to="/" className="text-cyan-100 hover:text-cyan-200 transition-colors">Home</Link> */}
        <Link to="/about" className="text-gray-800 hover:text-gray-900 transition-colors">About</Link>
        <Link to="/features" className="text-gray-800 hover:text-gray-900 transition-colors">Features</Link>
        <Link to="/contact" className="text-gray-800 hover:text-gray-900 transition-colors">Contact</Link>
        {user ? (
          // Notification icon for logged‑in users
          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="relative text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full">
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-gray-900">3</span>
            </button>
          </div>
        ) : (
          // Login / Signup for guests
          <>
            <Link to="/login" className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition whitespace-nowrap">Login</Link>
            <Link to="/signup" className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition whitespace-nowrap">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;