import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import HomeNavbar from "../../components/HomeNavbar";

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR - Fixed top */}
      <HomeNavbar />
      
      {/* Main Layout with Sidebar + Content */}
      <div className="flex pt"> {/* pt-[64px] navbar ki height ke hisaab se adjust karo */}
        
        {/* SIDEBAR - Fixed left */}
        <div className="fixed left-0 top-[80px] h-[calc(100vh-64px)] z-50">
          <Sidebar />
        </div>
        
        {/* PAGE CONTENT - Scrollable */}
        <div className="ml-[260px] flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;