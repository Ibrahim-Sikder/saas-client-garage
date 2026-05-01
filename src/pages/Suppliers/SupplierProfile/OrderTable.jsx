/* eslint-disable react/prop-types */
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  Button,
  Tooltip,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  LocalShipping,
  FilterList,
  Add,
  CheckCircle,
  Cancel,
  Pending,
  CalendarToday,
  Inventory,
  Timeline,
  ReceiptLong,
} from "@mui/icons-material";

import { GlassCard, StatusChip } from "./supplier";
import PurchaseOrderModal from "../../Inventory/PurchaseOrder/PurchaseOrderModal";
import UpdatePurchaseOrderModal from "../../Inventory/UpdatePurchaseOrderModal";
import ReceiveDialog from "../../Inventory/PurchaseOrder/ReceiveDialog";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import {
  useDeletePurchaseOrderMutation,
  useGetAllPurchaseOrdersQuery,
} from "../../../redux/api/purchaseOrderApi";
import Table from "../../../components/Table";
import { DeleteIcon, EditIcon } from "lucide-react";
import { formatDate } from "../../../utils/formateDate";

const OrderTable = ({ refetch: parentRefetch }) => {
  const theme = useTheme();
  const { tenantDomain } = useTenantDomain();

  // UI State
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filter & sort state
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");
  const [sortOption, setSortOption] = useState(""); // e.g. "orderDate,-grandTotal"

  // Modals state
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [receivingOrderId, setReceivingOrderId] = useState(null);

  const [deletePurchase] = useDeletePurchaseOrderMutation();

  // Fetch orders
  const { data, isLoading, refetch } = useGetAllPurchaseOrdersQuery({
    tenantDomain,
    limit,
    page,
    searchTerm,
    status: selectedStatus || undefined,
    paymentStatus: selectedPaymentStatus || undefined,
    sort: sortOption || undefined,
  });

  const orders = data?.data?.orders || [];
  const meta = data?.meta || {};
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
      case "Paid":
        return theme.palette.success.main;
      case "Pending":
        return theme.palette.warning.main;
      case "Cancelled":
      case "Unpaid":
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
      case "Paid":
        return <CheckCircle fontSize="small" />;
      case "Pending":
      case "Unpaid":
        return <Pending fontSize="small" />;
      case "Cancelled":
        return <Cancel fontSize="small" />;
      default:
        return null;
    }
  };

  const calculateTotalItems = (products = []) =>
    products.reduce((total, p) => total + (p.quantity || 0), 0);
  const handleDeleteOrder = async (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deletePurchase({
            tenantDomain,
            id: order._id,
          }).unwrap();
          if (res.success) {
            toast.success("Purchase order deleted successfully!");
            refetch();
            parentRefetch?.();
          }
        } catch (error) {
          Swal.fire("Error", "Failed to delete purchase order", "error");
        }
      }
    });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const applyFilters = () => {
    setPage(1);
    refetch();
    setFilterMenuAnchor(null);
  };
  const columns = [
    {
      key: "referenceNo",
      label: "Reference No",
      render: (order) => (
        <div className="flex items-center">
          <ReceiptLong className="mr-2 text-primary" />{" "}
          {order.referenceNo ?? "N/A"}
        </div>
      ),
    },
    {
      key: "orderDate",
      label: "Order Date",
      render: (order) => (
        <div className="flex items-center">
          <CalendarToday className="mr-2 text-gray-500" />{" "}
          {formatDate(order.orderDate)}
        </div>
      ),
    },
    {
      key: "products",
      label: "Items",
      render: (order) => (
        <div className="flex items-center">
          <Inventory className="mr-2 text-blue-500" />{" "}
          {calculateTotalItems(order.products)}
        </div>
      ),
    },
    {
      key: "grandTotal",
      label: "Amount",
      render: (order) => <>৳{order.grandTotal?.toLocaleString()}</>,
    },
    {
      key: "expectedDeliveryDate",
      label: "Delivery Date",
      render: (order) => (
        <div className="flex items-center">
          <Timeline className="mr-2 text-purple-500" />{" "}
          {formatDate(order.expectedDeliveryDate)}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (order) => (
        <StatusChip
          icon={getStatusIcon(order.status)}
          label={order.status}
          size="small"
          statuscolor={getStatusColor(order.status)}
        />
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (order) => (
        <StatusChip
          icon={getStatusIcon(order.paymentStatus)}
          label={order.paymentStatus}
          size="small"
          statuscolor={getStatusColor(order.paymentStatus)}
        />
      ),
    },
  ];

  const actions = [
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
      tooltip: "Edit Order",
      onClick: (order) => {
        setSelectedOrder(order);
        setOpenUpdate(true);
      },
    },
    {
      key: "receive",
      label: "Receive",
      icon: LocalShipping,
      tooltip: "Receive Items",
      onClick: (order) => {
        setReceivingOrderId(order._id);
        setOpenReceiveDialog(true);
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      tooltip: "Delete Order",
      onClick: (order) => handleDeleteOrder(order),
    },
  ];

  return (
    <GlassCard>
      <div className="flex items-center space-x-3 mb-3">
        <Tooltip title="Filter orders">
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
            sx={{ borderRadius: 20 }}
          >
            Filter
          </Button>
        </Tooltip>

        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: 20,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
            boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
          onClick={() => setOpenCreate(true)}
        >
          Create Order
        </Button>
      </div>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <MenuItem>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem>
          <FormControl fullWidth>
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              label="Payment Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="">Default</MenuItem>
              <MenuItem value="orderDate">Order Date ↑</MenuItem>
              <MenuItem value="-orderDate">Order Date ↓</MenuItem>
              <MenuItem value="grandTotal">Amount ↑</MenuItem>
              <MenuItem value="-grandTotal">Amount ↓</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem>
          <Button variant="contained" fullWidth onClick={applyFilters}>
            Apply
          </Button>
        </MenuItem>
      </Menu>

      <Table
        title="Purchase Orders"
        columns={columns}
        data={orders}
        actions={actions}
        loading={isLoading}
        onSearch={handleSearch}
        searchPlaceholder="Search by reference no, status, payment..."
        currentPage={page}
        totalPages={meta?.totalPage || 1}
        onPageChange={setPage}
        emptyMessage="No purchase orders found"
      />

      {openCreate && (
        <PurchaseOrderModal
          tenantDomain={tenantDomain}
          onClose={() => setOpenCreate(false)}
          open={openCreate}
        />
      )}
      {openUpdate && selectedOrder && (
        <UpdatePurchaseOrderModal
          tenantDomain={tenantDomain}
          onClose={() => setOpenUpdate(false)}
          open={openUpdate}
          orderId={selectedOrder._id}
        />
      )}
      {openReceiveDialog && (
        <ReceiveDialog
          open={openReceiveDialog}
          purchaseId={receivingOrderId}
          onClose={() => setOpenReceiveDialog(false)}
        />
      )}
    </GlassCard>
  );
};

export default OrderTable;
