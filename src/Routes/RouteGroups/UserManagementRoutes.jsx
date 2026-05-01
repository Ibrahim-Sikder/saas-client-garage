import Profile from "../../pages/Profile/Profile";
import UpdateProfile from "../../pages/Profile/UpdateProfile";
import AllTenantList from "../../pages/Tenant/AllTenantList";
import ContactUserList from "../../pages/Tenant/ContactUserList";
import RoleManagement from "../../pages/RoleManagement";
import Permission from "../../pages/Permission/Permission";
import PageManagement from "../../pages/PageManagement/PageManagement";
import { AllUserList } from "../../pages/Tenant/AllUserList";
import RecycleBinAllUser from "../../pages/Recyclebin/RecycleBinAllUser";
export const userManagementRoutes = [
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "profile-update",
    element: <UpdateProfile />,
    action: "edit",
  },
  {
    path: "all-tenant-list",
    element: <AllTenantList />,
  },
  {
    path: "all-user-list",
    element: <AllUserList />,
  },
  {
    path: "contact-customer",
    element: <ContactUserList />,
  },
  {
    path: "role-management",
    element: <RoleManagement />,
  },
  {
    path: "recycle-bin-user-list",
    element: <RecycleBinAllUser />,
  },
  {
    path: "user-permission",
    element: <Permission />,
  },
  {
    path: "page-management",
    element: <PageManagement />,
  },
];
