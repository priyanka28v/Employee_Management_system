import React from "react";
import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import { FaUserTie, FaBuilding, FaClock, FaRegCalendarAlt, FaMoneyBillWave, FaChartBar } from "react-icons/fa";

const Home = () => {
  return (
    <div className="font-inter min-h-screen flex flex-col text-gray-800 bg-[#f6f3f4]">
      <HomeNavbar />

      {/* Hero */}
      <section className="bg-[#fdf5f6] py-20 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            Manage Your Employees Smarter
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            An efficient employee management system designed to simplify employee records, attendance, leaves, departments and salary management in one centralized platform.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Get Started
            </Link>
            <Link to="/features" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition">
              Explore Features
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img  src="/assets/ems.png" alt="Employee management dashboard" className="w-full max-w-md rounded-xl shadow-xl transform hover:scale-105 transition-transform" />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-[#fdf5f6]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <FaUserTie className="text-5xl text-cyan-600 mb-2" />
            <h3 className="text-xl font-medium">Employee Management</h3>
          </div>
          <div className="flex flex-col items-center">
            <FaClock className="text-5xl text-cyan-600 mb-2" />
            <h3 className="text-xl font-medium">Attendance Tracking</h3>
          </div>
          <div className="flex flex-col items-center">
            <FaRegCalendarAlt className="text-5xl text-cyan-600 mb-2" />
            <h3 className="text-xl font-medium">Leave Management</h3>
          </div>
          <div className="flex flex-col items-center">
            <FaBuilding className="text-5xl text-cyan-600 mb-2" />
            <h3 className="text-xl font-medium">Department Management</h3>
          </div>
        </div>
      </section>

      {/* About EMS Preview */}
      <section className="py-16 bg-[#fdf5f6] px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-semibold text-gray-800">About WorkSphere EMS</h2>
          <p className="text-lg text-gray-600">
            WorkSphere provides a centralized platform where administrators can manage employee‑related activities, while employees get easy access to their own information and services.
          </p>
          <Link to="/about" className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition">
            Learn More
          </Link>
        </div>
        {/* <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img src="/assets/about_illustration.jpg" alt="About EMS illustration" className="w-full max-w-md rounded-xl shadow-xl transform hover:scale-105 transition-transform" />
        </div> */}
      </section>

      {/* Core Modules */}
      <section className="py-16 bg-white px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Everything You Need in One Place</h2>
        <div className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaUserTie className="text-4xl text-cyan-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Employee Management</h3>
            <p className="text-gray-600">Add, edit, view employee profiles and manage activation status.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaBuilding className="text-4xl text-cyan-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Department Management</h3>
            <p className="text-gray-600">Create departments, assign employees and control department activation.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaClock className="text-4xl text-cyan-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Attendance Management</h3>
            <p className="text-gray-600">Automatic check‑in/out, present/late status and monthly reports.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaRegCalendarAlt className="text-4xl text-cyan-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Leave Management</h3>
            <p className="text-gray-600">Apply for leave, track status and admin approval workflow.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaMoneyBillWave className="text-4xl text-cyan-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Salary Management</h3>
            <p className="text-gray-600">Payroll calculation, deductions and payslip generation.</p>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link to="/features" className="inline-block px-8 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition">
            View All Features
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">How It Works</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold mb-2">01</div>
            <h3 className="font-medium">Login</h3>
            <p className="text-gray-600 text-sm">Securely access the system.</p>
          </div>
          <div className="flex-1 h-px bg-gray-300 hidden md:block"></div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold mb-2">02</div>
            <h3 className="font-medium">Access Dashboard</h3>
            <p className="text-gray-600 text-sm">Features appear based on role.</p>
          </div>
          <div className="flex-1 h-px bg-gray-300 hidden md:block"></div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold mb-2">03</div>
            <h3 className="font-medium">Manage Activities</h3>
            <p className="text-gray-600 text-sm">Admins manage employees, employees view their data.</p>
          </div>
        </div>
      </section>

      {/* Admin & Employee Experience */}
      <section className="py-16 bg-white px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Tailored Experiences</h2>
        <div className="max-w-5xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaChartBar className="text-4xl text-cyan-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Admin</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Manage employees & departments</li>
              <li>Monitor attendance</li>
              <li>Handle leave requests</li>
              <li>Control salary information</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaUserTie className="text-4xl text-cyan-600 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Employee</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>View personal profile</li>
              <li>Track attendance</li>
              <li>Apply for leave</li>
              <li>Check leave status</li>
              <li>View salary details</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose EMS */}
      <section className="py-16 bg-gray-50 px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Why Choose WorkSphere EMS?</h2>
        <ul className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 list-disc list-inside">
          <li>Centralized employee information</li>
          <li>Reduced manual work</li>
          <li>Easy attendance tracking</li>
          <li>Simplified leave management</li>
          <li>Role‑based access control</li>
          <li>User‑friendly interface</li>
          <li>Better organization & productivity</li>
        </ul>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-white px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Key Features</h2>
        <div className="max-w-5xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2">
          <div className="flex items-start gap-4">
            <FaClock className="text-3xl text-cyan-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Automatic attendance marking</h4>
              <p className="text-gray-600 text-sm">Attendance logged when users log in.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaRegCalendarAlt className="text-3xl text-cyan-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Leave approval workflow</h4>
              <p className="text-gray-600 text-sm">Admins review and approve/reject leave requests.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaUserTie className="text-3xl text-cyan-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Employee activation / deactivation</h4>
              <p className="text-gray-600 text-sm">Control active status of employee accounts.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaBuilding className="text-3xl text-cyan-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Department management</h4>
              <p className="text-gray-600 text-sm">Create, edit and assign departments.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaChartBar className="text-3xl text-cyan-600 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Role‑based dashboards</h4>
              <p className="text-gray-600 text-sm">Separate views for admins and employees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#fdf5f6] text-center px-6 md:px-12 lg:px-24">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Ready to Simplify Employee Management?</h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">Manage your employee activities efficiently with a centralized and easy‑to‑use EMS platform.</p>
        <Link to="/login" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Get Started</Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#fdf5f6] text-gray-800 py-10 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">WorkSphere EMS</h3>
            <p className="text-sm">Centralized employee management for modern organisations.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/features" className="hover:underline">Features</Link></li>
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Contact</h4>
            <p className="text-sm">support@ems.com</p>
            <p className="text-sm">+1‑800‑EMS‑HELP</p>
          </div>
        </div>
        <div className="text-center mt-8 text-sm">© {new Date().getFullYear()} WorkSphere EMS. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Home;
