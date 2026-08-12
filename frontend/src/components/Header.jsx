import React from "react";
import { useAuth } from "../context/authContext";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTitle = () => {
    if (location.pathname.includes('departments')) return 'Departments';
    if (location.pathname.includes('employees')) return 'Employees';
    if (location.pathname.includes('attendance')) return 'Attendance';
    if (location.pathname.includes('leave')) return 'Leave Requests';
    if (location.pathname.includes('salary')) return 'Salary';
    if (location.pathname.includes('profile')) return 'Profile';
    return 'Dashboard';
  };

  return (
    <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-20 px-6 py-3 md:px-8 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">|</h2>
      <div className="flex items-center gap-4">
        <div className="text-right mr-4">
          <p className="text-sm text-gray-500">Welcome</p>
          <p className="font-medium text-gray-800">{user?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm hover:bg-teal-700 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

