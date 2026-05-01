import { useState, useEffect } from "react";
import { useTenantDomain } from "./useTenantDomain";
import { useGetAllStockTransactionsQuery } from "../redux/api/stockTransactionApi";

export const useStockTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { tenantDomain } = useTenantDomain();

  const { data, error, isLoading, refetch } = useGetAllStockTransactionsQuery({
    tenantDomain,
    limit: 100,
    page: 1,
    searchTerm: "",
  });

  // Process API data when it changes
  useEffect(() => {
    if (data && data.data?.transactions) {
      // Transform the data to match our component structure
      const transformedData = data.data?.transactions?.map((item) => ({
        ...item,
        productName: item.product?.product_name || "Unknown Product",
        warehouseName: item.warehouse?.name || "Unknown Warehouse",
      }));
      setTransactions(transformedData);
      setFilteredTransactions(transformedData);
    }
  }, [data]);

  // Handle search and filter
  useEffect(() => {
    let result = transactions;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (transaction) =>
          transaction.productName?.toLowerCase().includes(term) ||
          transaction.warehouseName?.toLowerCase().includes(term) ||
          transaction.referenceType?.toLowerCase().includes(term) ||
          transaction.referenceId?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter((transaction) => transaction.type === filterType);
    }

    setFilteredTransactions(result);
    setPage(0);
  }, [searchTerm, filterType, transactions]);

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (orderBy === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    } else if (orderBy === "quantity") {
      return order === "asc"
        ? a.quantity - b.quantity
        : b.quantity - a.quantity;
    } else if (orderBy === "productName") {
      const nameA = a.productName || "";
      const nameB = b.productName || "";
      return order === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (orderBy === "warehouseName") {
      const warehouseA = a.warehouseName || "";
      const warehouseB = b.warehouseName || "";
      return order === "asc"
        ? warehouseA.localeCompare(warehouseB)
        : warehouseB.localeCompare(warehouseA);
    } else {
      const valueA = a[orderBy] || "";
      const valueB = b[orderBy] || "";
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
  });

  // Get paginated data
  const paginatedTransactions = sortedTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate summary statistics from API data
  const totalTransactions = data?.data?.totalTransactions || 0;
  const totalIn = data?.data?.totalStockIn || 0;
  const totalOut = data?.data?.totalStockOut || 0;

  const headCells = [
    { id: "productName", label: "Product" },
    { id: "warehouseName", label: "Warehouse" },
    { id: "quantity", label: "Quantity" },
    { id: "type", label: "Type" },
    { id: "referenceType", label: "Reference Type" },
    { id: "referenceId", label: "Reference ID" },
    { id: "date", label: "Date" },
  ];

  return {
    // State
    transactions,
    filteredTransactions,
    paginatedTransactions,
    page,
    rowsPerPage,
    order,
    orderBy,
    searchTerm,
    filterType,
    headCells,

    // Data
    totalTransactions,
    totalIn,
    totalOut,
    data,
    error,
    isLoading,

    // Actions
    setPage,
    setRowsPerPage,
    setOrder,
    setOrderBy,
    setSearchTerm,
    setFilterType,
    refetch,

    // Handlers
    handleRequestSort: (property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    handleChangePage: (event, newPage) => {
      setPage(newPage);
    },
    handleChangeRowsPerPage: (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    handleRefresh: () => {
      refetch();
      setSearchTerm("");
      setFilterType("all");
    },
    handleExport: () => {

    },
  };
};