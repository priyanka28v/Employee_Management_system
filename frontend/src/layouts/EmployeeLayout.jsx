// layouts/EmployeeLayout.jsx

import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const EmployeeLayout = () => {
  return (
    <div className="flex bg-gray-100">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;