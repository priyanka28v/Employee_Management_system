import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AttendanceDashboard = () => {

  const [attendance, setAttendance] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  /* =========================
     FETCH ATTENDANCE
  ========================= */

  const fetchAttendance = async () => {
    try {

      const res = await axios.get(
        "http://127.0.0.1:5000/api/attendance/my-attendance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      if (res.data.success) {
        setAttendance(res.data.attendance || []);
      }

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  /* =========================
     COUNTS
  ========================= */

  const presentCount = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  const lateCount = attendance.filter(
    (a) => a.status === "Late"
  ).length;

  const total = attendance.length;

  const percentage =
    total === 0
      ? 0
      : (((presentCount + lateCount) / total) * 100).toFixed(1);

  /* =========================
     PIE DATA
  ========================= */

  const pieData = [
    {
      name: "Present",
      value: presentCount,
    },

    {
      name: "Late",
      value: lateCount,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#facc15",
  ];

  /* =========================
     MONTHLY GROUPING
  ========================= */

  const grouped = {};

  attendance.forEach((item) => {

    const month =
      dayjs(item.date).format("MMM YYYY");

    if (!grouped[month]) {

      grouped[month] = {
        month,
        Present: 0,
        Late: 0,
      };
    }

    if (item.status === "Present") {

      grouped[month].Present++;

    } else if (item.status === "Late") {

      grouped[month].Late++;
    }
  });

  const monthlyData =
    Object.values(grouped);

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}

     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white shadow-md rounded-2xl p-5 border border-gray-100">

  {/* LEFT SECTION */}
  <div>
    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
      Attendance Dashboard
    </h1>

    <p className="text-gray-500 mt-1 text-sm">
      Track employee attendance, working hours & reports
    </p>
  </div>

  {/* RIGHT SECTION */}
  <div className="flex items-center gap-3">

    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm"
    >
      ⬅ Back
    </button>

  </div>

</div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white p-5 rounded shadow">

          <h3>Total Days</h3>

          <p className="text-2xl font-bold">
            {total}
          </p>

        </div>

        <div className="bg-white p-5 rounded shadow">

          <h3 className="text-green-600">
            Present
          </h3>

          <p className="text-2xl font-bold text-green-600">
            {presentCount}
          </p>

        </div>

        <div className="bg-white p-5 rounded shadow">

          <h3 className="text-yellow-500">
            Late
          </h3>

          <p className="text-2xl font-bold text-yellow-500">
            {lateCount}
          </p>

        </div>

      </div>

      {/* ATTENDANCE % */}

      <div className="bg-white p-5 rounded shadow mb-8">

        <h3 className="text-blue-600 text-lg font-semibold">
          Attendance Percentage
        </h3>

        <p className="text-3xl font-bold text-blue-600 mt-2">
          {percentage}%
        </p>

      </div>

      {/* PIE CHART */}

      <div className="bg-white p-6 rounded shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          Attendance Breakdown
        </h2>

        {total === 0 ? (

          <p className="text-gray-500">
            No attendance data available 😕
          </p>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={120}
                label
              >

                {pieData.map((_, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>
        )}

      </div>

      {/* BAR CHART */}

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-4">
          Monthly Attendance
        </h2>

        {monthlyData.length === 0 ? (

          <p className="text-gray-500">
            No monthly data available 😕
          </p>

        ) : (

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={monthlyData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="Present"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="Late"
                fill="#facc15"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>
        )}

      </div>

    </div>
  );
};

export default AttendanceDashboard;