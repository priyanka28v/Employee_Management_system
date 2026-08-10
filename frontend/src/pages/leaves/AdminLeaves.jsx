import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const token = localStorage.getItem("token");

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://127.0.0.1:5000/api/leave/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10, search, status },
      });

      if (res.data?.success) {
        setLeaves(res.data.leaves || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch (err) {
      console.error("Error fetching admin leaves:", err);
      setError(err.response?.data?.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, search, status]);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:5000/api/leave/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        fetchLeaves();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve leave");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:5000/api/leave/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        fetchLeaves();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject leave");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leave Approvals & Management</h1>
          <p className="text-gray-500 text-sm">
            Review employee leave requests and update status ({totalRecords} requests)
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaSearch className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search applicant name/email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
            <p className="text-sm">Loading leave applications...</p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base font-semibold">No leave requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">
                <tr>
                  <th className="py-3.5 px-4">Applicant</th>
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Days</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.map((leave) => {
                  const applicant = leave.user || {};
                  return (
                    <tr key={leave._id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={applicant.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={applicant.name || "User"}
                            className="w-9 h-9 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-bold text-gray-800">{applicant.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{applicant.department || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-700">{leave.leaveType}</td>
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-600">
                        {leave.startDate} → {leave.endDate}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">{leave.totalDays}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-gray-600" title={leave.reason}>
                        {leave.reason}
                      </td>
                      <td className="py-3.5 px-4">
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
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {leave.status === "pending" ? (
                            <>
                              <button
                                onClick={() => handleApprove(leave._id)}
                                title="Approve Leave"
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 transition text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                              >
                                <FaCheckCircle /> Approve
                              </button>
                              <button
                                onClick={() => handleReject(leave._id)}
                                title="Reject Leave"
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 transition text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
                              >
                                <FaTimesCircle /> Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Completed</span>
                          )}
                        </div>
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

export default AdminLeaves;
