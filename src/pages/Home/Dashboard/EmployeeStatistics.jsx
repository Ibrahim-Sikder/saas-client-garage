/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { HiOutlineCheckCircle } from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import { useGetAllEmployeesQuery } from "../../../redux/api/employee";
import Loading from "../../../components/Loading/Loading";
import DashboardLeave from "./DashboardLeave";
import "react-circular-progressbar/dist/styles.css";

const EmployeeStatistics = ({ tenantDomain }) => {
  const { data: employeeData, isLoading } = useGetAllEmployeesQuery({
    tenantDomain,
    limit: 10,
    page: 1,
  });

  if (isLoading) {
    return <Loading />;
  }

  // total employee calculate
  const totalEmployee = employeeData?.data?.employees?.length;
  const activeEmployees = (employeeData?.data?.employees || []).filter(
    (employee) => employee.status === "Active"
  );
  const activeEmployeeCount = activeEmployees?.length;
  const activeEmployeePercentage =
    totalEmployee > 0 ? (activeEmployeeCount / totalEmployee) * 100 : 0;

  // due salary calculate
  const dueSalary = employeeData?.data?.employees?.reduce(
    (totalDue, employee) => {
      const employeeDue = employee.salary.reduce(
        (sum, salaryEntry) => sum + salaryEntry.due,
        0
      );
      return totalDue + employeeDue;
    },
    0
  );

  // total salary
  const totalSalary = employeeData?.data?.employees?.reduce(
    (totalDue, employee) => {
      const totalSalary = employee.salary.reduce(
        (sum, salaryEntry) => sum + (salaryEntry.salary_amount || 0),
        0
      );
      return totalDue + totalSalary;
    },
    0
  );

  // advance salary calculate
  const advanceSalary = employeeData?.data?.employees?.reduce(
    (totalDue, employee) => {
      const salaryAdvance = employee.salary.reduce(
        (sum, salaryEntry) => sum + salaryEntry.advance,
        0
      );
      return totalDue + salaryAdvance;
    },
    0
  );

  const advanceSalaryPercentage = Math.ceil(
    advanceSalary > 0 ? (advanceSalary / totalSalary) * 100 : 0
  );

  // late employee calculate
  const lateEmployeeCount = employeeData?.data?.employees?.reduce(
    (totalLate, employee) => {
      const lateCount = employee.attendance.reduce((count, attendanceEntry) => {
        return count + (attendanceEntry.late_status ? 1 : 0);
      }, 0);
      return totalLate + lateCount;
    },
    0
  );
  const lateEmployeePercentage =
    totalEmployee > 0 ? (lateEmployeeCount / totalEmployee) * 100 : 0;

  // absent employee calculate
  const AbsentEmployeeCount = employeeData?.data?.employees?.reduce(
    (totalAbsent, employee) => {
      const absentCount = employee.attendance.reduce(
        (count, attendanceEntry) => {
          return count + (attendanceEntry.absent ? 1 : 0);
        },
        0
      );
      return totalAbsent + absentCount;
    },
    0
  );
  const absentEmployeePercentage =
    totalEmployee > 0 ? (AbsentEmployeeCount / totalEmployee) * 100 : 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sectionMargin mb-10">
      {/* Employee Statistics */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl p-6">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Employee Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Employee */}
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={activeEmployeePercentage}
                    text={`${Math.round(activeEmployeePercentage)}%`}
                    styles={{
                      path: {
                        stroke: `#10b981`,
                        strokeLinecap: "round",
                      },
                      text: {
                        fill: "#10b981",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                      trail: {
                        stroke: "#d1fae5",
                      },
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-lg font-bold text-gray-900">
                    {activeEmployeeCount}/{totalEmployee}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Today Leave */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={absentEmployeePercentage}
                    text={`${Math.round(absentEmployeePercentage)}%`}
                    styles={{
                      path: {
                        stroke: `#f97316`,
                        strokeLinecap: "round",
                      },
                      text: {
                        fill: "#f97316",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                      trail: {
                        stroke: "#ffedd5",
                      },
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Today Leave
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {AbsentEmployeeCount}/{totalEmployee}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Today Late */}
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-4 border border-red-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={lateEmployeePercentage}
                    text={`${Math.round(lateEmployeePercentage)}%`}
                    styles={{
                      path: {
                        stroke: `#ef4444`,
                        strokeLinecap: "round",
                      },
                      text: {
                        fill: "#ef4444",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                      trail: {
                        stroke: "#fee2e2",
                      },
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Today Late
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {lateEmployeeCount}/{totalEmployee}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Advance Salary */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={advanceSalaryPercentage}
                    text={`${Math.round(advanceSalaryPercentage)}%`}
                    styles={{
                      path: {
                        stroke: `#3b82f6`,
                        strokeLinecap: "round",
                      },
                      text: {
                        fill: "#3b82f6",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                      trail: {
                        stroke: "#dbeafe",
                      },
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Advance Salary
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ৳{advanceSalary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Due Salary */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={90}
                    text={`90%`}
                    styles={{
                      path: {
                        stroke: `#8b5cf6`,
                        strokeLinecap: "round",
                      },
                      text: {
                        fill: "#8b5cf6",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                      trail: {
                        stroke: "#f3e8ff",
                      },
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Due Salary
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ৳{dueSalary}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Holiday */}
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl p-4 border border-cyan-200/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={90}
                    text={`90%`}
                    styles={{
                      path: {
                        stroke: `#06b6d4`,
                        strokeLinecap: "round",
                      },
                      text: {
                        fill: "#06b6d4",
                        fontSize: "24px",
                        fontWeight: "bold",
                      },
                      trail: {
                        stroke: "#cffafe",
                      },
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Holiday
                  </p>
                  <p className="text-lg font-bold text-gray-900">5/30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Leave */}
      <div className="xl:col-span-1">
        <DashboardLeave />
      </div>
    </div>
  );
};

export default EmployeeStatistics;
