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
  FaPaperPlane,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    // {
    //   name: "Dashboard",
    //   icon: <FaTachometerAlt />,
    //   path: "/employee-dashboard",
    // },
    {
      name: "My Attendance",
      icon: <FaCalendarCheck />,
      path: "/employee-dashboard/attendance",
    },
    {
      name: "Attendance Dashboard",
      icon: <FaChartBar />,
      path: "/employee-dashboard/attendance-dashboard",
    },
    {
      name: " Leaves ",
      icon: <FaPaperPlane />, // using imported icon or you can import appropriate
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
  ];

  return (
    <div className="w-[260px] h-screen bg-[#071028] text-white flex flex-col justify-between shadow-xl sticky top-0">
      {/* TOP */}
      <div>
        {/* MENU */}
        <div className="mt-7 flex flex-col gap-2 px-4">
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
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
        {/* <div className="p-3 mt-9 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#13203d] text-gray-300 w-full transition-all duration-300"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div> */}
      </div>

      {/* BOTTOM - Fixed typo: p-4 instead of p */}
    </div>
  );
};

export default Sidebar;
