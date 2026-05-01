import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const BreadcrumbNavigation = () => (
  <Breadcrumbs
    separator={<NavigateNextIcon fontSize="small" />}
    sx={{ mb: 3 }}
  >
    <Link color="inherit" href="/dashboard">
      Dashboard
    </Link>
    <Link color="inherit" href="/inventory">
      Inventory
    </Link>
    <Typography color="text.primary">Warranties</Typography>
  </Breadcrumbs>
);