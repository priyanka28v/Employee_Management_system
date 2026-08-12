import React, { useEffect, useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const filteredAttendance = statusFilter
    ? attendance.filter((item) => item.status === statusFilter)
    : attendance;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const [error, setError] = useState(null);

  // FETCH ATTENDANCE
  const fetchAttendance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setError("User not found in local storage.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing. Please log in again.");
        return;
      }

      const employeeId = user._id;

      const res = await axios.get(
        `http://localhost:5000/api/attendance/employee/${employeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setError(err.response?.data?.error || "Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Attendance Dashboard
        </h1>
      </div>
      {/* STATUS FILTER */}
      <div className="mb-4 flex items-center space-x-2">
        <label className="text-gray-600">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All</option>
          <option value="Present">Present</option>
          <option value="Late">Late</option>
          <option value="Absent">Absent</option>
        </select>
      </div>
      <div className="mb-4 text-gray-600">Total Attendance Records: {filteredAttendance.length}</div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Login Time</th>
              <th className="p-4 text-left">Logout Time</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredAttendance.length > 0 ? (
              filteredAttendance.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {item.date}
                  </td>

                  <td className="p-4">
                    {item.loginTime || "--"}
                  </td>

                  <td className="p-4">
                    {item.logoutTime || "--"}
                  </td>

                  <td className="p-4">
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-red-500">
                  No Attendance Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Attendance;