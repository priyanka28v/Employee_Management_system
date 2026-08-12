import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { FaUserTie, FaBuilding, FaClock, FaRegCalendarAlt, FaMoneyBillWave, FaKey, FaChartBar, FaDatabase, FaRobot, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import HomeNavbar from "../components/HomeNavbar";

const Features = () => {
  const sections = [
    {
      icon: <FaUserTie className="text-5xl text-pink-600 mr-4" />, // Employee Management
      title: "Employee Management",
      points: [
        "Add, view and edit employee information",
        "Activate / deactivate employees",
        "Admin‑only management controls",
      ],
    },
    {
      icon: <FaBuilding className="text-5xl text-pink-600 mr-4" />, // Department Management
      title: "Department Management",
      points: [
        "Create and manage departments",
        "Assign employees to departments",
        "Activate / deactivate departments",
        "Proper handling of department‑related employee data",
      ],
    },
    {
      icon: <FaClock className="text-5xl text-pink-600 mr-4" />, // Attendance Management
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
      icon: <FaRegCalendarAlt className="text-5xl text-pink-600 mr-4" />, // Leave Management
      title: "Leave Management",
      points: [
        "Employees can apply for leave",
        "Admin reviews and approves/rejects requests",
        "Leave status tracking",
        "Available / used leave overview",
      ],
    },
    {
      icon: <FaMoneyBillWave className="text-5xl text-pink-600 mr-4" />, // Salary Management
      title: "Salary Management",
      points: [
        "Admin manages employee salary details",
        "Employees view their salary information",
        "Clear display of salary‑related details",
      ],
    },
    {
      icon: <FaKey className="text-5xl text-pink-600 mr-4" />, // Role‑Based Access
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100 text-gray-800">
      <HomeNavbar />
      {/* Hero */}
      <section className="py-16 px-6 md:px-12 lg:px-24 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-600 mb-4">
          EMS Features
        </h1>
        <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto">
          Explore the powerful modules that make WorkSphere the complete solution for modern HR and employee management.
        </p>
      </section>

      {/* Feature Sections */}
      <section className="flex-1 max-w-7xl mx-auto space-y-12 mb-12">
        {sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-[#fdf5f6]/10 backdrop-blur-lg rounded-2xl p-8 hover:shadow-xl transition-shadow border border-pink-200"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-shrink-0">{sec.icon}</div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  {sec.title}
                </h2>
                <ul className="list-disc list-inside space-y-1 text-gray-800">
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
      <section className="py-12 bg-[#fdf5f6]/5 backdrop-blur-md text-center rounded-2xl mx-6 md:mx-12 lg:mx-24 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Ready to experience the full power of WorkSphere?
        </h2>
        <Link
          to="/login"
          className="inline-block mt-4 px-8 py-3 bg-pink-500 hover:bg-pink-600 rounded-md text-white font-medium transition-colors shadow-md hover:shadow-lg"
        >
          Get Started / Login
        </Link>
      </section>

        <Footer />
    </div>
  );
};

export default Features;
