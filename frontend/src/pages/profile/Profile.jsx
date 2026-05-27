import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaShareAlt,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="space-y-6">

          {/* PROFILE CARD */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex items-start gap-4">

              <FaUserCircle className="text-7xl text-gray-300" />

              <div>
                <h2 className="text-3xl font-bold text-red-400 leading-tight">
                  {user?.name || "Priyanka Sharma"}
                </h2>

                <p className="text-gray-600 font-medium mt-2">
                  Software Developer
                </p>

                <p className="text-gray-500 mt-1">
                  Yamunanagar, Haryana
                </p>
              </div>

            </div>
          </div>

          {/* SOCIAL CARD */}
          <div className="bg-white rounded-3xl shadow-sm p-6">

            <div className="flex items-center gap-3 mb-6">

              <FaShareAlt className="text-red-400 text-xl" />

              <h2 className="text-3xl font-bold text-red-400">
                Social Profiles
              </h2>

            </div>

            <div className="space-y-5">

              {/* EMAIL */}
              <div className="flex items-start gap-4 border-b pb-4">

                <FaEnvelope className="text-gray-700 mt-1" />

                <div>
                  <p className="font-bold text-gray-800">
                    Email
                  </p>

                  <p className="text-gray-500">
                    {user?.email || "priyanka@example.com"}
                  </p>
                </div>

              </div>

              {/* LINKEDIN */}
              <div className="flex items-start gap-4 border-b pb-4">

                <FaLinkedin className="text-gray-700 mt-1" />

                <div>
                  <p className="font-bold text-gray-800">
                    LinkedIn
                  </p>

                  <p className="text-gray-500 break-all">
                    https://linkedin.com/in/priyanka
                  </p>
                </div>

              </div>

              {/* GITHUB */}
              <div className="flex items-start gap-4 border-b pb-4">

                <FaGithub className="text-gray-700 mt-1" />

                <div>
                  <p className="font-bold text-gray-800">
                    Github ID
                  </p>

                  <p className="text-gray-500 break-all">
                    https://github.com/priyanka28v
                  </p>
                </div>

              </div>

              {/* JOIN DATE */}
              <div className="flex items-start gap-4">

                <FaUserCircle className="text-gray-700 mt-1" />

                <div>
                  <p className="font-bold text-gray-800">
                    Joining Date
                  </p>

                  <p className="text-gray-500">
                    2024-01-15
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8">

          {/* TITLE */}
          <div className="flex items-center gap-3 mb-10">

            <FaUserCircle className="text-red-400 text-2xl" />

            <h2 className="text-4xl font-bold text-red-400">
              Personal Details
            </h2>

          </div>

          {/* DETAILS */}
          <div className="space-y-6">

            <div className="grid grid-cols-2 border-b pb-3">
              <p className="font-bold text-gray-800">
                Full Name
              </p>

              <p className="text-gray-600 text-right">
                {user?.name || "Priyanka Sharma"}
              </p>
            </div>

            <div className="grid grid-cols-2 border-b pb-3">
              <p className="font-bold text-gray-800">
                Position
              </p>

              <p className="text-gray-600 text-right">
                Software Developer
              </p>
            </div>

            <div className="grid grid-cols-2 border-b pb-3">
              <p className="font-bold text-gray-800">
                Date Of Birth
              </p>

              <p className="text-gray-600 text-right">
                2003-06-08
              </p>
            </div>

            <div className="grid grid-cols-2 border-b pb-3">
              <p className="font-bold text-gray-800">
                Address
              </p>

              <p className="text-gray-600 text-right">
                Yamunanagar, Haryana
              </p>
            </div>

            <div className="grid grid-cols-2 border-b pb-3">
              <p className="font-bold text-gray-800">
                Aadhar No
              </p>

              <p className="text-gray-600 text-right">
                123412341234
              </p>
            </div>

            <div className="grid grid-cols-2 border-b pb-3">
              <p className="font-bold text-gray-800">
                Pan No
              </p>

              <p className="text-gray-600 text-right">
                ABCDE1234F
              </p>
            </div>

          </div>

          {/* STATUS CIRCLE */}
          <div className="flex justify-center mt-14">

            <div className="relative w-32 h-32 rounded-full border-[18px] border-yellow-300 flex items-center justify-center">

              <div className="text-center">

                <h2 className="text-2xl font-bold text-yellow-500">
                  7
                </h2>

                <p className="text-sm text-gray-500">
                  pending
                </p>

              </div>

            </div>

          </div>

          {/* LEGEND */}
          <div className="flex justify-center gap-8 mt-8 flex-wrap">

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-400"></div>
              <p className="text-gray-600">
                Approved
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-400"></div>
              <p className="text-gray-600">
                Rejected
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-300"></div>
              <p className="text-gray-600">
                Pending
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;