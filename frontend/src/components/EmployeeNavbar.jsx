import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

const EmployeeNavbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-[#0f172a] text-white px-8 py-4 shadow-lg border-b border-slate-800">
      <div className="flex items-center justify-between">

        {/* LEFT LOGO */}
        <div
          onClick={() => navigate("/employee-dashboard")}
          className="flex items-center gap-4 cursor-pointer"
        >

          {/* LOGO */}
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 flex items-center justify-center shadow-lg">

            {/* INNER ICON */}
            <div className="w-6 h-6 border-[3px] border-white rounded-md rotate-12"></div>

            {/* GLOW */}
            <div className="absolute inset-0 rounded-2xl bg-white/10 blur-md"></div>
          </div>

          {/* BRAND */}
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              WorkSphere
            </h1>

            <p className="text-xs text-slate-400 tracking-wider uppercase">
              Employee Management Platform
            </p>
          </div>
        </div>


        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5">

          {/* NOTIFICATION */}
          <button className="relative bg-slate-800 hover:bg-slate-700 transition p-3 rounded-xl">
            <FaBell className="text-lg" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>


          {/* PROFILE */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-2xl transition cursor-pointer"
          >
            <FaUserCircle className="text-4xl text-pink-400" />

            <div>
              <p className="text-xs text-slate-400">
                Welcome Back
              </p>

              <p className="font-semibold text-sm tracking-wide">
                {user?.name || "Employee"}
              </p>
            </div>
          </div>


          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 px-5 py-3 rounded-xl transition font-medium shadow-md"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;

