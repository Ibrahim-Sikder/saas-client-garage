import Role from "../../pages/Role/Role";
import AddRole from "../../pages/Role/AddRole";
import UpdateRole from "../../pages/Role/UpdateRole";

export const roleRoutes = [
  {
    path: "role",
    element: <Role />,
  },
  {
    path: "add-role",
    element: <AddRole />,
    action: "create",
  },
  {
    path: "update-role",
    element: <UpdateRole />,
    action: "edit",
  },
];
