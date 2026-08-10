import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const AdminSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [employeesList, setEmployeesList] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    basicSalary: "",
    allowances: "",
    bonus: "",
    deductions: "",
    month: "January",
    year: new Date().getFullYear().toString(),
    paymentStatus: "Paid",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const token = localStorage.getItem("token");

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://127.0.0.1:5000/api/salary/admin", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 8, search, month, year },
      });

      if (res.data?.success) {
        setSalaries(res.data.salaries || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalRecords(res.data.totalRecords || 0);
      }
    } catch (err) {
      console.error("Error fetching admin salaries:", err);
      setError(err.response?.data?.error || "Failed to load salary records");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesForModal = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/employees?limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setEmployeesList(res.data.employees || []);
      }
    } catch (err) {
      console.error("Error fetching employees list:", err);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, [page, search, month, year]);

  const handleOpenModal = () => {
    fetchEmployeesForModal();
    setShowModal(true);
    setFormError("");
    setFormSuccess("");
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSalarySubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.employeeId || !form.basicSalary || !form.month || !form.year) {
      setFormError("Employee, Basic Salary, Month, and Year are required.");
      return;
    }

    setSubmitLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/salary/add", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setFormSuccess("Salary record saved successfully!");
        setTimeout(() => {
          setShowModal(false);
          fetchSalaries();
        }, 1200);
      }
    } catch (err) {
      console.error("Error saving salary:", err);
      setFormError(err.response?.data?.error || "Failed to save salary");
    } finally {
      setSubmitLoading(false);
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Salary Management</h1>
          <p className="text-gray-500 text-sm">
            Add payouts, view salary history, and inspect net salary calculations ({totalRecords} records)
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="bg-red-500 hover:bg-red-600 transition text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md"
        >
          <FaPlus /> Add / Update Salary
        </button>
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

        {/* Month Filter */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaFilter className="text-gray-400 mr-2 shrink-0" />
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 outline-none bg-transparent text-sm text-gray-800 cursor-pointer"
          >
            <option value="">All Months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div className="flex items-center border rounded-xl px-3 bg-gray-50">
          <FaFilter className="text-gray-400 mr-2 shrink-0" />
          <input
            type="number"
            placeholder="Year (e.g. 2026)"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
            className="w-full py-2.5 outline-none bg-transparent text-sm text-gray-800"
          />
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
            <p className="text-sm">Loading salary records...</p>
          </div>
        ) : salaries.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-base font-semibold">No salary records found</p>
            <p className="text-xs mt-1">Click 'Add / Update Salary' to create payout entries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase border-b">
                <tr>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Month / Year</th>
                  <th className="py-3.5 px-4">Basic</th>
                  <th className="py-3.5 px-4">Allowances</th>
                  <th className="py-3.5 px-4">Bonus</th>
                  <th className="py-3.5 px-4">Deductions</th>
                  <th className="py-3.5 px-4">Net Salary</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {salaries.map((sal) => {
                  const emp = sal.employeeId || {};
                  const net = sal.netSalary || sal.totalSalary;
                  return (
                    <tr key={sal._id} className="hover:bg-gray-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt={emp.name || "User"}
                            className="w-9 h-9 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-bold text-gray-800">{emp.name || "Employee"}</p>
                            <p className="text-xs text-gray-500">{emp.department || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">
                        {sal.month} {sal.year}
                      </td>
                      <td className="py-3.5 px-4">${sal.basicSalary}</td>
                      <td className="py-3.5 px-4 text-blue-600">+${sal.allowances || 0}</td>
                      <td className="py-3.5 px-4 text-emerald-600">+${sal.bonus || 0}</td>
                      <td className="py-3.5 px-4 text-red-500">-${sal.deductions || 0}</td>
                      <td className="py-3.5 px-4 font-bold text-green-700 text-base">${net}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                            sal.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {sal.status || "Paid"}
                        </span>
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

      {/* ADD / UPDATE SALARY MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-600" /> Assign Employee Salary
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <FaTimes />
              </button>
            </div>

            {formError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-xl text-sm">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-100 text-green-700 p-3 rounded-xl text-sm font-semibold flex items-center gap-2">
                <FaCheckCircle /> {formSuccess}
              </div>
            )}

            <form onSubmit={handleAddSalarySubmit} className="space-y-4 text-sm">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Select Employee *</label>
                <select
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleFormChange}
                  className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                  required
                >
                  <option value="">Choose Employee</option>
                  {employeesList.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name} ({e.employeeId || e.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Basic Salary ($) *</label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={form.basicSalary}
                    onChange={handleFormChange}
                    placeholder="3000"
                    className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Allowances ($)</label>
                  <input
                    type="number"
                    name="allowances"
                    value={form.allowances}
                    onChange={handleFormChange}
                    placeholder="500"
                    className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Bonus ($)</label>
                  <input
                    type="number"
                    name="bonus"
                    value={form.bonus}
                    onChange={handleFormChange}
                    placeholder="200"
                    className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Deductions ($)</label>
                  <input
                    type="number"
                    name="deductions"
                    value={form.deductions}
                    onChange={handleFormChange}
                    placeholder="100"
                    className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Month *</label>
                  <select
                    name="month"
                    value={form.month}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={form.year}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Status</label>
                  <select
                    name="paymentStatus"
                    value={form.paymentStatus}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-xl outline-none bg-gray-50"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 transition text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  {submitLoading ? <FaSpinner className="animate-spin" /> : "Save Salary Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSalary;
