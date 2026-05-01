/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../context/PermissionContext";
import AccessDenied from "../components/AccessDenied";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "../redux/feature/authSlice";

const ProtectedRoute = ({ children, pagePath, action = "view" }) => {
  const {
    checkPermission,
    loading: permissionsLoading,
    user,
  } = usePermissions();
  const { loading: authLoading } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (authLoading || permissionsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // if (!user?.accessToken || !user?.refreshToken) {
  //   dispatch(logout());
  //   navigate("/login", { replace: true });
  //   return null;
  // }

  const hasAccess = checkPermission(pagePath, action);

  if (!hasAccess) {
    return <AccessDenied pagePath={pagePath} />;
  }

  return children;
};

export default ProtectedRoute;
