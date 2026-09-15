import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaCheck, FaCheckDouble, FaMoneyBillWave, FaCalendarCheck, FaTimesCircle, FaInfoCircle, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import axios from "axios";

const HomeNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get("http://127.0.0.1:5000/api/notifications/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch user notifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://127.0.0.1:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch("http://127.0.0.1:5000/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (item) => {
    const msg = (item.message || "").toLowerCase();
    const title = (item.title || "").toLowerCase();
    const type = (item.type || "").toLowerCase();

    if (type === "salary" || msg.includes("salary") || title.includes("salary")) {
      return <FaMoneyBillWave className="text-emerald-500 text-lg shrink-0" />;
    }
    if (msg.includes("approved")) {
      return <FaCalendarCheck className="text-green-500 text-lg shrink-0" />;
    }
    if (msg.includes("rejected")) {
      return <FaTimesCircle className="text-red-500 text-lg shrink-0" />;
    }
    return <FaInfoCircle className="text-pink-500 text-lg shrink-0" />;
  };

  return (
    <nav className="bg-[#071028] backdrop-blur-xl border-b border-gray-800 shadow-lg sticky top-0 z-40 px-6 flex items-center justify-between text-gray-800">
      {/* LOGO SECTION */}
      <div className="p-3">
        <Link to={user?.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"}>
          <h1 className="text-3xl font-bold text-pink-500 hover:text-pink-400 transition-colors">WorkSphere</h1>
          <p className="text-xs text-gray-400">Employee Management Platform</p>
        </Link>
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
        <Link
          to="/about"
          className="text-white hover:text-pink-500 transition-colors text-sm font-medium"
        >
          About
        </Link>
        <Link
          to="/features"
          className="text-white hover:text-pink-500 transition-colors text-sm font-medium"
        >
          Features
        </Link>

        {user ? (
          <div className="flex items-center gap-3 flex-shrink-0 relative" ref={dropdownRef}>
            <Link
              to={user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard"}
              className="text-white hover:text-pink-400 transition-colors text-sm font-medium bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
            >
              {user.role === "admin" ? "Admin Panel" : "Dashboard"}
            </Link>

            {/* NOTIFICATION BELL BUTTON */}
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative text-white hover:text-pink-300 transition-colors p-2.5 hover:bg-white/10 rounded-full cursor-pointer focus:outline-none"
              title="Notifications"
            >
              <FaBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-[#071028] animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN MODAL */}
            {showDropdown && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-base">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-pink-100 text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-pink-600 hover:text-pink-700 font-semibold flex items-center gap-1 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded transition"
                      >
                        <FaCheckDouble /> Read all
                      </button>
                    )}
                    <button
                      onClick={() => setShowDropdown(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>

                {/* NOTIFICATIONS LIST */}
                <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <FaBell className="mx-auto text-3xl mb-2 opacity-50" />
                      <p className="text-sm font-medium">No notifications yet</p>
                      <p className="text-xs mt-1">Updates on salary and leaves will appear here.</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item._id}
                        className={`p-3 rounded-xl border text-xs transition flex items-start justify-between gap-3 ${
                          !item.read
                            ? "bg-pink-50/60 border-pink-200"
                            : "bg-slate-50 border-slate-100 text-slate-600"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">{getNotificationIcon(item)}</div>
                          <div>
                            {item.title && (
                              <p className="font-bold text-slate-800 text-xs mb-0.5">{item.title}</p>
                            )}
                            <p className={`${!item.read ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                              {item.message}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {!item.read && (
                          <button
                            onClick={() => markAsRead(item._id)}
                            className="text-pink-600 hover:text-pink-800 p-1 shrink-0"
                            title="Mark as read"
                          >
                            <FaCheck size={12} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* FOOTER LINK */}
                <div className="border-t pt-2 text-center">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      if (user?.role === "admin") {
                        navigate("/admin-dashboard/notifications");
                      } else {
                        navigate("/employee-dashboard/my-leaves");
                      }
                    }}
                    className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                  >
                    View All Activity
                  </button>
                </div>
              </div>
            )}

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm font-medium whitespace-nowrap shadow-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          // Guests
          <>
            <Link
              to="/login"
              className="ml-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm font-medium whitespace-nowrap"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium whitespace-nowrap"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;
