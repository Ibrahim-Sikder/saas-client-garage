import AddAttendance from "../../pages/Attendance/AddAttendance";
import AttendanceList from "../../pages/Attendance/AttendanceList";
import UpdateAttendance from "../../pages/Attendance/UpdateAttendance";
import ViewEmployeeAttendance from "../../pages/Attendance/ViewEmployeeAttendance";

export const attendanceRoutes = [
  {
    path: "add-attendance",
    element: <AddAttendance />,
    action: "create",
  },
  {
    path: "attendance-list",
    element: <AttendanceList />,
  },
  {
    path: "update-attendance",
    element: <UpdateAttendance />,
    action: "edit",
  },
  {
    path: "view-attendance",
    element: <ViewEmployeeAttendance />,
  },
];
