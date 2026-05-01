import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useStockTransactions } from "../../../hooks/useStockTransactions";
import SummaryCards from "./SummaryCards";
import TransactionTable from "./TransactionTable";

const StockTransaction = () => {
  const theme = useTheme();
  const {
    totalTransactions,
    totalIn,
    totalOut,
    error,
    isLoading,
    paginatedTransactions,
    headCells,
    page,
    rowsPerPage,
    order,
    orderBy,
    filteredTransactions,
    searchTerm,
    filterType,

    // Actions
    handleRefresh,
    handleExport,
    setPage,
    setRowsPerPage,
    handleRequestSort,
    setSearchTerm,
    setFilterType,
  } = useStockTransactions();

  return (
    <Box
      sx={{
        paddingY: 1,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        minHeight: "100vh",
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          Failed to load stock transactions. Please try again.
        </Alert>
      )}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: { sm: "flex" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography color="primary.main">
              <div className="text-[27px] md:text-4xl font-semibold">
                Stock Transactions
              </div>
            </Typography>
            <div className="flex justify-end">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{ mr: 1, padding: "5px" }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : "Refresh"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                sx={{ padding: "5px" }}
              >
                Export
              </Button>
            </div>
          </Box>

          <SummaryCards
            totalTransactions={totalTransactions}
            totalIn={totalIn}
            totalOut={totalOut}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <CardContent>
          <TransactionTable
            paginatedTransactions={paginatedTransactions}
            headCells={headCells}
            page={page}
            rowsPerPage={rowsPerPage}
            order={order}
            orderBy={orderBy}
            filteredTransactions={filteredTransactions}
            isLoading={isLoading}
            searchTerm={searchTerm}
            filterType={filterType}
            setPage={setPage}
            setRowsPerPage={setRowsPerPage}
            handleRequestSort={handleRequestSort}
            setSearchTerm={setSearchTerm}
            setFilterType={setFilterType}
            handleChangePage={(event, newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockTransaction;
