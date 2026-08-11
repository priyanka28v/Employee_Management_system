import React from "react";
import { Link } from "react-router-dom";
import { FaUserTie, FaBuilding, FaClock, FaRegCalendarAlt, FaMoneyBillWave, FaKey, FaChartBar, FaDatabase, FaRobot, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import HomeNavbar from "../components/HomeNavbar";

const Features = () => {
  const sections = [
    {
      icon: <FaUserTie className="text-5xl text-cyan-300" />, // Employee Management
      title: "Employee Management",
      points: [
        "Add, view and edit employee information",
        "Activate / deactivate employees",
        "Admin‑only management controls",
      ],
    },
    {
      icon: <FaBuilding className="text-5xl text-cyan-300" />, // Department Management
      title: "Department Management",
      points: [
        "Create and manage departments",
        "Assign employees to departments",
        "Activate / deactivate departments",
        "Proper handling of department‑related employee data",
      ],
    },
    {
      icon: <FaClock className="text-5xl text-cyan-300" />, // Attendance Management
      title: "Attendance Management",
      points: [
        "Automatic attendance when employee logs in",
        "Login and logout time tracking",
        "Present / Late status with minutes tracking",
        "Monthly attendance records and filtering",
        "Auto‑logout functionality",
      ],
    },
    {
      icon: <FaRegCalendarAlt className="text-5xl text-cyan-300" />, // Leave Management
      title: "Leave Management",
      points: [
        "Employees can apply for leave",
        "Admin reviews and approves/rejects requests",
        "Leave status tracking",
        "Available / used leave overview",
      ],
    },
    {
      icon: <FaMoneyBillWave className="text-5xl text-cyan-300" />, // Salary Management
      title: "Salary Management",
      points: [
        "Admin manages employee salary details",
        "Employees view their salary information",
        "Clear display of salary‑related details",
      ],
    },
    {
      icon: <FaKey className="text-5xl text-cyan-300" />, // Role‑Based Access
      title: "Role‑Based Access",
      points: [
        "Separate Admin and Employee access",
        "Admin dashboard with full management controls",
        "Employee dashboard with personal features",
        "Protected routes and permission handling",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white">
      <HomeNavbar />
      {/* Hero */}
      <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-300 mb-4">
          EMS Features
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
          Explore the powerful modules that make WorkSphere the complete solution for modern HR and employee management.
        </p>
      </section>

      {/* Feature Sections */}
      <section className="flex-1 mx-6 md:mx-12 lg:mx-24 space-y-12 mb-12">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">{sec.icon}</div>
              <div>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
                  {sec.title}
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-200">
                  {sec.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-white/5 backdrop-blur-md text-center rounded-2xl mx-6 md:mx-12 lg:mx-24 mb-12">
        <h2 className="text-3xl font-semibold text-cyan-300 mb-4">
          Ready to experience the full power of WorkSphere?
        </h2>
        <Link
          to="/login"
          className="inline-block mt-4 px-8 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white font-medium transition-colors"
        >
          Get Started / Login
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 text-center text-sm text-gray-400 mt-auto">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2">© {new Date().getFullYear()} WorkSphere EMS</p>
          <nav className="flex justify-center space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/features" className="hover:underline">Features</Link>
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Features;
