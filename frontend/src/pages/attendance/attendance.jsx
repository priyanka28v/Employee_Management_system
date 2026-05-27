import React, { useEffect, useState } from "react";
import axios from "axios";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  // FETCH ATTENDANCE
  const fetchAttendance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        console.log("User not found");
        return;
      }

      const employeeId = user._id;

      console.log("EMPLOYEE ID:", employeeId);

      const res = await axios.get(
        `http://localhost:5000/api/attendance/employee/${employeeId}`
      );

      console.log("ATTENDANCE DATA:", res.data);

      setAttendance(res.data.attendance || []);
    } catch (error) {
      console.log("FETCH ERROR:", error);
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
            ) : attendance.length > 0 ? (
              attendance.map((item) => (
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