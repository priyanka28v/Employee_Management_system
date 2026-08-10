import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import Swal from 'sweetalert2';
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [editForm, setEditForm] = useState({ dep_name: "", description: "", status: "active", employeeCount: 0 });
  const [editLoading, setEditLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDepartments = useCallback(async () => {
    setDepLoading(true);
    try {
      const url = statusFilter ? `http://127.0.0.1:5000/api/department?status=${statusFilter}` : 'http://127.0.0.1:5000/api/department';
      console.log('Fetching departments with URL:', url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log('Received departments:', response.data.departments?.map(d => ({id:d._id, status:d.status})));

      if (response.data.success) {
        setDepartment(response.data.departments || []);
      }
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to load departments");
      }
    } finally {
      setDepLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleEditClick = (dept) => {
    setEditDept(dept);
    setEditForm({ dep_name: dept.dep_name || "", description: dept.description || "", status: dept.status || "active", employeeCount: dept.employeeCount || 0 });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editForm.dep_name.trim()) return alert("Department name is required");

    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/api/department/update/${editDept._id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          showSuccessMessage: 'Department updated',
        }
      );
      if (response.data?.success) {
        setEditDept(null);
        fetchDepartments();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update department");
    }
  };

  // ✅ DELETE FUNCTION
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Department?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
    });
    if (!result.isConfirmed) return;

    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/department/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          showSuccessMessage: 'Department deleted',
        }
      );
      if (response.data?.success) {
        fetchDepartments();
      }
    } catch (error) {
      Swal.fire({ icon: 'error', text: error.response?.data?.error || 'Server error while deleting' });
    }
  };

  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: 'Deactivate Department?',
      text: 'Are you sure you want to deactivate this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate',
    });
    if (!result.isConfirmed) return;
    try {
      const response = await axios.patch(
        `http://127.0.0.1:5000/api/department/deactivate/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          showSuccessMessage: 'Department deactivated',
        }
      );
      if (response.data?.success) {
        fetchDepartments();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to deactivate department");
    }
  };

  const handleActivate = async (id) => {
    const result = await Swal.fire({
      title: 'Activate Department?',
      text: 'Are you sure you want to activate this department?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Yes, activate',
    });
    if (!result.isConfirmed) return;
    try {
      const response = await axios.patch(
        `http://127.0.0.1:5000/api/department/reactivate/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          showSuccessMessage: 'Department activated',
        }
      );
      if (response.data?.success) {
        fetchDepartments();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to activate department");
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

            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <Link
                to="/admin-dashboard/add-department"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
              >
                + Add Department
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 border-b">
                  <th className="p-3">#</th>
                  <th className="p-3">Department Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
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
                    <td className="p-3 capitalize cursor-pointer text-blue-600 hover:underline" onClick={() => dept.status === 'active' ? handleDeactivate(dept._id) : handleActivate(dept._id)}>{dept.status === 'active' ? 'Active' : 'Inactive'}</td>
                    <td className="p-3 font-bold text-gray-700">{dept.employeeCount || 0}</td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => handleEditClick(dept)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit Department"
                      >
                        <FaEdit />
                      </button>
                      {dept.status === "active" ? (
                        <button
                          onClick={() => handleDeactivate(dept._id)}
                          className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition ml-2 flex items-center"
                          title="Deactivate Department"
                        >
                          <FaTimes className="mr-1" /> Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(dept._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition ml-2 flex items-center"
                          title="Activate Department"
                        >
                          <FaCheck className="mr-1" /> Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="text-red-600 hover:text-red-800 transition ml-2"
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

              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full p-2.5 border rounded-lg outline-none bg-gray-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Employees</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.employeeCount}
                  onChange={(e) => setEditForm({ ...editForm, employeeCount: Number(e.target.value) })}
                  className="w-full p-2.5 border rounded-lg bg-gray-50"
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
