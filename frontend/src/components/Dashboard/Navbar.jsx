import React from "react";
import { useAuth } from "../../context/authContext";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Decide title based on current route
  const getTitle = () => {
    if (location.pathname.includes('departments')) return 'Department';
    if (location.pathname.includes('employees')) return 'Employee';
    if (location.pathname.includes('leave')) return 'Leave';
    if (location.pathname.includes('salary')) return 'Salary';
    return 'Dashboard';
  };

  return (
    <div
      className="h-16 flex items-center justify-between px-8 
                 bg-white border-b border-gray-200 sticky top-0 z-10"
    >
      {/* Dynamic title */}
      <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>

      <div className="flex items-center gap-4">
        <div className="text-right">
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
    </div>
  );
};

export default Navbar;
