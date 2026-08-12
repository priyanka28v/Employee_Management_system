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
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import HomeNavbar from "../../components/HomeNavbar";

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
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // Field validation function
  const validateField = (name, value, currentForm = form) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name should contain only letters and spaces";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email address is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = "Please enter a valid email address";
        }
        break;

      case "phone":
        const cleanPhone = value.replace(/\s+/g, "");
        if (!cleanPhone) {
          error = "Phone number is required";
        } else if (!/^\d{10}$/.test(cleanPhone)) {
          error = "Phone number must be exactly 10 digits";
        }
        break;

      case "dob":
        if (!value) {
          error = "Date of birth is required";
        } else {
          const dobDate = new Date(value);
          const today = new Date();
          if (dobDate >= today) {
            error = "Date of birth must be in the past";
          } else {
            let age = today.getFullYear() - dobDate.getFullYear();
            const m = today.getMonth() - dobDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
              age--;
            }
            if (age < 18) {
              error = "You must be at least 18 years old";
            }
          }
        }
        break;

      case "department":
        if (!value) {
          error = "Please select a department";
        }
        break;

      case "position":
        if (!value.trim()) {
          error = "Job position is required";
        } else if (value.trim().length < 2) {
          error = "Job position must be at least 2 characters";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(value)) {
          error = "Password must contain both letters and numbers";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== currentForm.password) {
          error = "Passwords do not match";
        }
        break;

      case "agreeTerms":
        if (!value) {
          error = "You must agree to the Terms & Privacy Policy";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate full form
  const validateForm = (currentForm = form) => {
    const newErrors = {};
    Object.keys(currentForm).forEach((key) => {
      if (key !== "role") {
        const err = validateField(key, currentForm[key], currentForm);
        if (err) newErrors[key] = err;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    const updatedForm = { ...form, [name]: val };
    setForm(updatedForm);

    if (touched[name]) {
      const errorMsg = validateField(name, val, updatedForm);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }

    // Re-validate confirmPassword if password changes
    if (name === "password" && touched.confirmPassword) {
      const confirmErr = validateField(
        "confirmPassword",
        updatedForm.confirmPassword,
        updatedForm
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, val, form);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500", text: "text-red-500" };
    if (score === 2 || score === 3) return { score: 2, label: "Medium", color: "bg-yellow-500", text: "text-yellow-600" };
    return { score: 3, label: "Strong", color: "bg-green-500", text: "text-green-600" };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(form).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitError("Please fix the highlighted errors before submitting.");
      return;
    }

    setSubmitError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/api/auth/signup",
        form
      );

      if (res.data) {
        navigate("/login");
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (fieldName) => {
    if (!touched[fieldName]) return "border-gray-300 focus-within:border-red-500";
    if (errors[fieldName]) return "border-red-500 bg-red-50/30 focus-within:border-red-600";
    return "border-green-500 focus-within:border-green-600";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800">
  <HomeNavbar />
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT SIDE */}
        <div className="bg-pink-50 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-800 leading-snug">
            Welcome to <br />
            <span className="text-red-500">Worksphere</span>
          </h2>

          <p className="text-gray-500 mt-5 text-lg">
            Create your account and get started with managing your work life better.
          </p>

          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/woman-working-on-laptop-illustration-download-in-svg-png-gif-file-formats--girl-office-employee-business-pack-people-illustrations-2912026.png"
            alt="signup"
            className="w-full max-w-sm mt-10 mx-auto"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-100 p-3 rounded-xl">
              <FaUser className="text-red-500 text-xl" />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Create an Account
              </h2>
              <p className="text-gray-500 text-sm">
                Fill in your details to sign up
              </p>
            </div>
          </div>

          {submitError && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
              <FaExclamationCircle className="shrink-0 text-base" />
              <span>{submitError}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>

              <div className={`flex items-center border rounded-lg px-3 mt-1 transition ${getInputStyle("name")}`}>
                <FaUser className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                />
                {touched.name && !errors.name && (
                  <FaCheckCircle className="text-green-500 text-xs shrink-0" />
                )}
              </div>
              {touched.name && errors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>

              <div className={`flex items-center border rounded-lg px-3 mt-1 transition ${getInputStyle("email")}`}>
                <FaEnvelope className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Enter your email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                />
                {touched.email && !errors.email && (
                  <FaCheckCircle className="text-green-500 text-xs shrink-0" />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>

              <div className={`flex items-center border rounded-lg px-3 mt-1 transition ${getInputStyle("phone")}`}>
                <FaPhone className="text-gray-400 shrink-0" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  placeholder="10-digit phone number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={10}
                  className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                />
                {touched.phone && !errors.phone && (
                  <FaCheckCircle className="text-green-500 text-xs shrink-0" />
                )}
              </div>
              {touched.phone && errors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.phone}
                </p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>

              <div className={`flex items-center border rounded-lg px-3 mt-1 transition ${getInputStyle("dob")}`}>
                <FaCalendarAlt className="text-gray-400 shrink-0" />
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                />
                {touched.dob && !errors.dob && (
                  <FaCheckCircle className="text-green-500 text-xs shrink-0" />
                )}
              </div>
              {touched.dob && errors.dob && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.dob}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border rounded-lg p-2.5 mt-1 outline-none text-sm text-gray-800 transition ${
                  touched.department && errors.department
                    ? "border-red-500 bg-red-50/30"
                    : touched.department
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
              </select>
              {touched.department && errors.department && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.department}
                </p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Job Position <span className="text-red-500">*</span>
              </label>

              <div className={`flex items-center border rounded-lg px-3 mt-1 transition ${getInputStyle("position")}`}>
                <FaBriefcase className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  placeholder="Enter your job position"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                />
                {touched.position && !errors.position && (
                  <FaCheckCircle className="text-green-500 text-xs shrink-0" />
                )}
              </div>
              {touched.position && errors.position && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.position}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>

              <div className={`flex items-center border rounded-lg px-3 mt-1 transition ${getInputStyle("password")}`}>
                <FaLock className="text-gray-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  placeholder="Create a password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none shrink-0 ml-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Strength Indicator */}
              {form.password && (
                <div className="mt-1.5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Password Strength:</span>
                    <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {touched.password && errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>

              <div className={`flex items-center border rounded-lg px-3 mt-1 transition ${getInputStyle("confirmPassword")}`}>
                <FaLock className="text-gray-400 shrink-0" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  placeholder="Confirm your password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2.5 outline-none bg-transparent text-sm text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none shrink-0 ml-1"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="md:col-span-2 mt-2">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  id="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-1 accent-red-500 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  I agree to the{" "}
                  <span className="text-red-500 font-medium hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-red-500 font-medium hover:underline">
                    Privacy Policy
                  </span>
                </label>
              </div>
              {touched.agreeTerms && errors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <FaExclamationCircle /> {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Button */}
            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 transition text-white py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-red-500 font-semibold cursor-pointer hover:underline"
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