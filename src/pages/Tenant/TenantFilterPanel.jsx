/* eslint-disable react/prop-types */
// TenantFilterPanel.jsx
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
} from "@mui/material";
import { FaSearch, FaPlus } from "react-icons/fa";

const TenantFilterPanel = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterPayment,
  setFilterPayment,
  onAddTenant,
}) => {
  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
      <TextField
        placeholder="Search tenants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <FaSearch style={{ marginRight: 8, color: "#666" }} />
          ),
        }}
      />
      <FormControl>
        <InputLabel>Status</InputLabel>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="blocked">Blocked</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Payment</InputLabel>
        <Select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
        >
          <MenuItem value="all">All Payments</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="unpaid">Unpaid</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" startIcon={<FaPlus />} onClick={onAddTenant}>
        Add Tenant
      </Button>
    </Box>
  );
};

export default TenantFilterPanel;
