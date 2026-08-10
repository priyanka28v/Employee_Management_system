import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaClock,
  FaUserCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const token = localStorage.getItem("token");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://127.0.0.1:5000/api/attendance/admin", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10, search, date, status },
      });

      if (res.data?.success) {
        setAttendance(res.data.attendance || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch (err) {
      console.error("Error fetching admin attendance:", err);
      setError(err.response?.data?.error || "Failed to load attendance logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [page, search, date, status]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
          <p className="text-gray-500 text-sm">
            Monitor real-time employee check-ins, late minutes, and auto-logout logs ({totalRecords} records)
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaSearch className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search employee name/email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 outline-none bg-transparent text-sm text-gray-800"
          />
        </div>

        {/* Date Filter */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaCalendarAlt className="text-gray-400 mr-2 shrink-0" />
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 outline-none bg-transparent text-sm text-gray-800"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaFilter className="text-gray-400 mr-2 shrink-0" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 outline-none bg-transparent text-sm text-gray-800 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FaSpinner className="animate-spin text-3xl text-red-500 mb-2" />
            <p className="text-sm">Loading attendance logs...</p>
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base font-semibold">No attendance records found</p>
            <p className="text-xs mt-1">Adjust filters or date range.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Login Time</th>
                  <th className="py-3.5 px-4">Logout Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Late Mins</th>
                  <th className="py-3.5 px-4">Auto Logout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendance.map((log) => {
                  const emp = log.employeeId || {};
                  return (
                    <tr key={log._id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={emp.name || "Employee"}
                            className="w-9 h-9 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-bold text-gray-800">{emp.name || "Deleted User"}</p>
                            <p className="text-xs text-gray-500">{emp.email || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">{log.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">{log.loginTime || "-"}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">{log.logoutTime || "Active"}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            log.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : log.status === "Late"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-amber-600">
                        {log.lateMinutes ? `${log.lateMinutes} mins` : "On Time"}
                      </td>
                      <td className="py-3.5 px-4">
                        {log.isAutoLogout ? (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-medium">
                            Auto System
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Manual</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50 text-sm text-gray-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center gap-1"
              >
                <FaChevronLeft size={12} /> Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center gap-1"
              >
                Next <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAttendance;
