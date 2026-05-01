"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import {
  FaFileInvoice,
  FaMoneyBillWave,
  FaSearch,
  FaCreditCard,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import {
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Pencil, Trash2 } from "lucide-react";
import swal from "sweetalert";

import {
  useDeleteBillPayMutation,
  useGetAllBillPaysQuery,
} from "../../redux/api/bill-pay";

import Loading from "../../components/Loading/Loading";
import { deleteIconStyle, editIconStyle } from "../../style/tableStyle";

// Payment status colors
const statusColors = {
  paid: { bg: "#e6f7ee", color: "#0e9f6e", borderColor: "#0e9f6e" },
  partially_paid: { bg: "#fef3c7", color: "#d97706", borderColor: "#d97706" },
  pending: { bg: "#fee2e2", color: "#ef4444", borderColor: "#ef4444" },
};

// Payment method icons
const getPaymentMethodIcon = (method) => {
  switch (method) {
    case "Bank Transfer":
      return <FaCreditCard />;
    case "Check":
      return <FaFileInvoiceDollar />;
    case "Cash":
      return <FaMoneyBillWave />;
    case "Credit Card":
      return <FaCreditCard />;
    case "Mobile Payment":
      return <FaMoneyBillWave />;
    default:
      return <FaMoneyBillWave />;
  }
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.common.white,
}));

const PaybillList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const limit = 10;

  const { data: allPaybills, isLoading: paybillLoading } =
    useGetAllBillPaysQuery({
      limit,
      page: currentPage,
      searchTerm: searchTerm,
      status: filterStatus !== "all" ? filterStatus : undefined,
    });

  const [deletePaybill, { isLoading: deleteLoading }] =
    useDeleteBillPayMutation();

  const handleDeletePaybill = async (id) => {
  
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this bill payment record?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await deletePaybill(id).unwrap();
        swal(
          "Deleted!",
          "Bill payment record deleted successfully.",
          "success"
        );
      } catch (error) {
        swal("Error", "An error occurred while deleting the record.", "error");
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  if (paybillLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        bgcolor: "white",
        padding: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FaFileInvoice
            size={28}
            color="#42A1DA"
            style={{ marginRight: "12px" }}
          />
          <Typography variant="h5" fontWeight="bold">
            Bill Payment History
          </Typography>
        </Box>

        <Link to="/dashboard/add-paybill">
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
              boxShadow: "0 4px 12px rgba(66, 161, 218, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #2980b9 0%, #1e6091 100%)",
              },
            }}
          >
            Add New Bill Payment
          </Button>
        </Link>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search by supplier, bill number, or amount..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flexGrow: 1, minWidth: "200px", maxWidth: "400px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch color="#42A1DA" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: "180px" }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filterStatus}
            onChange={handleStatusFilter}
            label="Filter by Status"
            startAdornment={<FilterListIcon sx={{ color: "#42A1DA", mr: 1 }} />}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="partially_paid">Partially Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="paybill table">
          <TableHead
            sx={{
              background: "linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%)",
            }}
          >
            <TableRow>
              <StyledTableCell>Supplier ID </StyledTableCell>
              <StyledTableCell>Supplier Name </StyledTableCell>
              <StyledTableCell>Bill Number</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell align="right">Amount</StyledTableCell>
              <StyledTableCell align="center">Payment Method</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Due Date</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allPaybills?.data?.data?.map((paybill) => (
              <TableRow
                key={paybill._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "rgba(66, 161, 218, 0.04)" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>{paybill.supplierId}</TableCell>

                <TableCell>
                  <Tooltip title={`Supplier: ${paybill.name}`}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: "0.875rem",
                          bgcolor: "#42A1DA",
                          mr: 1,
                        }}
                      >
                        {paybill.name.charAt(0)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: "150px" }}
                      >
                        {paybill.name}
                      </Typography>
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>{paybill.against_bill}</TableCell>
                <TableCell>
                  <Chip
                    label={paybill.bill_category || "N/A"}
                    size="small"
                    sx={{
                      backgroundColor: "#e6f7ff",
                      color: "#0072b1",
                      textTransform: "capitalize",
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "#2980b9" }}
                  >
                    $
                    {Number(paybill.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Tooltip title={paybill.payment_method}>
                    <Chip
                      icon={getPaymentMethodIcon(paybill.payment_method)}
                      label={paybill.payment_method}
                      size="small"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Tooltip>
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={paybill.payment_status || "pending"}
                    size="small"
                    sx={{
                      backgroundColor:
                        statusColors[paybill.payment_status || "pending"]?.bg ||
                        "#f3f4f6",
                      color:
                        statusColors[paybill.payment_status || "pending"]
                          ?.color || "#6b7280",
                      border: `1px solid ${
                        statusColors[paybill.payment_status || "pending"]
                          ?.borderColor || "#d1d5db"
                      }`,
                      textTransform: "capitalize",
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2">
                    {new Date(paybill.due_date).toLocaleDateString()}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="View Details">
                      <IconButton component={Link} to={`/dashboard/paybill-view?id=${paybill._id}`} size="small" sx={{ color: "#42A1DA" }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Link to={`/dashboard/update-paybill?id=${paybill._id}`}>
                      <Tooltip title="Edit">
                        <Box sx={editIconStyle}>
                          <Pencil size={18} />
                        </Box>
                      </Tooltip>
                    </Link>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        disabled={deleteLoading}
                        onClick={() => handleDeletePaybill(paybill._id)}
                      >
                        <Box component="span" sx={deleteIconStyle}>
                          <Trash2 size={18} />
                        </Box>
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {allPaybills?.data?.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 5,
          }}
        >
          <FaFileInvoice
            size={48}
            color="#d1d5db"
            style={{ marginBottom: "16px" }}
          />
          <Typography variant="h6" color="text.secondary">
            No bill payment records found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Try changing your search or filter criteria
          </Typography>
          <Link to="/dashboard/add-paybill">
            <Button
              variant="outlined"
              sx={{
                borderColor: "#42A1DA",
                color: "#42A1DA",
                "&:hover": {
                  borderColor: "#2980b9",
                  backgroundColor: "rgba(66, 161, 218, 0.04)",
                },
              }}
            >
              Add Your First Bill Payment
            </Button>
          </Link>
        </Box>
      )}

      {allPaybills?.data?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(
              currentPage * limit,
              allPaybills?.meta?.totalItems?.count || 0
            )}{" "}
            of {allPaybills?.meta?.totalItems?.count || 0} entries
          </Typography>

          <Pagination
            count={Math.ceil(
              (allPaybills?.meta?.totalItems?.count || 0) / limit
            )}
            page={currentPage}
            color="primary"
            onChange={(_, page) => setCurrentPage(page)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#42A1DA",
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(66, 161, 218, 0.1) !important",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PaybillList;
