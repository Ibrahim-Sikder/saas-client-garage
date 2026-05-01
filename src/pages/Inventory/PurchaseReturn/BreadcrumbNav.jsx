import { Breadcrumbs, Link, Typography, useTheme } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { alpha } from "@mui/material";

export const BreadcrumbNav = () => {
  const theme = useTheme();
  
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{
        mb: 3,
        "& .MuiBreadcrumbs-ol": {
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          p: 1,
          borderRadius: 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        },
      }}
    >
      <Link
        color="inherit"
        href="/dashboard"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
        Dashboard
      </Link>
      <Link
        color="inherit"
        href="/purchase"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <ShoppingCartIcon sx={{ mr: 0.5, fontSize: 18 }} />
        Purchase
      </Link>
      <Typography
        color="text.primary"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <AssignmentReturnIcon sx={{ mr: 0.5, fontSize: 18 }} />
        Purchase Returns
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbNav;