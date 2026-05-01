import GoogleCalendar from "../../components/GoogleCalendar/GoogleCalendar";
import Backup from "../../pages/Backup/Backup";
import RestoreDatabase from "../../pages/Backup/RestoreDatabase";
import CompanyBrand from "../../pages/CompanyBrand/CompanyBrand";
import Home from "../../pages/Home/Home";
import Review from "../../pages/Review/Review";

export const otherRoutes = [
  {
    path: "",
    element: <Home />,
  },
  {
    path: "company-brand",
    element: <CompanyBrand />,
  },
  {
    path: "review",
    element: <Review />,
  },
  {
    path: "backup",
    element: <Backup />,
  },
  {
    path: "restore",
    element: <RestoreDatabase />,
  },
  {
    path: "calender",
    element: <GoogleCalendar />,
  },
];
