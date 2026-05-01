import CompanyProfile from "../../pages/Company/CompanyProfile";
import AddCompany from "../../pages/Company/AddCompany";
import UpdateCompany from "../../pages/Company/UpdateCompany";
import CompanyList from "../../pages/Company/CompanyList";
import RecycledbinCompanyList from "../../pages/Recyclebin/RecycledbinCompanyList";

export const companyRoutes = [
  {
    path: "company-profile",
    element: <CompanyProfile />,
  },
  {
    path: "add-company",
    element: <AddCompany />,
    action: "create",
  },
  {
    path: "update-company",
    element: <UpdateCompany />,
    action: "edit",
  },
  {
    path: "company-list",
    element: <CompanyList />,
  },
  {
    path: "recycle-bin-company-list",
    element: <RecycledbinCompanyList />,
  },
];
