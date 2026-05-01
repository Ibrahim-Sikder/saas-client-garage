/* eslint-disable react/prop-types */
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

const Breadcrumb = ({ items }) => {
  return (
    <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" sx={{ mb: 3 }}>
      {items.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            color="inherit"
            href={item.href}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {item.icon && <item.icon sx={{ mr: 0.5, fontSize: 18 }} />} {item.label}
          </Link>
        ) : (
          <Typography
            key={index}
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {item.icon && <item.icon sx={{ mr: 0.5, fontSize: 18 }} />} {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
