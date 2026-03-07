import React from "react";

const SummaryCard = ({ icon, title, value, color }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition">
      {/* Icon */}
      <div
        className={`h-12 w-12 flex items-center justify-center rounded-xl text-white ${color}`}
      >
        {icon}
      </div>

      {/* Content */}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
