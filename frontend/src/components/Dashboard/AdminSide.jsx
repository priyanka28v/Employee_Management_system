import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendar,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";

const AdminSide = () => {
  return (
    <div className="bg-white text-gray-700 h-screen fixed left-0 top-0 bottom-0 w-64 border-r shadow-sm">
      <div className="h-16 flex items-center justify-center border-b">
        <h3 className="text-2xl font-semibold text-teal-600">Employee MS</h3>
      </div>

      <div className="px-4 mt-6 space-y-2">
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white shadow" : "hover:bg-gray-100"}
             flex items-center space-x-4 py-2.5 px-4 rounded-lg transition`
          }
          end
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard"
          className="flex items-center space-x-4 py-2.5 px-4 rounded-lg
                     hover:bg-gray-100 transition"
        >
          <FaUsers />
          <span>Employee</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/departments"
          className={({ isActive }) =>
            `${isActive ? "bg-teal-600 text-white shadow" : "hover:bg-gray-100"}
             flex items-center space-x-4 py-2.5 px-4 rounded-lg transition`
          }
        >
          <FaBuilding />
          <span>Department</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard"
          className="flex items-center space-x-4 py-2.5 px-4 rounded-lg
                     hover:bg-gray-100 transition"
        >
          <FaCalendar />
          <span>Leave</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard"
          className="flex items-center space-x-4 py-2.5 px-4 rounded-lg
                     hover:bg-gray-100 transition"
        >
          <FaMoneyBillWave />
          <span>Salary</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard"
          className="flex items-center space-x-4 py-2.5 px-4 rounded-lg
                     hover:bg-gray-100 transition"
        >
          <FaCogs />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSide;
