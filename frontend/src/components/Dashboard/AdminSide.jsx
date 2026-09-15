import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

import {
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaCog,
  FaClipboardList,
  FaUserShield,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";

const AdminSide = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navStyle = ({ isActive }) =>
    `flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 font-medium
     ${
       isActive
         ? "bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white shadow-lg"
         : "text-gray-600 hover:bg-[#f3f7f7] hover:text-[#0f766e]"
     }`;

  return (
    <div className="w-72 h-screen bg-[#f7fbfb] border-r border-gray-200 fixed left-0 top-0 flex flex-col justify-between overflow-y-auto">

      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div className="px-7 pt-8 pb-6 border-b bg-white">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#14b8a6] to-[#115e59] flex items-center justify-center text-white shadow-lg text-2xl">
              <FaUserShield />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                WorkSphere
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Admin Workspace
              </p>
            </div>

          </div>

        </div>

        {/* MENU */}
        <div className="px-4 py-6 space-y-2 overflow-y-auto flex-1">

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-3 mb-4">
            Main Menu
          </p>

          {/* DASHBOARD */}
          <NavLink
            to="/admin-dashboard"
            end
            className={navStyle}
          >
            <FaTachometerAlt size={18} />
            <span>Dashboard</span>
          </NavLink>

          {/* EMPLOYEES */}
          <NavLink
            to="/admin-dashboard/employees"
            className={navStyle}
          >
            <FaUsers size={18} />
            <span>Employees</span>
          </NavLink>

          {/* DEPARTMENTS */}
          <NavLink
            to="/admin-dashboard/departments"
            className={navStyle}
          >
            <FaBuilding size={18} />
            <span>Departments</span>
          </NavLink>

          {/* ATTENDANCE */}
          <NavLink
            to="/admin-dashboard/attendance"
            className={navStyle}
          >
            <FaClipboardList size={18} />
            <span>Attendance</span>
          </NavLink>

          {/* LEAVES */}
          <NavLink
            to="/admin-dashboard/leaves"
            className={navStyle}
          >
            <FaCalendarAlt size={18} />
            <span>Leave Requests</span>
          </NavLink>

          {/* NOTIFICATIONS */}
          <NavLink
            to="/admin-dashboard/notifications"
            className={navStyle}
          >
            <FaBell size={18} />
            <span>Notifications</span>
          </NavLink>

          {/* SALARY */}
          <NavLink
            to="/admin-dashboard/salary"
            className={navStyle}
          >
            <FaMoneyBillWave size={18} />
            <span>Salary</span>
          </NavLink>

          {/* SETTINGS / PROFILE */}
          <NavLink
            to="/admin-dashboard/profile"
            className={navStyle}
          >
            <FaCog size={18} />
            <span>Profile</span>
          </NavLink>

          {/* LOGOUT BUTTON IN MENU */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 font-medium text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <FaSignOutAlt size={18} />
            <span>Logout</span>
          </button>

        </div>

      </div>

      {/* BOTTOM PROFILE CARD */}
      <div className="p-5">

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 space-y-3">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#14b8a6] to-[#0f766e] text-white flex items-center justify-center text-xl font-bold shadow-md shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div className="overflow-hidden flex-1">
              <h3 className="font-semibold text-gray-800 text-base truncate">
                {user?.name || "Admin"}
              </h3>

              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@gmail.com"}
              </p>
            </div>

          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 transition-all duration-200 font-medium text-sm border border-red-100 shadow-xs cursor-pointer"
          >
            <FaSignOutAlt size={16} />
            <span>Logout</span>
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminSide;