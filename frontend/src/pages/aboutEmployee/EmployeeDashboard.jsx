import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const EmployeeDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* PAGE CONTENT */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
