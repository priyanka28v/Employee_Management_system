import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api/employees';

export const getEmployees = (params, token) =>
  axios.get(API_BASE, { params, headers: { Authorization: `Bearer ${token}` } });

export const addEmployee = (data, token) =>
  axios.post(`${API_BASE}/add`, data, { headers: { Authorization: `Bearer ${token}` } });

export const getEmployeeById = (id, token) =>
  axios.get(`${API_BASE}/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const updateEmployee = (id, data, token) =>
  axios.put(`${API_BASE}/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });

export const updateLeaveAllocation = (id, data, token) =>
  axios.patch(`${API_BASE}/${id}/leave-allocation`, data, { headers: { Authorization: `Bearer ${token}` } });

export const upsertSalary = (id, data, token) =>
  axios.patch(`${API_BASE}/${id}/salary`, data, { headers: { Authorization: `Bearer ${token}` } });
