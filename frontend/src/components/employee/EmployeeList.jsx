import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaUserCheck,
  FaUserSlash,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
} from "react-icons/fa";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [departmentsList, setDepartmentsList] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch departments for filter
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/department", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success) {
          setDepartmentsList(res.data.departments || []);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, [token]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://127.0.0.1:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 8, search, department, status },
      });

      if (res.data?.success) {
        setEmployees(res.data.employees || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.response?.data?.error || "Failed to load employee list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search, department, status]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await axios.patch(
        `http://127.0.0.1:5000/api/employees/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        fetchEmployees();
      }
    } catch (err) {
      alert(err.response?.data?.error || "Failed to change status");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
          <p className="text-gray-500 text-sm">
            View, search, filter, and manage all employee profiles ({totalRecords} records)
          </p>
        </div>

        <button
          onClick={() => navigate("/admin-dashboard/add-employee")}
          className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
        >
          <FaUserPlus /> Add New Employee
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaSearch className="text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 outline-none bg-transparent text-sm text-gray-800"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaFilter className="text-gray-400 mr-2 shrink-0" />
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 outline-none bg-transparent text-sm text-gray-800 cursor-pointer"
          >
            <option value="">All Departments</option>
            {departmentsList.map((d) => (
              <option key={d._id} value={d.dep_name}>
                {d.dep_name}
              </option>
            ))}
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-2 text-sm">
          <FaExclamationCircle /> {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FaSpinner className="animate-spin text-3xl text-red-500 mb-2" />
            <p className="text-sm">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base font-semibold">No employees found</p>
            <p className="text-xs mt-1">Try resetting your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Emp ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Position</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-bold text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold">{emp.employeeId || "-"}</td>
                    <td className="py-3.5 px-4">{emp.department || "-"}</td>
                    <td className="py-3.5 px-4">{emp.position || emp.designation || "-"}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          emp.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin-dashboard/employees/${emp._id}`)}
                          title="View Profile Details"
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        >
                          <FaEye />
                        </button>
                        <button
  onClick={() => navigate(`/admin-dashboard/employees/edit/${emp._id}`)}
  title="Edit Employee"
  className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition"
>
  <FaEdit />
</button>
<button
  onClick={() => handleToggleStatus(emp._id, emp.status)}
  title={emp.status === "active" ? "Deactivate Account" : "Activate Account"}
  className={`p-2 rounded-lg transition ${
    emp.status === "active"
      ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
      : "bg-green-50 text-green-600 hover:bg-green-100"
  }`}
>
  {emp.status === "active" ? <FaUserSlash /> : <FaUserCheck />}
</button>
                      </div>
                    </td>
                  </tr>
                ))}
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

export default EmployeeList;
