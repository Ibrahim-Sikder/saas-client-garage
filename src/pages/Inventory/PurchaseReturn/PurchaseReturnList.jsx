import { Toaster } from "react-hot-toast";
import { Box, useTheme, alpha } from "@mui/material";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { usePurchaseReturns } from "../../../hooks/usePurchaseReturns.js";
import PageHeader from "./PageHeader.jsx";
import BreadcrumbNav from "./BreadcrumbNav.jsx";
import FilterSection from "./FilterSection.jsx";
import ActionMenu from "./ActionMenu.jsx";
import Table from "../../../components/Table.jsx";
import { DeleteIcon, EditIcon } from "lucide-react";
import PurchaseReturnStatusChip from "./StatusChip.jsx";
import SummaryCards from "../../../components/SummaryCard.jsx";

function PurchaseReturnList() {
  const theme = useTheme();
  const {
    searchTerm,
    anchorEl,
    dateRange,
    filterStatus,
    filterWarehouse,
    isLoading,
    purchaseLoading,
    page,
    selectedReturn,
    purchaseReturnData,
    warehouseOptions,
    totalReturns,
    pendingReturns,
    completedReturns,
    cancelledReturns,
    handleMenuClose,
    handleViewReturn,
    handleEditReturn,
    handleDeleteReturn,
    handleAddReturn,
    handleDateRangeChange,
    handlePageChange,
    handleSearchChange,
    setFilterStatus,
    setFilterWarehouse,
  } = usePurchaseReturns();

  const cardsData = [
    {
      title: "Total Returns",
      value: totalReturns,
      color: theme.palette.primary.main,
      bgColor: theme.palette.primary.light,
      icon: <AssignmentReturnIcon />,
    },
    {
      title: "Pending Returns",
      value: pendingReturns,
      color: theme.palette.warning.main,
      bgColor: theme.palette.warning.light,
      icon: <ReceiptIcon />,
    },
    {
      title: "Completed Returns",
      value: completedReturns,
      color: theme.palette.success.main,
      bgColor: theme.palette.success.light,
      icon: <AssignmentReturnIcon />,
    },
    {
      title: "Cancelled Returns",
      value: cancelledReturns,
      color: theme.palette.error.main,
      bgColor: theme.palette.error.light,
      icon: <DeleteIcon />,
    },
  ];

  const columns = [
    { key: "referenceNo", label: "Return No" },
    {
      key: "returnDate",
      label: "Date",
      render: (item) => new Date(item.returnDate).toLocaleDateString(),
    },
    { key: "suppliers.0.full_name", label: "Supplier" },
    { key: "warehouse.name", label: "Warehouse" },
    { key: "items", label: "Items", render: (item) => item.items?.length || 0 },
    {
      key: "totalReturnAmount",
      label: "Amount",
      render: (item) => `৳ ${item.totalReturnAmount?.toLocaleString() || "0"}`,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <PurchaseReturnStatusChip status={item.status} />,
    },
  ];

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit",
      onClick: (item) => handleEditReturn(item._id),
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete",
      onClick: (item) => handleDeleteReturn(item._id),
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.primary.light,
          0.05
        )}, ${alpha(theme.palette.background.default, 1)})`,
        minHeight: "100vh",
        p: { xs: 0, md: 2 },
        borderRadius: 2,
      }}
    >
      <BreadcrumbNav />
      <PageHeader onAddReturn={handleAddReturn} />

      <SummaryCards cards={cardsData} />

      <FilterSection
        searchTerm={searchTerm}
        dateRange={dateRange}
        filterStatus={filterStatus}
        filterWarehouse={filterWarehouse}
        warehouseOptions={warehouseOptions}
        onSearchChange={handleSearchChange}
        onDateRangeChange={handleDateRangeChange}
        onStatusChange={(e) => setFilterStatus(e.target.value)}
        onWarehouseChange={(e) => setFilterWarehouse(e.target.value)}
      />

      <Table
        title="Purchase Returns"
        columns={columns}
        data={purchaseReturnData?.data?.returns || []}
        actions={actions}
        loading={isLoading || purchaseLoading}
        currentPage={page}
        totalPages={purchaseReturnData?.data?.meta?.totalPage || 1}
        onPageChange={handlePageChange}
        onSearch={handleSearchChange}
        emptyMessage="No purchase returns found"
      />

      <ActionMenu
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        onView={() => handleViewReturn(selectedReturn?._id)}
        onEdit={() => handleEditReturn(selectedReturn?._id)}
        onDelete={() => handleDeleteReturn(selectedReturn?._id)}
        onPrint={handleMenuClose}
      />

      <Toaster position="top-right" />
    </Box>
  );
}

export default PurchaseReturnList;
