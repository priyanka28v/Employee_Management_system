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
  FaEyeSlash,
} from "react-icons/fa";
import HomeNavbar from "../../components/HomeNavbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/auth/login",
        { email, password }
      );

      if (response.data.success) {
        const { token, user } = response.data;

        login(user, token);

        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Server error during login. Please ensure backend server is running.");
      }
    }
  };

  return (
   <div className="min-h-[60vh] bg-[#f6f3f4] w-full flex flex-col px-0 pt-0 pb-10">
  <HomeNavbar />
  <div className="w-full bg-white shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 rounded-none md:rounded-3xl">

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

          {/* Heading */}
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

          {/* Error */}
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}

          {/* Form */}
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
                  required
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
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 outline-none"
                  required
                />

                <span
                  className="px-4 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
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
          {/* <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <p className="text-gray-400 text-sm">or continue with</p>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div> */}

          {/* Social Buttons */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <FaGoogle className="text-red-500" />
              Continue with Google
            </button>

            <button className="border rounded-lg py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
              <FaMicrosoft className="text-blue-500" />
              Continue with Microsoft
            </button>
          </div> */}

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

          {/* Demo Admin Credentials */}
          <div className="mt-6 bg-pink-50 border border-pink-200 rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-pink-600 mb-2">
              Admin Login
            </h3>

            <p>Email: admin@gmail.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;