import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddDepartment = () => {
  const [department, setdepartment] = useState({
    dep_name: "",
    description: "",
    employeeCount: 0,
  });

  // const handlechange = (e) => {
  //   const { name, value } = e.target;
  //   setdepartment({ ...department, [name]: value });
  // };
  const handlechange = (e) => {
    const { name, value } = e.target;
    if (name === "employeeCount") {
      setdepartment({ ...department, employeeCount: Number(value) });
    } else {
      setdepartment({ ...department, [name]: value });
    }
  };

  const navigate = useNavigate();
  const handleButton = (e) => {
    navigate("/admin-dashboard/departments");
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!department.dep_name) {
      alert("Department name is required");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/department/add",
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-8">
        Add Department
      </h3>

      <form className="space-y-6" onSubmit={handlesubmit}>
        {/* Department Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department Name
          </label>
          <input
            type="text"
            name="dep_name"
            onChange={handlechange}
            placeholder="e.g. IT, HR"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     outline-none text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows="3"
            name="description"
            onChange={handlechange}
            placeholder="Brief description about department"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     outline-none text-sm resize-none"
          />
        </div>

        {/* Number of Employees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Employees
          </label>
          <input
            type="number"
            name="employeeCount"
            min="0"
            onChange={handlechange}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     outline-none text-sm"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={handleButton}
            className="px-6 py-2.5 rounded-lg border border-gray-300
                     text-gray-700 text-sm hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-teal-600 text-white
                     text-sm font-medium hover:bg-teal-700 transition"
          >
            Add Department
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartment;
