import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMoneyBillWave,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";

const EmployeeSalary = () => {
  const [salary, setSalary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logged in employee id
  const employeeId = localStorage.getItem("userId");

  useEffect(() => {
    fetchSalary();
  }, []);

  // ======================================
  // FETCH SALARY
  // ======================================

  const fetchSalary = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/salary/employee-salary/${employeeId}`
      );

      setSalary(res.data.salaries);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="p-10 text-2xl font-semibold">
        Loading Salary...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADING */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          My Salary
        </h1>

        <p className="text-gray-500 mt-2">
          View your salary slips and deductions
        </p>
      </div>

      {/* NO SALARY */}

      {salary.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center">

          <FaMoneyBillWave className="text-6xl text-pink-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-700">
            No Salary Records Found
          </h2>

          <p className="text-gray-500 mt-2">
            Salary details will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">

          {salary.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-3xl shadow-lg p-8"
            >

              {/* TOP */}

              <div className="flex justify-between items-center flex-wrap gap-4">

                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {item.month} {item.year}
                  </h2>

                  <p className="mt-2 text-gray-500">
                    Payment Status:
                    <span
                      className={`ml-2 font-semibold ${
                        item.status === "Paid"
                          ? "text-green-600"
                          : "text-yellow-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>

                <div className="bg-pink-100 px-6 py-4 rounded-2xl">

                  <p className="text-gray-500">
                    Net Salary
                  </p>

                  <h1 className="text-3xl font-bold text-pink-600">
                    ₹ {item.totalSalary}
                  </h1>
                </div>
              </div>

              {/* DETAILS */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

                {/* BASIC */}

                <div className="bg-gray-100 p-5 rounded-2xl">

                  <p className="text-gray-500">
                    Basic Salary
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    ₹ {item.basicSalary}
                  </h2>
                </div>

                {/* BONUS */}

                <div className="bg-green-100 p-5 rounded-2xl">

                  <div className="flex items-center gap-2 text-green-700">
                    <FaArrowUp />
                    <p>Bonus</p>
                  </div>

                  <h2 className="text-2xl font-bold mt-2 text-green-700">
                    ₹ {item.bonus}
                  </h2>
                </div>

                {/* DEDUCTIONS */}

                <div className="bg-red-100 p-5 rounded-2xl">

                  <div className="flex items-center gap-2 text-red-700">
                    <FaArrowDown />
                    <p>Deductions</p>
                  </div>

                  <h2 className="text-2xl font-bold mt-2 text-red-700">
                    ₹ {item.deductions}
                  </h2>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;