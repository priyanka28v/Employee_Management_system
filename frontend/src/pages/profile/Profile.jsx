import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaIdBadge,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:5000/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <FaSpinner className="animate-spin text-3xl text-red-500 mb-2" />
        <p className="text-sm">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER PROFILE CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt={user?.name || "Profile"}
            className="w-28 h-28 rounded-3xl object-cover border-4 border-red-500 shadow-md shrink-0"
          />

          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-extrabold text-gray-800">{user?.name || "User Profile"}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user?.role || "employee"}
              </span>
            </div>

            <p className="text-gray-600 font-medium flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <FaBriefcase className="text-red-500" /> {user?.position || user?.designation || "Team Member"}
              </span>
              <span className="flex items-center gap-1.5">
                <FaBuilding className="text-blue-500" /> {user?.department || "General"}
              </span>
            </p>

            <p className="text-xs text-gray-500 font-mono pt-1">
              Employee ID: <span className="font-bold text-gray-700">{user?.employeeId || "EMP-001"}</span>
            </p>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-4">
            <FaIdBadge className="text-red-500" /> Account & Contact Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaUserCircle className="text-gray-400" /> Full Name
              </span>
              <span className="font-bold text-gray-800">{user?.name || "-"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" /> Email Address
              </span>
              <span className="font-bold text-gray-800">{user?.email || "-"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaPhone className="text-gray-400" /> Phone Number
              </span>
              <span className="font-bold text-gray-800">{user?.phone || "Not Provided"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" /> Date of Birth
              </span>
              <span className="font-bold text-gray-800">{user?.dob || "Not Provided"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaBuilding className="text-gray-400" /> Department
              </span>
              <span className="font-bold text-gray-800">{user?.department || "N/A"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaBriefcase className="text-gray-400" /> Job Position
              </span>
              <span className="font-bold text-gray-800">{user?.position || user?.designation || "N/A"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" /> Joining Date
              </span>
              <span className="font-bold text-gray-800">{user?.joiningDate || "N/A"}</span>
            </div>

            <div className="flex justify-between py-3 border-b">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Account Status
              </span>
              <span className="font-bold text-green-600 uppercase">{user?.status || "active"}</span>
            </div>

            <div className="md:col-span-2 flex justify-between py-3">
              <span className="font-medium text-gray-500 flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400" /> Residential Address
              </span>
              <span className="font-bold text-gray-800">{user?.address || "Not Provided"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;