import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-200 py-10 px-6 md:px-12 lg:px-24">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-2">WorkSphere EMS</h3>
        <p className="text-sm">
          Centralized employee management for modern organisations.
        </p>
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
    <div className="text-center mt-8 text-sm">
      © {new Date().getFullYear()} WorkSphere EMS. All rights reserved.
    </div>
  </footer>
);

export default Footer;
