import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

import HomeNavbar from "../components/HomeNavbar";

const About = () => {
  const { user } = useAuth();
    return (<div className="min-h-screen flex flex-col bg-[#f6f3f4] text-gray-800">
      <HomeNavbar />
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center py-12 px-6 md:px-12 lg:px-24">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">About Our Employee Management System</h1>
          <p className="text-lg md:text-xl text-gray-600">
            EMS helps organizations manage employees and daily HR activities efficiently, providing a centralized platform for all employee‑related workflows.
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          {/* Image generated via AI – place the file in public/assets */}
          <img
            src="/assets/about_illustration.jpg"
            alt="Employee Management Illustration"
            className="w-full max-w-md rounded-xl shadow-xl transition-transform transform hover:scale-105"
          />
        </div>
      </section>

      {/* About EMS */}
      <section className="bg-[#fdf5f6] backdrop-blur-lg rounded-2xl mx-6 md:mx-12 lg:mx-24 p-8 mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">About EMS</h2>
        <p className="text-gray-200 leading-relaxed mb-4">
          WorkSphere is a modern, premium employee management system designed to streamline HR workflows, boost productivity, and provide insightful analytics. It offers a centralized platform for managing employee information, attendance, leaves, salary, departments, and other employee‑related activities.
        </p>
      </section>

      {/* Key Features */}
      <section className="mx-6 md:mx-12 lg:mx-24 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">What We Provide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Employee Management", desc: "Add, edit, view employee profiles and details." },
            { title: "Attendance Management", desc: "Track daily check‑ins, check‑outs and generate reports." },
            { title: "Leave Management", desc: "Submit, approve and monitor leave requests." },
            { title: "Salary Management", desc: "Calculate payroll, generate payslips and tax reports." },
            { title: "Department Management", desc: "Organise employees into departments and teams." },
            { title: "Role‑Based Access", desc: "Secure permissions for admins and employees." },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-[#fdf5f6]/10 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose EMS */}
      <section className="bg-[#fdf5f6]/10 backdrop-blur-lg rounded-2xl mx-6 md:mx-12 lg:mx-24 p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Why Choose EMS</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-200 max-w-2xl mx-auto">
          <li>Easy to use interface with minimal learning curve.</li>
          <li>All employee data centralized in one secure location.</li>
          <li>Saves time and reduces manual paperwork.</li>
          <li>Secure role‑based access ensures data privacy.</li>
          <li>Improves organization and overall productivity.</li>
        </ul>
      </section>

      {/* How It Works */}
      <section className="mx-6 md:mx-12 lg:mx-24 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {[
            { step: "1", title: "Admin manages employees & departments", desc: "Create, edit and organise staff information." },
            { step: "2", title: "Employees manage their profile", desc: "Mark attendance, view salary and request leaves." },
            { step: "3", title: "Admin reviews activities", desc: "Approve leaves, monitor attendance and run payroll." },
          ].map((item) => (
            <div key={item.step} className="flex-1 bg-[#fdf5f6]/10 backdrop-blur-md rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{item.step}</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="mx-6 md:mx-12 lg:mx-24 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#fdf5f6]/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Admin</h3>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>Manage employees, departments, attendance, leaves and salary.</li>
              <li>Configure system settings and permissions.</li>
            </ul>
          </div>
          <div className="bg-[#fdf5f6]/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Employee</h3>
            <ul className="list-disc list-inside text-gray-200 space-y-1">
              <li>View personal profile, attendance records and salary.</li>
              <li>Apply for leaves and track request status.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="bg-[#fdf5f6]/10 backdrop-blur-lg rounded-2xl mx-6 md:mx-12 lg:mx-24 p-8 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Built With</h2>
        <ul className="flex flex-wrap justify-center gap-4 text-gray-200">
          <li>React.js</li>
          <li>Node.js</li>
          <li>Express.js</li>
          <li>MongoDB</li>
          {/* Include Redux Toolkit only if used */}
        </ul>
      </section>

      {/* Call To Action */}
      <section className="flex flex-col items-center py-12 bg-[#fdf5f6] backdrop-blur-md rounded-2xl mx-6 md:mx-12 lg:mx-24 mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Ready to simplify employee management?</h2>
        <Link to="/login" className="mt-4 px-8 py-3 bg-pink-500 hover:bg-pink-600 rounded-md text-white font-medium transition-colors">
          Get Started / Login
        </Link>
      </section>

        <Footer />
    </div>
  );
};

export default About;
