import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaBriefcase,
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";

const AddEmployee = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    department: "",
    position: "",
    joiningDate: "",
    address: "",
  });

  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.department || !form.position) {
      setError("Please fill in all mandatory fields (*)");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/employees/add", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success) {
        setSuccess(`Employee ${res.data.employee?.name} added successfully with ID ${res.data.employee?.employeeId}`);
        setTimeout(() => {
          navigate("/admin-dashboard/employees");
        }, 1500);
      }
    } catch (err) {
      console.error("Error adding employee:", err);
      setError(err.response?.data?.error || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        {/* TOP BAR */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <button
            onClick={() => navigate("/admin-dashboard/employees")}
            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Employee</h1>
            <p className="text-xs text-gray-500">
              Create a new user account with role 'Employee'
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            <FaExclamationCircle className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-semibold">
            <FaCheckCircle className="shrink-0 text-base" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name *</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaUser className="text-gray-400 shrink-0" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address *</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaEnvelope className="text-gray-400 shrink-0" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password *</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaLock className="text-gray-400 shrink-0" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Initial password"
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaPhone className="text-gray-400 shrink-0" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
              />
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaCalendarAlt className="text-gray-400 shrink-0" />
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
              />
            </div>
          </div>

          {/* Joining Date */}
          <div>
            <label className="text-sm font-medium text-gray-700">Joining Date</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaCalendarAlt className="text-gray-400 shrink-0" />
              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="text-sm font-medium text-gray-700">Department *</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaBuilding className="text-gray-400 shrink-0 mr-2" />
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800 cursor-pointer"
                required
              >
                <option value="">Select Department</option>
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
          </div>

          {/* Position */}
          <div>
            <label className="text-sm font-medium text-gray-700">Job Designation / Position *</label>
            <div className="flex items-center border rounded-xl px-3 mt-1 bg-gray-50">
              <FaBriefcase className="text-gray-400 shrink-0" />
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Residential Address</label>
            <div className="flex items-start border rounded-xl px-3 py-2 mt-1 bg-gray-50">
              <FaMapMarkerAlt className="text-gray-400 shrink-0 mt-2 mr-2" />
              <textarea
                name="address"
                rows={2}
                value={form.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full outline-none bg-transparent text-sm text-gray-800"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 transition text-white py-3 rounded-xl font-bold text-base shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating Employee...</span>
                </>
              ) : (
                "Save & Register Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
