import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (response.data.success) {
          const data = response.data.departments.map((dep, index) => ({
            _id: dep._id,
            sno: index + 1,
            dep_name: dep.dep_name,
            employees: dep.employeeCount,
          }));

          setDepartment(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // ✅ DELETE FUNCTION ADDED
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.success) {
        setDepartment(departments.filter((dep) => dep._id !== id));
      }
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <>
      {depLoading ? (
        <div>loading..</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Manage Departments
            </h3>

            <Link
              to="/admin-dashboard/add-department"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition"
            >
              + Add Department
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                  <th className="p-3">#</th>
                  <th className="p-3">Department Name</th>
                  <th className="p-3">Employees</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {departments.map((dept, index) => (
                  <tr
                    key={dept._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{dept.dep_name}</td>
                    <td className="p-3">{dept.employees}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      {/* ✅ DELETE BUTTON CONNECTED */}
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {departments.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No departments found
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
