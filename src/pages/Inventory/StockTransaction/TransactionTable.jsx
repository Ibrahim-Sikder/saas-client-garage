/* eslint-disable react/prop-types */
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Box,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Typography,
  alpha,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  ArrowUpward as UpIcon,
  ArrowDownward as DownIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";

const TransactionTable = ({
  paginatedTransactions,
  headCells,
  page,
  rowsPerPage,
  order,
  orderBy,
  filteredTransactions,
  isLoading,
  searchTerm,
  filterType,
  handleRequestSort,
  setSearchTerm,
  setFilterType,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (type) => {
    setFilterType(type);
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          display: { sm:"flex"},
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search transactions..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { sm:300} }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display:"flex", alignItems: "center" }}>
          <Chip
            label={`Filter: ${
              filterType === "all"
                ? "All"
                : filterType === "in"
                ? "Stock In"
                : "Stock Out"
            }`}
            color={
              filterType === "all"
                ? "default"
                : filterType === "in"
                ? "success"
                : "error"
            }
            onClick={handleFilterClick}
            deleteIcon={<FilterIcon />}
            onDelete={handleFilterClick}
            sx={{ mr: {sm:1 }}}
          />
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleFilterClose("all")}>All</MenuItem>
            <MenuItem onClick={() => handleFilterClose("in")}>
              Stock In
            </MenuItem>
            <MenuItem onClick={() => handleFilterClose("out")}>
              Stock Out
            </MenuItem>
          </Menu>
          <Tooltip title="More options">
            <IconButton>
              <MoreIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
            >
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ fontWeight: 600 }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                      IconComponent={order === "asc" ? UpIcon : DownIcon}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={headCells.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Loading stock transactions...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <TableRow
                    key={transaction._id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{transaction.productName}</TableCell>
                    <TableCell>{transaction.warehouseName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {transaction.type === "in" ? (
                          <UpIcon color="success" sx={{ mr: 0.5 }} />
                        ) : (
                          <DownIcon color="error" sx={{ mr: 0.5 }} />
                        )}
                        {transaction.quantity}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          transaction.type === "in" ? "Stock In" : "Stock Out"
                        }
                        color={transaction.type === "in" ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{transaction.referenceType}</TableCell>
                    <TableCell>
                      <Tooltip title={transaction.referenceId}>
                        <span>
                          {transaction.referenceId.substring(0, 8)}...
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.date), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headCells.length}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography variant="h6" color="textSecondary">
                      No transactions found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Try adjusting your filters or search terms
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredTransactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TransactionTable;
