import React from "react";
import SummaryCard from "./SummaryCard";
import LeaveCard from "./LeaveCard";

import {
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const AdminSummary = () => {
  return (
    <div className="space-y-10">
      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard
            icon={<FaUsers size={22} />}
            title="Total Employees"
            value={5}
            color="bg-teal-600"
          />

          <SummaryCard
            icon={<FaBuilding size={22} />}
            title="Total Departments"
            value={3}
            color="bg-yellow-500"
          />

          <SummaryCard
            icon={<FaMoneyBillWave size={22} />}
            title="Monthly Pay"
            value="$2500"
            color="bg-red-500"
          />
        </div>
      </section>

      {/* Leave Details */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Leave Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <LeaveCard
            icon={<FaClipboardList size={22} />}
            title="Leave Applied"
            value={2}
            color="bg-teal-500"
          />

          <LeaveCard
            icon={<FaCheckCircle size={22} />}
            title="Leave Approved"
            value={2}
            color="bg-green-500"
          />

          <LeaveCard
            icon={<FaHourglassHalf size={22} />}
            title="Leave Pending"
            value={1}
            color="bg-yellow-500"
          />

          <LeaveCard
            icon={<FaTimesCircle size={22} />}
            title="Leave Rejected"
            value={2}
            color="bg-red-500"
          />
        </div>
      </section>
    </div>
  );
};

export default AdminSummary;
