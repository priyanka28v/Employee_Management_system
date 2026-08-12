import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUmbrellaBeach,
  FaMedkit,
  FaGift,
  FaClock,
  FaInfoCircle,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";

const ApplyLeave = () => {
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // State for edit mode and route params
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [leaveBalance, setLeaveBalance] = useState([]); // Initialize as empty array

  // Fetch leave balance for the logged‑in employee
  const fetchLeaveBalance = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/leave/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Transform object balance into an array for UI rendering
      const bal = res.data.balance || {};
      const typeMap = {
        casualLeave: 'Casual Leave',
        sickLeave: 'Sick Leave',
        earnedLeave: 'Earned Leave',
        privilegeLeave: 'Privilege Leave',
        compOff: 'Comp Off',
      };
      const colorMap = {
        casualLeave: 'blue',
        sickLeave: 'red',
        earnedLeave: 'green',
        privilegeLeave: 'purple',
        compOff: 'orange',
      };
      const arr = [];
      Object.keys(typeMap).forEach((field) => {
        if (bal[field]) {
          arr.push({
            type: typeMap[field],
            used: bal[field].used,
            total: bal[field].total,
            color: colorMap[field] || 'gray',
          });
        }
      });
      setLeaveBalance(arr);
    } catch (err) {
      console.error('Error fetching leave balance', err);
      setLeaveBalance([]);
    }
  };

  // Load balance on component mount
  useEffect(() => {
    if (token) fetchLeaveBalance();
  }, [token]);

  // Fetch leave for edit
  const fetchLeaveById = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const leave = res.data.leave;

      setForm({
        leaveType: leave.leaveType || "",
        startDate: leave.startDate ? leave.startDate.split("T")[0] : "",
        endDate: leave.endDate ? leave.endDate.split("T")[0] : "",
        reason: leave.reason || "",
      });

      setIsEdit(true);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to fetch leave details",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchLeaveById();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked', form);

    // Date validation
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Dates",
        text: "End date cannot be before start date",
      });
    }

    // Compute total days (inclusive)
    const totalDays = Math.ceil(
      (new Date(form.endDate) - new Date(form.startDate)) /
        (1000 * 60 * 60 * 24)
    ) + 1;

    // --- Client‑side validation: ensure requested days <= remaining balance ---
    // Ensure leaveBalance is an array before using find
    // if (Array.isArray(leaveBalance) && leaveBalance.length > 0) {
    //   const balanceEntry = leaveBalance.find((b) => b.type === form.leaveType);
    //   if (balanceEntry) {
    //     const remaining = balanceEntry.total - balanceEntry.used;
    //     if (totalDays > remaining) {
    //       return Swal.fire({
    //         icon: "warning",
    //         title: "Insufficient balance",
    //         text: `You only have ${remaining} day(s) left for ${form.leaveType}`,
    //       });
    //     }
    //   }
    // }

    try {
      if (isEdit) {
        await axios.put(
          `http://127.0.0.1:5000/api/leave/${id}`,
          { ...form, totalDays },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Success",
          text: isEdit ? "Leave updated successfully" : "Leave applied successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        console.log('Leave request sent successfully');
      } else {
        await axios.post(
          "http://127.0.0.1:5000/api/leave/apply",
          { ...form, totalDays },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Leave applied successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setTimeout(() => {
        navigate("/employee-dashboard/my-leaves");
      }, 2000);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] ">
      {/* Heading */}
     <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
      >
        <FaArrowLeft className="text-xl" />
        {/* <span>Back</span> */}
      </button>

      {/* LEFT CONTENT */}
      <div>
    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
      Add Leave
    </h1>

    <p className="text-gray-500 mt-2 text-sm">
      Apply for leave requests, track approvals, and manage your time off efficiently
    </p>
  </div>

  {/* RIGHT BADGE */}
  <div className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-medium text-sm">
    
    <span className="w-2 h-2 rounded-full bg-green-500"></span>

    Leave Portal
  </div>
</div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Leave Balance
          </h2>

          <div className="space-y-4">

          {/* Leave Balance - Dynamic */}
          <div className="space-y-4">
            {Array.isArray(leaveBalance) && leaveBalance.length > 0 ? (
              leaveBalance.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm">
                  <div className={`bg-${item.color || 'blue'}-100 p-3 rounded-lg text-${item.color || 'blue'}-500`}>
                    {/* icon placeholder */}
                    {item.type === 'Casual Leave' && <FaUmbrellaBeach />}
                    {item.type === 'Sick Leave' && <FaMedkit />}
                    {item.type === 'Privilege Leave' && <FaGift />}
                    {!['Casual Leave', 'Sick Leave', 'Privilege Leave'].includes(item.type) && <FaClock />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">{item.type}</p>
                    <p className="text-sm text-gray-500">{item.used || 0} / {item.total || 0} Days</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No leave balance available</p>
            )}
          </div>

            {/* Note */}
            <div className="bg-red-50 p-4 rounded-xl mt-6">
              <div className="flex items-center gap-2 text-red-500 font-semibold mb-2">
                <FaInfoCircle /> Note
              </div>

              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-2">
                <li>Leave requests are subject to manager approval.</li>
                <li>Apply leave at least 2 days in advance.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            {isEdit ? "Edit Leave" : "Apply For Leave"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type
                </label>

                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-300"
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Privilege Leave">Privilege Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Days
                </label>

                <input
                  type="text"
                  value={
                    form.startDate && form.endDate
                      ? Math.ceil(
                          (new Date(form.endDate) -
                            new Date(form.startDate)) /
                            (1000 * 60 * 60 * 24)
                        ) + 1
                      : 0
                  }
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50"
                  readOnly
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows="5"
                placeholder="Enter reason for leave..."
                className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-red-300"
                required
              />
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>

              <input
                type="file"
                className="w-full border border-gray-200 rounded-xl p-3"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="reset"
                className="px-6 py-3 border rounded-xl text-gray-600 hover:bg-gray-100 transition"
              >
                Reset
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition"
              >
                <FaPaperPlane />
                {isEdit ? "Update Leave" : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Help */}
      <div className="bg-blue-50 rounded-2xl p-5 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-semibold text-gray-800">
            Need help?
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Contact your manager or HR department for any leave related queries.
          </p>
        </div>

        <button className="border border-blue-300 text-blue-500 px-6 py-3 rounded-xl hover:bg-blue-100 transition">
          Contact HR
        </button>
      </div>
    </div>
  );
};

export default ApplyLeave;