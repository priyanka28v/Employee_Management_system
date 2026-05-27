// pages/EmployeeHome.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaCalendarCheck,
  FaArrowRight,
} from "react-icons/fa";

import { motion } from "framer-motion";

const EmployeeHome = () => {
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        // USER DATA
        const userRes = await axios.get(
          "http://127.0.0.1:5000/api/auth/verify",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // LEAVES DATA
        const leaveRes = await axios.get(
          "http://127.0.0.1:5000/api/leave/my-leaves",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userRes.data.success) {
          setUser(userRes.data.user);
        }

        if (leaveRes.data.success) {
          setLeaves(leaveRes.data.leaves);
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= CALCULATIONS ================= */

  const totalLeaves = leaves.length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "approved"
  ).length;

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "pending"
  ).length;

  const recentLeaves = leaves.slice(0, 4);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* MAIN CONTENT */}
      <div className="p-8">

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TOTAL LEAVES */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-3xl p-6 shadow-md"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500">
                  Total Leaves
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {totalLeaves}
                </h2>
              </div>

              <div className="bg-pink-100 p-4 rounded-2xl">
                <FaClipboardList className="text-pink-500 text-2xl" />
              </div>

            </div>
          </motion.div>

          {/* APPROVED */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-3xl p-6 shadow-md"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500">
                  Approved Leaves
                </p>

                <h2 className="text-4xl font-bold text-green-600 mt-2">
                  {approvedLeaves}
                </h2>
              </div>

              <div className="bg-green-100 p-4 rounded-2xl">
                <FaCheckCircle className="text-green-600 text-2xl" />
              </div>

            </div>
          </motion.div>

          {/* PENDING */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-3xl p-6 shadow-md"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-gray-500">
                  Pending Leaves
                </p>

                <h2 className="text-4xl font-bold text-yellow-500 mt-2">
                  {pendingLeaves}
                </h2>
              </div>

              <div className="bg-yellow-100 p-4 rounded-2xl">
                <FaClock className="text-yellow-500 text-2xl" />
              </div>

            </div>
          </motion.div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-12">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* APPLY LEAVE */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() =>
                navigate("/employee-dashboard/apply-leave")
              }
              className="bg-white p-6 rounded-3xl shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-center">

                <div>
                  <h3 className="text-xl font-bold">
                    Apply Leave
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Submit your leave request quickly.
                  </p>
                </div>

                <FaArrowRight className="text-2xl text-pink-500" />
              </div>
            </motion.div>

            {/* MY LEAVES */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() =>
                navigate("/employee-dashboard/my-leaves")
              }
              className="bg-white p-6 rounded-3xl shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-center">

                <div>
                  <h3 className="text-xl font-bold">
                    My Leaves
                  </h3>

                  <p className="text-gray-500 mt-2">
                    View all leave applications.
                  </p>
                </div>

                <FaArrowRight className="text-2xl text-blue-500" />
              </div>
            </motion.div>

            {/* ATTENDANCE */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() =>
                navigate("/employee-dashboard/attendance")
              }
              className="bg-white p-6 rounded-3xl shadow-md cursor-pointer"
            >
              <div className="flex justify-between items-center">

                <div>
                  <h3 className="text-xl font-bold">
                    Attendance
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Track your attendance records.
                  </p>
                </div>

                <FaCalendarCheck className="text-2xl text-green-500" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* RECENT ACTIVITIES */}
        <div className="mt-12">

          <h2 className="text-2xl font-bold mb-5">
            Recent Activities
          </h2>

          <div className="bg-white rounded-3xl shadow-md p-6 space-y-4">

            {recentLeaves.length === 0 ? (
              <div className="text-center py-10">

                <h3 className="text-xl font-semibold text-gray-700">
                  No recent activity 🚀
                </h3>

                <p className="text-gray-500 mt-2">
                  Start by applying for leave or marking attendance.
                </p>

              </div>
            ) : (
              recentLeaves.map((leave) => (
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  key={leave._id}
                  className="flex items-center justify-between border rounded-2xl p-4"
                >

                  <div>
                    <h3 className="font-semibold text-lg">
                      {leave.reason}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {leave.leaveType}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold
                    ${
                      leave.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : leave.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {leave.status}
                  </span>

                </motion.div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeHome;