/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext } from "react";
import { CircularProgress, Box, Typography, Button } from "@mui/material";
import { useTenantDomain } from "../hooks/useTenantDomain";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/feature/authSlice";
import { useGetUserPermissionQuery } from "../redux/api/userApi";
import swal from "sweetalert";

const PermissionContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within PermissionProvider");
  }
  return context;
};

export const PermissionProvider = ({ children }) => {
  const { tenantDomain } = useTenantDomain();
  const user = useSelector(selectCurrentUser);

  const {
    data: permissionData,
    isLoading,
    error,
    isError,
  } = useGetUserPermissionQuery(
    { userId: user?.userId, tenantDomain },
    {
      skip: !user?.userId || !tenantDomain,
    },
  );

  const permissions = permissionData?.data?.permissions || [];
  const checkPermission = (pagePath, action = "view") => {
    if (!permissions || permissions.length === 0) {
      return false;
    }

    const permission = permissions.find((p) => {
      if (!p.page) {
        return false;
      }

      const page = p.page;
      if (!page) return false;
      const possiblePaths = [
        pagePath,
        pagePath.endsWith("/") ? pagePath.slice(0, -1) : pagePath + "/",
        pagePath.startsWith("/") ? pagePath : "/" + pagePath,
      ];

      const pathMatch =
        possiblePaths.includes(page.path) || possiblePaths.includes(page.route);

      return pathMatch;
    });

    if (!permission) {
      return false;
    }

    const hasAction = permission[action] === true;

    return hasAction;
  };

  const hasPageAccess = (pagePath) => {
    return checkPermission(pagePath, "view");
  };

  const performActionWithPermission = (
    pagePath,
    action,
    callback,
    alertMessage,
  ) => {
    if (checkPermission(pagePath, action)) {
      callback();
    } else {
      swal({
        title: "Access Denied!",
        text:
          alertMessage || `You don't have permission to ${action} this item.`,
        icon: "error",
        button: "OK",
        className: "permission-alert",
      });
    }
  };

  const value = {
    permissions,
    loading: isLoading,
    error: isError ? error?.message || "Failed to fetch permissions" : null,
    checkPermission,
    hasPageAccess,
    performActionWithPermission,
    user,
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" mt={2}>
            Loading permissions...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center">
          <Typography variant="h6" color="error">
            Error loading permissions: {error?.message || "Unknown error"}
          </Typography>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/login")}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};
