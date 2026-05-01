import ProtectedRoute from "../PrivateRoute";

export const createRoute = ({ path, element, action = "view" }) => {
  const fullPath = `/dashboard/${path}`;

  return {
    path,
    element: (
      <ProtectedRoute pagePath={fullPath} action={action}>
        {element}
      </ProtectedRoute>
    ),
  };
};

export const createRoutes = (routes) => routes.map(createRoute);
