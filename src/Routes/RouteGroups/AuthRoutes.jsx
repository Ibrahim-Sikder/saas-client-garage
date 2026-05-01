import LandingPage from "../../pages/Login/LandingPage";
import Login from "../../pages/Login/Login";
import Unauthorized from "../../pages/UnAuthorized";

export const authRoutes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "unauthorized",
    element: <Unauthorized />,
  },
];
