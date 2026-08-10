import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaCalendarCheck,
  FaArrowRight,
  FaPercentage,
  FaUser,
  FaBuilding,
  FaBriefcase,
  FaSpinner,
  FaExclamationTriangle,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const EmployeeHome = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, summaryRes, leaveRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/auth/verify", { headers }),
          axios.get("http://127.0.0.1:5000/api/dashboard/employee-summary", { headers }),
          axios.get("http://127.0.0.1:5000/api/leave/my-leaves", { headers }),
        ]);

        if (userRes.data.success) {
          setUser(userRes.data.user);
        }

        if (summaryRes.data.success) {
          setSummary(summaryRes.data.summary);
        }

        if (leaveRes.data.success) {
          setLeaves(leaveRes.data.leaves);
        }
      } catch (err) {
        console.error("Error loading employee home data:", err);
        setError(err.response?.data?.error || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleManualLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:5000/api/attendance/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (e) {
      console.log("Logout api notice:", e);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <FaSpinner className="animate-spin text-4xl text-red-500 mb-3" />
        <p className="font-semibold text-lg">Loading Your Employee Dashboard...</p>
      </div>
    );
  }

  const todayAtt = summary?.todayAttendance;
  const stats = summary?.stats;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8 space-y-8">
      {/* WELCOME HEADER CARD */}
      <div className="bg-gradient-to-r from-pink-600 to-red-500 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Employee Workspace
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome back, {user?.name || "Employee"}! 👋
          </h1>
          <p className="text-pink-100 text-sm md:text-base flex flex-wrap gap-4 pt-1">
            <span className="flex items-center gap-1.5">
              <FaBriefcase /> {user?.position || user?.designation || "Team Member"}
            </span>
            <span className="flex items-center gap-1.5">
              <FaBuilding /> {user?.department || "Operations"}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs bg-black/10 px-2 py-0.5 rounded">
              ID: {user?.employeeId || "EMP-001"}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/employee-dashboard/profile")}
            className="bg-white text-gray-800 hover:bg-gray-100 transition px-5 py-2.5 rounded-xl font-semibold text-sm shadow flex items-center gap-2"
          >
            <FaUser /> My Profile
          </button>
          <button
            onClick={handleManualLogout}
            className="bg-red-700 hover:bg-red-800 transition text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow flex items-center gap-2"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <FaExclamationTriangle className="text-xl shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* TODAY'S ATTENDANCE WIDGET */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaCalendarCheck className="text-red-500" /> Today's Attendance Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-xs font-medium text-gray-500">Attendance Status</p>
            <p className="mt-1 text-lg font-bold text-gray-800 flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  todayAtt?.status === "Present"
                    ? "bg-green-500"
                    : todayAtt?.status === "Late"
                    ? "bg-yellow-500"
                    : "bg-gray-400"
                }`}
              ></span>
              {todayAtt?.status || "Not Marked"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-xs font-medium text-gray-500">Login Time</p>
            <p className="mt-1 text-lg font-bold text-gray-800">
              {todayAtt?.loginTime || "--:--"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-xs font-medium text-gray-500">Logout Time</p>
            <p className="mt-1 text-lg font-bold text-gray-800">
              {todayAtt?.logoutTime || "Active Now"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-2xl border">
            <p className="text-xs font-medium text-gray-500">Monthly Attendance %</p>
            <p className="mt-1 text-lg font-bold text-blue-600 flex items-center gap-1">
              <FaPercentage className="text-sm" />
              {stats?.attendancePercentage || 100}%
            </p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Leaves Applied</p>
              <h2 className="text-3xl font-extrabold text-gray-800 mt-2">{leaves.length}</h2>
            </div>
            <div className="bg-pink-100 p-4 rounded-2xl">
              <FaClipboardList className="text-pink-500 text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Approved Leaves</p>
              <h2 className="text-3xl font-extrabold text-green-600 mt-2">
                {leaves.filter((l) => l.status === "approved").length}
              </h2>
            </div>
            <div className="bg-green-100 p-4 rounded-2xl">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Leaves</p>
              <h2 className="text-3xl font-extrabold text-yellow-600 mt-2">
                {leaves.filter((l) => l.status === "pending").length}
              </h2>
            </div>
            <div className="bg-yellow-100 p-4 rounded-2xl">
              <FaClock className="text-yellow-600 text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Present Days (Month)</p>
              <h2 className="text-3xl font-extrabold text-blue-600 mt-2">
                {stats?.presentDays || 0}
              </h2>
            </div>
            <div className="bg-blue-100 p-4 rounded-2xl">
              <FaCalendarCheck className="text-blue-600 text-2xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => navigate("/employee-dashboard/apply-leave")}
            className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Apply for Leave</h3>
                <p className="text-gray-500 text-xs mt-1">Submit a new leave application</p>
              </div>
              <FaArrowRight className="text-xl text-red-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => navigate("/employee-dashboard/my-leaves")}
            className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Leave Balance & History</h3>
                <p className="text-gray-500 text-xs mt-1">Check remaining leaves & status</p>
              </div>
              <FaArrowRight className="text-xl text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => navigate("/employee-dashboard/salary")}
            className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">My Salary Slip</h3>
                <p className="text-gray-500 text-xs mt-1">View monthly earnings & breakdown</p>
              </div>
              <FaArrowRight className="text-xl text-green-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* RECENT LEAVE ACTIVITIES */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Leave Requests</h2>
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 space-y-3">
          {leaves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-base font-semibold">No recent leave requests found</p>
              <p className="text-xs mt-1">Apply for leave when you need time off.</p>
            </div>
          ) : (
            leaves.slice(0, 5).map((leave) => (
              <div
                key={leave._id}
                className="flex items-center justify-between border rounded-2xl p-4 hover:bg-gray-50 transition"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{leave.reason}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {leave.leaveType} • {leave.startDate} to {leave.endDate} ({leave.totalDays} day{leave.totalDays > 1 ? "s" : ""})
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    leave.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : leave.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {leave.status}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default EmployeeHome;