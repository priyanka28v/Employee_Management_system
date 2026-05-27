// components/Sidebar.jsx

import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaCog,
  FaSignOutAlt,
  FaChartBar,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/employee-dashboard",
    },

    {
      name: "My Attendance",
      icon: <FaCalendarCheck />,
      path: "/employee-dashboard/attendance",
    },

    // ✅ ATTENDANCE DASHBOARD
    {
      name: "Attendance Dashboard",
      icon: <FaChartBar />,
      path: "/employee-dashboard/attendance-dashboard",
    },

    {
      name: "My Leaves",
      icon: <FaClipboardList />,
      path: "/employee-dashboard/my-leaves",
    },

    {
      name: "Salary Slip",
      icon: <FaMoneyBillWave />,
      path: "/employee-dashboard/salary",
    },

    {
      name: "Profile",
      icon: <FaUsers />,
      path: "/employee-dashboard/profile",
    },

    {
      name: "Settings",
      icon: <FaCog />,
      path: "/employee-dashboard/settings",
    },
  ];

  return (
    <div className="w-[260px] min-h-screen bg-[#071028] text-white flex flex-col justify-between shadow-xl">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="p-6 border-b border-gray-700">

          <h1 className="text-3xl font-bold text-pink-500">
            WorkSphere
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Employee Management
          </p>
        </div>

        {/* MENU */}
        <div className="mt-6 flex flex-col gap-2 px-4">

          {menuItems.map((item, index) => (

            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/employee-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                    : "hover:bg-[#13203d] text-gray-300"
                }`
              }
            >

              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>

            </NavLink>
          ))}

        </div>
      </div>

      {/* BOTTOM */}
      <div className="p-4 border-t border-gray-700">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 py-3 rounded-xl font-semibold transition-all"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </div>
  );
};

export default Sidebar;