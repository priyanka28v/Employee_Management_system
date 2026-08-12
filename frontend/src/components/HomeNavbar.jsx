import React from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../context/authContext";

const HomeNavbar = () => {
  const { user } = useAuth();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#071028] backdrop-blur-xl border-b border-gray-200 shadow-lg sticky top-0 z-30 px-6   flex items-center justify-between text-gray-800">
      {/* LOGO SECTION */}
      <div className="p-3 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-pink-500">WorkSphere</h1>
        <p className="text-sm text-gray-400 mt-1">Employee Management</p>
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
        {/* <Link to="/" className="text-cyan-100 hover:text-cyan-200 transition-colors">Home</Link> */}
        <Link
          to="/about"
          className="text-white hover:text-pink-500 hover:font-bold transition-colors"
        >
          About
        </Link>
        <Link
          to="/features"
          className="text-white hover:text-pink-500 hover:font-bold  transition-colors"
        >
          Features
        </Link>
        <Link
          to="/contact"
          className="text-white hover:text-pink-500 hover:font-bold  transition-colors"
        >
          Contact
        </Link>
        {user ? (
          // Notification icon for logged‑in users

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/employee-dashboard"
              className="text-white hover:text-pink-500 hover:font-bold  transition-colors"
            >
              Employee Dashboard
            </Link>
            <button className="relative text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full">
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-gray-900">
                3
              </span>
            </button>
            <button
             onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        ) : (
          // Login / Signup for guests
          <>
            <Link
              to="/login"
              className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition whitespace-nowrap"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;
