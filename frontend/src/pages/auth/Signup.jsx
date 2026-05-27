import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    department: "",
    position: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/auth/signup",
        form
      );

      if (res.data) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT SIDE */}
        <div className="bg-pink-50 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 leading-snug">
            Welcome to <br />
            <span className="text-red-500">
              Employee Management System
            </span>
          </h2>

          <p className="text-gray-500 mt-5 text-lg">
            Create your account and get started with managing your work life
            better.
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/woman-working-on-laptop-illustration-download-in-svg-png-gif-file-formats--girl-office-employee-business-pack-people-illustrations-2912026.png"
            alt="signup"
            className="w-full max-w-sm mt-10 mx-auto"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-100 p-3 rounded-xl">
              <FaUser className="text-red-500 text-xl" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Create an Account
              </h2>
              <p className="text-gray-500">
                Fill in your details to sign up
              </p>
            </div>
          </div>

          {error && (
            <p className="text-red-500 mb-4 text-sm font-medium">{error}</p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1">
                <FaUser className="text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1">
                <FaPhone className="text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  required
                />
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date of Birth
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1">
                <FaCalendarAlt className="text-gray-400" />
                <input
                  type="date"
                  name="dob"
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Department
              </label>

              <select
                name="department"
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 outline-none"
                required
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Job Position
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1">
                <FaBriefcase className="text-gray-400" />
                <input
                  type="text"
                  name="position"
                  placeholder="Enter your job position"
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  className="w-full p-3 outline-none"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Select Role
              </label>

              <select
                name="role"
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-1 outline-none"
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Terms */}
            <div className="md:col-span-2 flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" required />
              <p>
                I agree to the{" "}
                <span className="text-red-500 font-medium cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-red-500 font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </div>

            {/* Button */}
            <div className="md:col-span-2">
              <button className="w-full bg-red-500 hover:bg-red-600 transition text-white py-3 rounded-lg font-semibold text-lg">
                Sign Up
              </button>
            </div>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-red-500 font-semibold cursor-pointer"
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;