import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [editForm, setEditForm] = useState({ dep_name: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);

  const fetchDepartments = async () => {
    setDepLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/department",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setDepartment(response.data.departments || []);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      }
    } finally {
      setDepLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEditClick = (dept) => {
    setEditDept(dept);
    setEditForm({ dep_name: dept.dep_name || "", description: dept.description || "" });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.dep_name.trim()) return alert("Department name is required");

    setEditLoading(true);
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/department/${editDept._id}`,
        editForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.success) {
        setEditDept(null);
        fetchDepartments();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update department");
    } finally {
      setEditLoading(false);
    }
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setDepartment(departments.filter((dep) => dep._id !== id));
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete department");
    }
  };

  return (
    <>
      {depLoading ? (
        <div className="text-center py-12 text-gray-500">Loading departments...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Manage Departments
            </h3>

            <Link
              to="/admin-dashboard/add-department"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
            >
              + Add Department
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 border-b">
                  <th className="p-3">#</th>
                  <th className="p-3">Department Name</th>
                  <th className="p-3">Description</th>
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
                    <td className="p-3 font-semibold text-gray-800">{dept.dep_name}</td>
                    <td className="p-3 text-gray-500 max-w-xs truncate">{dept.description || "-"}</td>
                    <td className="p-3 font-bold text-gray-700">{dept.employeeCount || 0}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => handleEditClick(dept)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit Department"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Department"
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

      {/* EDIT MODAL */}
      {editDept && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Edit Department</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold mb-1">Department Name</label>
                <input
                  type="text"
                  value={editForm.dep_name}
                  onChange={(e) => setEditForm({ ...editForm, dep_name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg outline-none bg-gray-50"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 border rounded-lg outline-none bg-gray-50 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDept(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
