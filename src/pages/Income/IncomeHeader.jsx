/* eslint-disable no-unused-vars */
import { Box, styled, Typography } from "@mui/material";
import { FaFileInvoice } from "react-icons/fa";

const HeaderBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: "2rem",
  padding: "1rem",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
  color: "white",
  boxShadow: "0 4px 12px rgba(66, 161, 218, 0.3)",
}));

const IncomeHeader = () => {
  return (
    <HeaderBox>
      <FaFileInvoice className="text-4xl mr-4" />
      <div>
        <Typography variant="h4" fontWeight="bold">
          Add Income
        </Typography>
        <Typography variant="body2">Dashboard / Income Management</Typography>
      </div>
    </HeaderBox>
  );
};

export default IncomeHeader;
