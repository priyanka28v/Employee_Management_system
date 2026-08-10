import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSpinner,
  FaPercentage,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://127.0.0.1:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError(err.response?.data?.error || "Failed to load employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <FaSpinner className="animate-spin text-3xl text-red-500 mb-2" />
        <p className="text-sm">Loading profile details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        <p>{error || "Employee not found."}</p>
        <button
          onClick={() => navigate("/admin-dashboard/employees")}
          className="mt-4 px-4 py-2 bg-gray-800 text-white text-xs rounded-xl"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  const { employee, attendanceSummary, leaveSummary, salarySummary } = data;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* TOP NAV */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin-dashboard/employees")}
          className="p-2.5 bg-white text-gray-700 hover:bg-gray-100 rounded-xl shadow-sm border transition"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
          <p className="text-xs text-gray-500">
            Employee ID: <span className="font-mono font-bold text-gray-700">{employee.employeeId}</span> • {employee.status?.toUpperCase()}
          </p>
        </div>
      </div>

      {/* PROFILE HEADER CARD */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6">
        <img
          src={employee.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt={employee.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-red-500 shadow-md"
        />
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-xl font-bold text-gray-800">{employee.name}</h2>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                employee.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {employee.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-400" /> {employee.email}
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-400" /> {employee.phone || "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding className="text-gray-400" /> {employee.department || "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-gray-400" /> {employee.position || employee.designation || "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" /> Joined: {employee.joiningDate || "N/A"}
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" /> {employee.address || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaPercentage className="text-blue-600" /> Attendance Metrics
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Attendance Percentage</span>
              <span className="font-bold text-blue-600">{attendanceSummary?.attendancePercentage}%</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Present Days</span>
              <span className="font-semibold text-green-600">{attendanceSummary?.presentCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Late Days</span>
              <span className="font-semibold text-yellow-600">{attendanceSummary?.lateCount}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Absent Days</span>
              <span className="font-semibold text-red-600">{attendanceSummary?.absentCount}</span>
            </div>
          </div>
        </div>

        {/* Leave Balance Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaClock className="text-amber-500" /> Leave Balance
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Casual Leave (Remaining / Total)</span>
              <span className="font-bold">
                {12 - (leaveSummary?.leaveBalance?.casualLeave?.used || 0)} / 12
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Sick Leave (Remaining / Total)</span>
              <span className="font-bold">
                {10 - (leaveSummary?.leaveBalance?.sickLeave?.used || 0)} / 10
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Earned Leave (Remaining / Total)</span>
              <span className="font-bold">
                {15 - (leaveSummary?.leaveBalance?.earnedLeave?.used || 0)} / 15
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Pending Requests</span>
              <span className="font-bold text-amber-600">{leaveSummary?.pendingLeaves}</span>
            </div>
          </div>
        </div>

        {/* Salary Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-600" /> Salary Info
          </h3>
          {salarySummary?.currentSalary ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Net Salary</span>
                <span className="font-bold text-green-600">
                  ${salarySummary.currentSalary.netSalary || salarySummary.currentSalary.totalSalary}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Basic Salary</span>
                <span className="font-semibold">${salarySummary.currentSalary.basicSalary}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Allowances / Bonus</span>
                <span className="font-semibold text-blue-600">
                  +${(salarySummary.currentSalary.allowances || 0) + (salarySummary.currentSalary.bonus || 0)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Latest Payment Month</span>
                <span className="font-medium text-gray-800">
                  {salarySummary.currentSalary.month} {salarySummary.currentSalary.year}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">
              No salary record assigned yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
