import EmployeeHoliday from "../../pages/Holiday/Holiday";
import CreateHoliday from "../../pages/Holiday/CreateHoliday";
import UpdateHoliday from "../../pages/Holiday/UpdateHoliday";

export const holidayRoutes = [
  {
    path: "holiday",
    element: <EmployeeHoliday />,
  },
  {
    path: "create-holiday",
    element: <CreateHoliday />,
    action: "create",
  },
  {
    path: "update-holiday",
    element: <UpdateHoliday />,
    action: "edit",
  },
];
