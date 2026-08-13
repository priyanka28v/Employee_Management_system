import React from "react";
import { useAuth } from "../context/authContext";
import AdminSide from "../components/Dashboard/AdminSide.jsx";
// import Header from "../components/Header.jsx";
import AdminSummary from "../components/Dashboard/AdminSummary.jsx";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <AdminSide />

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col">
        {/* Navbar */}
        {/* <Header /> */}

        {/* Page Content */}
        <main className="flex-1 px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
