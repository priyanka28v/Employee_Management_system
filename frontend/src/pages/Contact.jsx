import React from "react";

const Contact = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-12 max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-6 text-center text-cyan-300">Contact Us</h1>
        <p className="text-lg leading-relaxed text-gray-200 mb-4">
          Have questions or need support? Reach out to the WorkSphere team.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-300 mt-4">
          <li>Email: <a href="mailto:support@worksphere.com" className="underline hover:text-cyan-200">support@worksphere.com</a></li>
          <li>Phone: <a href="tel:+1234567890" className="underline hover:text-cyan-200">+1 (234) 567‑890</a></li>
          <li>Address: 123 Innovation Drive, Tech City, Country</li>
        </ul>
        <div className="mt-8 text-center">
          <a href="/" className="inline-block px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors text-white">
            Back to Home
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
