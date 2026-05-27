import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaMicrosoft,
  FaEye,
} from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post(
      "http://127.0.0.1:5000/api/auth/login",
      { email, password }
    );

    if (response.data.success) {
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(user);

      // NAVIGATE
      if (user.role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      setError(error.response.data.error);
    } else {
      setError("Server error");
    }
  }
};

  return (
    <div className="min-h-screen bg-[#f6f3f4] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="bg-[#fdf5f6] flex flex-col justify-center items-center p-10 relative">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Welcome Back!
          </h1>

          <p className="text-gray-500 text-center mb-10 text-lg">
            Please login to continue <br /> to your account
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/woman-working-on-laptop-3487453-2912016.png"
            alt="login"
            className="w-[350px]"
          />
        </div>

        {/* Right Side */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-[#ff4d67]">
              Log In <span className="text-gray-800">User</span>
            </h2>

            <div className="flex items-center justify-center mt-3 gap-3">
              <div className="h-[2px] w-16 bg-pink-200"></div>
              <div className="text-pink-400">◉</div>
              <div className="h-[2px] w-16 bg-pink-200"></div>
            </div>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email Address
              </label>

              <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-pink-300">
                <span className="px-4 text-pink-400">
                  <FaEnvelope />
                </span>

                <input
                  type="email"
                  placeholder="priyanka@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </label>

              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-pink-300">
                <span className="px-4 text-pink-400">
                  <FaLock />
                </span>

                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 outline-none"
                />

                <span className="px-4 text-gray-400 cursor-pointer">
                  <FaEye />
                </span>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-pink-500" />
                Remember me
              </label>

              <p className="text-pink-500 cursor-pointer hover:underline">
                Forgot Password?
              </p>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-red-400 text-white py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <p className="text-gray-400 text-sm">or continue with</p>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <FaGoogle className="text-red-500" />
              Continue with Google
            </button>

            <button className="border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <FaMicrosoft className="text-blue-500" />
              Continue with Microsoft
            </button>
          </div>

          {/* Signup */}
          <p className="text-center text-gray-500 mt-8 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-pink-500 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
