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
  FaLinkedin,
  FaGithub,
  FaArrowRight,
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

  // Mock data matching the image
  const profileData = {
    name: user?.name || "Priyanka Sharma",
    position: user?.position || user?.designation || "Software Developer",
    location: user?.address || "Yamunanagar, Haryana",
    email: user?.email || "priyanka@example.com",
    linkedin: "https://linkedin.com/in/priyanka",
    github: "https://github.com/priyanka28v",
    joiningDate: user?.joiningDate || "2024-01-15",
    dob: user?.dob || "2003-06-08",
    aadharNo: "123412341234",
    panNo: "ABCDE1234F",
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
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src={user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt={profileData.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-red-500"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.name}
              </h1>
              <p className="text-gray-600 font-medium mt-0.5">
                {profileData.position}
              </p>
              <p className="text-gray-500 text-sm mt-0.5">
                {profileData.location}
              </p>

              {/* Social Profiles */}
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <FaEnvelope className="text-gray-400 text-xs" />
                  <span className="text-gray-600">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaLinkedin className="text-blue-600" />
                  <a 
                    href={profileData.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    linkedin.com/in/priyanka
                  </a>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaGithub className="text-gray-700" />
                  <a 
                    href={profileData.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:underline text-xs"
                  >
                    github.com/priyanka28v
                  </a>
                </div>
              </div>

              {/* Joining Date */}
              <div className="mt-3 flex items-center gap-2 text-sm bg-gray-50 px-3 py-1.5 rounded-md inline-block">
                <FaCalendarAlt className="text-gray-400 text-xs" />
                <span className="text-gray-600">Joining Date</span>
                <span className="font-semibold text-gray-800">{profileData.joiningDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaUserCircle className="text-gray-400" />
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Full Name</span>
              <span className="text-sm font-medium text-gray-900">{profileData.name}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Position</span>
              <span className="text-sm font-medium text-gray-900">{profileData.position}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Date Of Birth</span>
              <span className="text-sm font-medium text-gray-900">{profileData.dob}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Address</span>
              <span className="text-sm font-medium text-gray-900">{profileData.location}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Aadhar No</span>
              <span className="text-sm font-medium text-gray-900">{profileData.aadharNo}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Pan No</span>
              <span className="text-sm font-medium text-gray-900">{profileData.panNo}</span>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Pie Chart</h2>
          
          <div className="flex items-center justify-around">
            {/* Simple Pie Chart */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Pending - Yellow */}
                <circle cx="50" cy="50" r="40" fill="#FCD34D" />
                {/* Approved - Green */}
                <path
                  d="M 50 10 A 40 40 0 0 1 85.36 35.36 L 50 50 Z"
                  fill="#34D399"
                />
                {/* Rejected - Red */}
                <path
                  d="M 85.36 35.36 A 40 40 0 0 1 50 90 L 50 50 Z"
                  fill="#F87171"
                />
                <circle cx="50" cy="50" r="20" fill="white" />
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-gray-700">Approved</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-sm text-gray-700">Rejected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;