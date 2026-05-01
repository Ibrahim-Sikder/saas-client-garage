/* eslint-disable react/prop-types */
// components/EmployeeSalaryEmptyState.jsx
import { TableRow, TableCell, Box, Typography } from "@mui/material";
import { MonetizationOn } from "@mui/icons-material";

const EmployeeSalaryEmptyState = ({ filterMonth, filterYear, filterDay, currentYear }) => {
  return (
    <TableRow>
      <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MonetizationOn sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No salary records found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {filterMonth || filterYear !== currentYear || filterDay
              ? "Try adjusting your filters or try a different search"
              : "No salary records available for this employee"}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeSalaryEmptyState;