import React, { useEffect, useState } from "react";
import axios from "axios";
import SummaryCard from "./SummaryCard";
import LeaveCard from "./LeaveCard";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillWave,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaClock,
  FaPercentage,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://127.0.0.1:5000/api/dashboard/admin-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error("Error fetching admin summary:", err);
      setError(err.response?.data?.error || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <FaSpinner className="animate-spin text-4xl text-red-500 mb-3" />
        <p className="text-sm font-medium">Loading Dashboard Metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
        <FaExclamationTriangle className="text-xl shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SummaryCard
            icon={<FaUsers size={22} />}
            title="Total Employees"
            value={summary?.totalEmployees || 0}
            color="bg-teal-600"
          />

          <SummaryCard
            icon={<FaUserCheck size={22} />}
            title="Active Employees"
            value={summary?.activeEmployees || 0}
            color="bg-green-600"
          />

          <SummaryCard
            icon={<FaUserTimes size={22} />}
            title="Inactive Employees"
            value={summary?.inactiveEmployees || 0}
            color="bg-gray-600"
          />

          <SummaryCard
            icon={<FaMoneyBillWave size={22} />}
            title="Monthly Payout"
            value={`$${summary?.totalSalaryPayout?.toLocaleString() || 0}`}
            color="bg-red-500"
          />
        </div>
      </section>

      {/* Attendance Metrics */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Today's Attendance Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SummaryCard
            icon={<FaUserCheck size={22} />}
            title="Present Today"
            value={summary?.presentToday || 0}
            color="bg-emerald-500"
          />

          <SummaryCard
            icon={<FaClock size={22} />}
            title="Late Today"
            value={summary?.lateToday || 0}
            color="bg-amber-500"
          />

          <SummaryCard
            icon={<FaUserTimes size={22} />}
            title="Absent Today"
            value={summary?.absentToday || 0}
            color="bg-rose-500"
          />

          <SummaryCard
            icon={<FaPercentage size={22} />}
            title="Monthly Attendance %"
            value={`${summary?.attendancePercentage || 100}%`}
            color="bg-blue-600"
          />
        </div>
      </section>

      {/* Leave Details */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Leave Management Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <LeaveCard
            icon={<FaHourglassHalf size={22} />}
            title="Pending Requests"
            value={summary?.pendingLeaves || 0}
            color="bg-yellow-500"
          />

          <LeaveCard
            icon={<FaCheckCircle size={22} />}
            title="Approved Leaves"
            value={summary?.approvedLeaves || 0}
            color="bg-green-500"
          />

          <LeaveCard
            icon={<FaTimesCircle size={22} />}
            title="Rejected Leaves"
            value={summary?.rejectedLeaves || 0}
            color="bg-red-500"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminSummary;
