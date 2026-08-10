import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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
} from 'react-icons/fa';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    department: '',
    position: '',
    joiningDate: '',
    address: '',
    // optional fields for future extensions
  });
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // New state for leave allocation
  const [leaveForm, setLeaveForm] = useState({
    casualLeave: '',
    sickLeave: '',
    earnedLeave: '',
    privilegeLeave: '',
    compOff: '',
  });
  // New state for salary allocation
  const [salaryForm, setSalaryForm] = useState({
    basicSalary: '',
    allowances: '',
    deductions: '',
    bonus: '',
    month: '',
    year: '',
  });
  const [showLeaveSalary, setShowLeaveSalary] = useState(false);
  // Track if leave & salary have been added
  const [leaveSalaryAdded, setLeaveSalaryAdded] = useState(false);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success) {
          const { employee } = res.data;
          setForm({
            name: employee.name || '',
            email: employee.email || '',
            phone: employee.phone || '',
            dob: employee.dob || '',
            department: employee.department || '',
            position: employee.position || employee.designation || '',
            joiningDate: employee.joiningDate || '',
            address: employee.address || '',
          });
        }
      } catch (err) {
        console.error('Error loading employee:', err);
        setError(err.response?.data?.error || 'Failed to load employee');
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/api/department', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.success) {
          setDepartmentsList(res.data.departments || []);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };

    fetchEmployee();
    fetchDepartments();
    fetchLeaveSalaryStatus();
  }, [id, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLeaveChange = (e) =>
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });

  const handleSalaryChange = (e) =>
    setSalaryForm({ ...salaryForm, [e.target.name]: e.target.value });
const fetchLeaveSalaryStatus = async () => {
  try {
    const [leaveRes, salaryRes] = await Promise.all([
      axios.get(`http://127.0.0.1:5000/api/employees/${id}/leave-allocation`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
      axios.get(`http://127.0.0.1:5000/api/employees/${id}/salary`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
    ]);
    if (leaveRes?.data?.success && salaryRes?.data?.success) {
      setLeaveSalaryAdded(true);
    }
  } catch (err) {
    console.error('Error checking leave/salary status', err);
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.department || !form.position) {
      setError('Please fill in all mandatory fields (*)');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.put(`http://127.0.0.1:5000/api/employees/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setSuccess('Employee updated successfully');
        setTimeout(() => navigate('/admin-dashboard/employees'), 1200);
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      setError(err.response?.data?.error || 'Failed to update employee');
    } finally {
      setSaving(false);
    }
  };

  // Submit leave and salary allocation
  const handleLeaveSalarySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      // Update leave allocation
      await axios.patch(`http://127.0.0.1:5000/api/employees/${id}/leave-allocation`, leaveForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Update salary
      await axios.patch(`http://127.0.0.1:5000/api/employees/${id}/salary`, salaryForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Leave & Salary updated successfully');
      setLeaveSalaryAdded(true);
    } catch (err) {
      console.error('Error updating leave/salary:', err);
      setError(err.response?.data?.error || 'Failed to update leave/salary');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        <FaSpinner className="animate-spin text-3xl text-red-500 mb-2" />
        <p className="text-sm ml-2">Loading employee data...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <button
            onClick={() => navigate('/admin-dashboard/employees')}
            className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Employee</h1>
            <p className="text-xs text-gray-500">Update employee information</p>
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
            <FaCheckCircle className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Conditionally render main employee form only after leave & salary added */}
        {leaveSalaryAdded ? (
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

            {/* Date of Birth */}
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

            {/* Submit */}
            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 transition text-white py-3 rounded-xl font-bold text-base shadow-md flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Update Employee'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-4 text-gray-700">
            Please add Leave & Salary information before editing employee details.
            
            {/* Toggle Leave & Salary Form */}
            {!leaveSalaryAdded && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowLeaveSalary(!showLeaveSalary)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  {showLeaveSalary ? 'Hide Leave & Salary' : 'Add / Update Leave & Salary'}
                </button>
              </div>
            )}

            {showLeaveSalary && (
              <form onSubmit={handleLeaveSalarySubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Leave/Salary inputs would go here */}
                 <button type="submit" className="bg-green-600 text-white p-2 rounded">
                  {saving ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    'Update Leave & Salary'
                  )}
                 </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditEmployee;
