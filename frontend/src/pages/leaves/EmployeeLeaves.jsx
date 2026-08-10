import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaCalendarAlt,
} from "react-icons/fa";

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ FETCH LEAVES
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/api/leave/my-leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:5000/api/leave/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeaves((prev) => prev.filter((l) => l._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ EDIT
  const handleEdit = (id) => {
    navigate(`/employee-dashboard/edit-leave/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            My Leaves
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your leave requests and track approval status
          </p>
        </div>

        <div className="flex gap-3">

          {/* BACK */}
          <button
            onClick={() => navigate("/employee-dashboard")}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl transition shadow"
          >
            <FaArrowLeft />
            Back
          </button>

          {/* ADD LEAVE */}
          <button
            onClick={() =>
  navigate("/employee-dashboard/apply-leave")
}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white px-5 py-3 rounded-xl transition shadow-lg"
          >
            <FaPlus />
            Add Leave
          </button>

        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

        {/* TOP BAR */}
        <div className="p-6 border-b flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="bg-pink-100 text-pink-500 p-3 rounded-xl">
              <FaCalendarAlt />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Leave History
              </h2>

              <p className="text-sm text-gray-500">
                Total Leaves: {leaves.length}
              </p>
            </div>
          </div>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-600 text-sm">

                <th className="p-4 text-left">Leave Type</th>

                <th className="p-4 text-left">Start Date</th>

                <th className="p-4 text-left">End Date</th>

                <th className="p-4 text-left">Days</th>

                <th className="p-4 text-left">Reason</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-center">Actions</th>

              </tr>
            </thead>

            <tbody>

              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* LEAVE TYPE */}
                    <td className="p-4 font-medium text-gray-700">
                      {leave.leaveType}
                    </td>

                    {/* START */}
                    <td className="p-4 text-gray-600">
                      {dayjs(leave.startDate).format("DD MMM YYYY")}
                    </td>

                    {/* END */}
                    <td className="p-4 text-gray-600">
                      {dayjs(leave.endDate).format("DD MMM YYYY")}
                    </td>

                    {/* DAYS */}
                    <td className="p-4 text-gray-600">
                      {leave.totalDays} Days
                    </td>

                    {/* REASON */}
                    <td className="p-4 text-gray-600 max-w-xs truncate">
                      {leave.reason}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status}
                      </span>

                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">

                      <div className="flex items-center justify-center gap-3">

                        {/* EDIT */}
                        <button
                          onClick={() => handleEdit(leave._id)}
                          disabled={leave.status !== "pending"}
                          className={`p-2 rounded-lg text-white transition ${
                            leave.status !== "pending"
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          <FaEdit />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => handleDelete(leave._id)}
                          disabled={leave.status !== "pending"}
                          className={`p-2 rounded-lg text-white transition ${
                            leave.status !== "pending"
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>

                  <td
                    colSpan="7"
                    className="text-center py-16 text-gray-500"
                  >
                    No leave requests found
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaves;