import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= AUTH ================= */

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

/* ================= DASHBOARDS ================= */

import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/aboutEmployee/EmployeeDashboard";

/* ================= EMPLOYEE HOME ================= */

import EmployeeHome from "./pages/aboutEmployee/EmployeeHome";

/* ================= PROTECTED ROUTES ================= */

import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

/* ================= ADMIN COMPONENTS & PAGES ================= */

import AdminSummary from "./components/Dashboard/AdminSummary";
import DepartmentList from "./components/departments/DepartmentList";
import AddDepartment from "./components/departments/AddDepartment";
import EmployeeList from "./components/employee/EmployeeList";
import AddEmployee from "./components/employee/AddEmployee";
import EditEmployee from "./components/employee/EditEmployee";
import EmployeeDetail from "./components/employee/EmployeeDetail";
import AdminLeaves from "./pages/leaves/AdminLeaves";
import AdminSalary from "./pages/salary/AdminSalary";
import AdminAttendance from "./pages/attendance/AdminAttendance";

/* ================= EMPLOYEE PAGES ================= */

import ApplyLeave from "./pages/leaves/ApplyLeave";
import EmployeeLeaves from "./pages/leaves/EmployeeLeaves";

import Attendance from "./pages/attendance/attendance";
import AttendanceDashboard from "./pages/attendance/attendanceDashboard";

import Profile from "./pages/profile/Profile";

import EmployeeSalary from "./pages/salary/EmployeeSalary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= DEFAULT ================= */}

        <Route path="/" element={<Navigate to="/login" />} />

        {/* ================= AUTH ================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* =========================================================
                            ADMIN ROUTES
        ========================================================= */}

        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          {/* ADMIN HOME */}
          <Route index element={<AdminSummary />} />

          {/* EMPLOYEES */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />

          {/* DEPARTMENTS */}
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />

          {/* ATTENDANCE */}
          <Route path="attendance" element={<AdminAttendance />} />
          <Route
            path="attendance-dashboard"
            element={<AttendanceDashboard />}
          />

          {/* LEAVE REQUESTS */}
          <Route path="leaves" element={<AdminLeaves />} />

          {/* SALARY */}
          <Route path="salary" element={<AdminSalary />} />

          {/* PROFILE */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* =========================================================
                          EMPLOYEE ROUTES
        ========================================================= */}

        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          {/* EMPLOYEE HOME PAGE */}
          <Route index element={<EmployeeHome />} />

          {/* PROFILE */}
          <Route path="profile" element={<Profile />} />

          {/* APPLY LEAVE */}
          <Route path="apply-leave" element={<ApplyLeave />} />

          {/* EDIT LEAVE */}
          <Route path="edit-leave/:id" element={<ApplyLeave />} />

          {/* MY LEAVES */}
          <Route path="my-leaves" element={<EmployeeLeaves />} />

          {/* ATTENDANCE */}
          <Route path="attendance" element={<Attendance />} />

          {/* ATTENDANCE DASHBOARD */}
          <Route
            path="attendance-dashboard"
            element={<AttendanceDashboard />}
          />

          {/* SALARY */}
          <Route path="salary" element={<EmployeeSalary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
