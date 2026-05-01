/* eslint-disable react/prop-types */
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Pagination,
  Avatar,
  useTheme,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material";
import PurchaseReturnStatusChip from "./StatusChip";

const PurchaseReturnTable = ({
  returns,
  isLoading,
  onView,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}) => {
  const theme = useTheme();

  const getAvatarColor = (initial) => {
    if (!initial) return theme.palette.primary.main;
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
    const charCode = initial.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        mb: 3,
      }}
    >
      {isLoading && <LinearProgress />}

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Return No</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Supplier</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Warehouse</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Items
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Amount
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {returns?.map((ret) => (
              <TableRow
                key={ret._id}
                sx={{
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    cursor: "pointer",
                  },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    {ret.referenceNo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarTodayIcon
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                      }}
                    />
                    {formatDate(ret.returnDate)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        mr: 1,
                        fontSize: "0.875rem",
                        bgcolor: getAvatarColor(
                          ret.suppliers?.[0]?.full_name?.charAt(0)
                        ),
                      }}
                    >
                      {ret.suppliers?.[0]?.full_name?.charAt(0) || "?"}
                    </Avatar>
                    {ret.suppliers?.[0]?.full_name || "Unknown"}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WarehouseIcon
                      fontSize="small"
                      sx={{
                        mr: 1,
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                      }}
                    />
                    {ret.warehouse?.name || "Unknown"}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={ret.items?.length || 0}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      borderRadius: "6px",
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography sx={{ fontWeight: "bold" }}>
                    ৳ {ret.totalReturnAmount?.toLocaleString() || "0"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <PurchaseReturnStatusChip status={ret.status} />
                </TableCell>
                <TableCell align="right">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => onView(ret._id)}
                        sx={{ color: theme.palette.primary.main }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => onEdit(ret._id)}
                        sx={{ color: theme.palette.warning.main }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => onDelete(ret._id)}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={onPageChange}
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: 1,
            },
          }}
        />
      </Box>
    </Paper>
  );
};
export default PurchaseReturnTable;
