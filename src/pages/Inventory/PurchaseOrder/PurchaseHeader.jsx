/* eslint-disable react/prop-types */
import { AddIcCallOutlined } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { purchaseBtn } from "../../../utils/customStyle";

const PageHeader = ({ onAddOrder }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 3,
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        p: 2,
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{
          m: 0,
          fontWeight: "bold",
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Purchase Orders
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcCallOutlined />}
        onClick={onAddOrder}
        sx={purchaseBtn}
      >
        New Order
      </Button>
    </Box>
  );
};

export default PageHeader;