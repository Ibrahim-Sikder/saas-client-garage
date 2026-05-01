/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import Table from "@/components/Table";
import { useGetWareHouseStocksQuery } from "@/redux/api/warehouseApi";
import { useAppOptions } from "@/hooks/useAppOptions";
import Breadcrumb from "../../../components/Breadcrumb";
import WarehouseStatsCards from "./WarehouseStatsCards";
import WarehouseStockDetailModal from "./WarehouseStockDetailModal";

const WarehouseStockOverview = () => {
  const { tenantDomain } = useAppOptions();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, refetch } = useGetWareHouseStocksQuery({
    tenantDomain,
    page: currentPage,
    limit: pageSize,
  });
  const warehouseData = data?.data?.warehouseStocks || [];
  const metaData = data?.data?.meta || {};
  const filteredWarehouses = useMemo(() => {
    return warehouseData.filter((warehouse) => {
      const warehouseMatch =
        selectedWarehouse === "all" ||
        warehouse?.warehouse?.name === selectedWarehouse;
      const cityMatch =
        selectedCity === "all" || warehouse?.warehouse?.city === selectedCity;
      const statusMatch =
        statusFilter === "all" || warehouse?.warehouse?.status === statusFilter;
      const searchMatch =
        warehouse?.warehouse?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        warehouse?.warehouse?.city
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return warehouseMatch && cityMatch && statusMatch && searchMatch;
    });
  }, [
    warehouseData,
    selectedWarehouse,
    selectedCity,
    statusFilter,
    searchTerm,
  ]);

  const [selectedWarehouseForModal, setSelectedWarehouseForModal] =
    useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleView = (warehouse) => {
    setSelectedWarehouseForModal(warehouse);
    setOpenModal(true);
  };

  const columns = [
    { key: "index", label: "#", type: "index" },
    {
      key: "warehouse.name",
      label: "Warehouse Name",
      render: (item) => (
        <Typography variant="body2" fontWeight="medium">
          {item?.warehouse?.name || "—"}
        </Typography>
      ),
    },
    {
      key: "warehouse.warehouseId",
      label: "Warehouse ID",
      render: (item) => item?.warehouse?.warehouseId || "—",
    },
    {
      key: "warehouse.city",
      label: "City",
      render: (item) => item?.warehouse?.city || "—",
    },
    {
      key: "warehouse.address",
      label: "Address",
      render: (item) => item?.warehouse?.address || "—",
    },
    {
      key: "warehouse.manager",
      label: "Manager",
      render: (item) => item?.warehouse?.manager || "—",
    },
    {
      key: "warehouse.phone",
      label: "Phone",
      render: (item) => item?.warehouse?.phone || "—",
    },
    {
      key: "totalProducts",
      label: "Total Products",
      render: (item) => (
        <Chip label={item?.totalProducts || 0} color="primary" size="small" />
      ),
    },
    {
      key: "totalQuantity",
      label: "Total Stock Quantity",
      render: (item) => (
        <Typography variant="body2" color="primary" fontWeight="bold">
          {item?.totalQuantity || 0}
        </Typography>
      ),
    },
    {
      key: "warehouse.status",
      label: "Status",
      render: (item) => (
        <Chip
          label={item?.warehouse?.status || "—"}
          color={item?.warehouse?.status === "active" ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  const actions = [
    {
      label: "View Products",
      icon: Visibility,
      tooltip: "View Products in Warehouse",
      onClick: handleView,
    },
  ];

  // Get unique values for filters
  const uniqueWarehouses = [
    ...new Set(warehouseData.map((item) => item?.warehouse?.name)),
  ].filter(Boolean);

  const uniqueCities = [
    ...new Set(warehouseData.map((item) => item?.warehouse?.city)),
  ].filter(Boolean);

  // Calculate total stats
  const totalWarehouses = metaData.total || warehouseData.length;
  const totalQuantity = warehouseData.reduce(
    (acc, cur) => acc + (cur?.totalQuantity || 0),
    0,
  );
  const totalProducts = warehouseData.reduce(
    (acc, cur) => acc + (cur?.totalProducts || 0),
    0,
  );

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleWarehouseChange = (value) => {
    setSelectedWarehouse(value);
    setCurrentPage(1);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <Box className="p-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Inventory", href: "/inventory" },
          { label: "Warehouse Stock Overview" },
        ]}
      />

      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Warehouse Stock Overview
      </Typography>

      <WarehouseStatsCards
        totalWarehouses={totalWarehouses}
        totalQuantity={totalQuantity}
        totalProducts={totalProducts}
      />

      <Box className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl border">
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            value={selectedWarehouse}
            onChange={(e) => handleWarehouseChange(e.target.value)}
            label="Warehouse"
          >
            <MenuItem value="all">All</MenuItem>
            {uniqueWarehouses.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            label="City"
          >
            <MenuItem value="all">All</MenuItem>
            {uniqueCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by warehouse name or city..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 240 }}
        />

        <Button
          variant="contained"
          onClick={() => {
            refetch();
            setCurrentPage(1);
          }}
          sx={{ ml: "auto" }}
        >
          Refresh
        </Button>
      </Box>

      <Table
        title={`Warehouses (${totalWarehouses} total)`}
        columns={columns}
        data={filteredWarehouses}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={metaData.totalPage || 1}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        searchPlaceholder="Search by warehouse name or city..."
        emptyMessage="No warehouses found."
      />

      {selectedWarehouseForModal && (
        <WarehouseStockDetailModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedWarehouseForModal(null);
          }}
          warehouse={selectedWarehouseForModal}
        />
      )}
    </Box>
  );
};

export default WarehouseStockOverview;
