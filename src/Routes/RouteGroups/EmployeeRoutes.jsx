import AddEmployee from "../../pages/Employee/AddEmployee";
import EmployeeList from "../../pages/Employee/EmployeeList";
import UpdateEmployee from "../../pages/Employee/UpdateEmployee";
import EmployeeProfile from "../../pages/Employee/EmployeeProfile";
import EmployeeLeave from "../../pages/Employee/EmployeeProfile/EmployeeLeave";
import Attendance from "../../pages/Employee/EmployeeProfile/Attendance";
import EmployeeSalary from "../../pages/Employee/EmployeeSalary";
import UpdateEmployeeSalary from "../../pages/Employee/UpdateEmployeeSalary";
import EmployeeOvertime from "../../pages/Employee/EmployeeOvertime";
import CreateEmployeeOverTime from "../../pages/Employee/CreateEmployeeOverTime";
import RecycledbinEmployeeList from "../../pages/Recyclebin/RecycledbinEmployeeList";
import SalaryList from "../../pages/Employee/SalaryList";

export const employeeRoutes = [
  {
    path: "add-employee",
    element: <AddEmployee />,
    action: "create",
  },
  {
    path: "employee-list",
    element: <EmployeeList />,
  },
  {
    path: "update-employee",
    element: <UpdateEmployee />,
    action: "edit",
  },
  {
    path: "employee-profile",
    element: <EmployeeProfile />,
  },
  {
    path: "employee-leave",
    element: <EmployeeLeave />,
  },
  {
    path: "employee-attendance",
    element: <Attendance />,
  },
  {
    path: "add-salary",
    element: <EmployeeSalary />,
  },
  {
    path: "salary-list",
    element: <SalaryList />,
  },
  {
    path: "employee-salary-update",
    element: <UpdateEmployeeSalary />,
    action: "edit",
  },
  {
    path: "employee-overtime",
    element: <EmployeeOvertime />,
  },
  {
    path: "create-overtime",
    element: <CreateEmployeeOverTime />,
    action: "create",
  },
  {
    path: "recycle-bin-employee-list",
    element: <RecycledbinEmployeeList />,
  },
];
