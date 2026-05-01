/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material";
import { purchaseBtn } from "../../../utils/customStyle";

const PageHeader = ({ onAddReturn }) => {
  const theme = useTheme();

  return (
    <div className="flex justify-between mb-3 items-center bg-paper p-2 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <h1
        className="font-bold"
        style={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Purchase Returns
      </h1>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddReturn}
        sx={purchaseBtn}
      >
        New Return
      </Button>
    </div>
  );
};
export default PageHeader