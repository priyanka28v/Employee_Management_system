import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
  FaCheck,
  FaCheckDouble,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaTimesCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/authContext";
import axios from "axios";

const EmployeeNavbar = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const { data } = await axios.get("http://127.0.0.1:5000/api/notifications/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

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
    <nav className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 shadow-lg sticky top-0 z-30 px-6 py-3 md:px-8 flex items-center justify-between text-white">
      <div className="flex items-center justify-between w-full">

        {/* LEFT LOGO */}
        <div
          onClick={() => navigate("/employee-dashboard")}
          className="flex items-center gap-4 cursor-pointer"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 border-[3px] border-white rounded-md rotate-12"></div>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-wide text-white">WorkSphere</h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase">Employee Portal</p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">

          {/* NOTIFICATION BELL & DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative bg-slate-800 hover:bg-slate-700 transition p-2.5 rounded-xl cursor-pointer text-white"
              title="Notifications"
            >
              <FaBell className="text-lg" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
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
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div
            onClick={() => navigate("/employee-dashboard/profile")}
            className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <FaUserCircle className="text-3xl text-pink-400" />
            <div className="hidden sm:block">
              <p className="text-[10px] text-slate-400">Welcome Back</p>
              <p className="font-semibold text-xs tracking-wide">{user?.name || "Employee"}</p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 px-4 py-2 rounded-xl transition font-medium shadow-md text-sm cursor-pointer"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
