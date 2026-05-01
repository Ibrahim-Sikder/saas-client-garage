/* eslint-disable react/prop-types */
import AddIcon from "@mui/icons-material/Add";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Box, Button, Typography } from "@mui/material";
import { purchaseBtn } from "../../../utils/customStyle";

export const PageHeader = ({ handleOpenModal }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 4,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #6a1b9a, #8e24aa)",
          backgroundClip: "text",
          textFillColor: "transparent",
        }}
      >
        <VerifiedUserIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Warranty Management
      </Typography>

      <Box sx={{ display: { sm: "flex" }, gap: 2 }}>
        <div className=" flex justify-end mb-2">
          <Button
            variant="contained"
            sx={purchaseBtn}
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
          >
            New Warranty
          </Button>
        </div>
      </Box>
    </Box>
  );
};
