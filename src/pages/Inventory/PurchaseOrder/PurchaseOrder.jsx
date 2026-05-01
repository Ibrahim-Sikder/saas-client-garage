/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { Home, Receipt } from "@mui/icons-material";
import { DeleteIcon, EditIcon, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useDeletePurchaseOrderMutation, useGetAllPurchaseOrdersQuery } from "../../../redux/api/purchaseOrderApi";
import { useAppOptions } from "../../../hooks/useAppOptions";
import PageHeader from "./PurchaseHeader";
import FiltersSection from "./PurchaseFilter";
import PurchaseOrderModal from "./PurchaseOrderModal";
import UpdatePurchaseOrderModal from "../UpdatePurchaseOrderModal";
import ReceiveDialog from "./ReceiveDialog";
import SummaryCards from "./PurchaseSummaryCards";
import { Package } from "lucide-react";
import Table from "../../../components/Table";
import Breadcrumb from "../../../components/Breadcrumb";
import { wrapBoxStyle } from "../../../utils/customStyle";
export default function PurchaseOrder() {
  const { tenantDomain, search, setSearch, searchTerm, setSearchTerm, performActionWithPermission } = useAppOptions();
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [filterStatus, setFilterStatus] = useState("all");

  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [openReceiveDialog, setOpenReceiveDialog] = useState(false);
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiveStatus, setReceiveStatus] = useState("received");
  const [receiveNote, setReceiveNote] = useState("");
  const [receivingOrderId, setReceivingOrderId] = useState(null);

  const [deletePurchase] = useDeletePurchaseOrderMutation();
  const { data: purchaseOrderData, refetch, isLoading } = useGetAllPurchaseOrdersQuery({
    tenantDomain,
    limit: 10,
    page,
    searchTerm: search,
  });
  const handlePageChange = (newPage) => setPage(newPage);

  const handleSearch = (value) => {
    setSearch(value);
    setSearchTerm(value);
    setPage(1);
  };

  const handleAddOrder = () => setOpenPurchaseModal(true);

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setOpenUpdateModal(true);
  };

  const handleDeleteOrder = (order) => {
    performActionWithPermission("/dashboard/purchase-order", "delete", async () => {
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
            const res = await deletePurchase({ tenantDomain, id: order._id }).unwrap();
            if (res.success) {
              toast.success("Purchase order deleted successfully!");
              refetch();
              Swal.fire("Deleted!", "The purchase order has been deleted.", "success");
            }
          } catch (error) {
            Swal.fire("Error", "Failed to delete purchase order", "error");
            console.error(error);
          }
        }
      });
    }, "You don't have permission to delete order");
  };

  const handleOpenReceiveDialog = (order) => {
    setReceivingOrderId(order._id);
    setOpenReceiveDialog(true);
  };

  const handleCloseReceiveDialog = () => {
    setOpenReceiveDialog(false);
    setReceivingOrderId(null);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };
  const columns = [
    { key: "referenceNo", label: "Order No" },
    { key: "suppliers.0.full_name", label: "Supplier" },
    { key: "totalQuantity", label: "Total Quantity", render: (order) => order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0 },
    { key: "products.0.unit_price", label: "Product Price (৳)" },
    { key: "grandTotal", label: "Total Amount (৳)", render: (order) => order.grandTotal?.toLocaleString("en-US") || "-" },
    { key: "status", label: "Status" },
    { key: "orderDate", label: "Order Date", render: (order) => new Date(order.orderDate).toLocaleDateString() },
    { key: "expectedDeliveryDate", label: "Expected Delivery", render: (order) => new Date(order.expectedDeliveryDate).toLocaleDateString() },
  ];

  const actions = [

    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit",
      onClick: handleEditOrder,
    },
    {
      key: "receive",
      icon: Package,
      tooltip: "Receive",
      onClick: handleOpenReceiveDialog,
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete",
      onClick: handleDeleteOrder,
      requirePermission: true,
      permissionPage: "/dashboard/purchase-order",
      permissionAction: "delete",
      permissionMessage: "You don't have permission to delete this order",
    },
  ];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Purchase", href: "/purchase", icon: ShoppingCart },
    { label: "Purchase Orders", icon: Receipt },
  ];


  return (
    <Box sx={wrapBoxStyle}>


      <Breadcrumb items={breadcrumbItems} />;

      <PageHeader onAddOrder={handleAddOrder} />
      <SummaryCards purchaseOrderData={purchaseOrderData} />

      <FiltersSection
        searchTerm={searchTerm}
        onSearch={handleSearch}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
      />

      <Table
        title="Purchase Orders"
        columns={columns}
        data={purchaseOrderData?.data?.orders || []}
        loading={isLoading}
        currentPage={page}
        totalPages={purchaseOrderData?.data?.meta?.totalPage || 1}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        actions={actions}
      />

      <PurchaseOrderModal
        open={openPurchaseModal}
        onClose={() => setOpenPurchaseModal(false)}
        tenantDomain={tenantDomain}
      />

      {openUpdateModal && selectedOrder && (
        <UpdatePurchaseOrderModal
          tenantDomain={tenantDomain}
          onClose={() => setOpenUpdateModal(false)}
          open={openUpdateModal}
          orderId={selectedOrder._id}
        />
      )}

      <ReceiveDialog
        setOpen={setOpenReceiveDialog}
        open={openReceiveDialog}
        receiveDate={receiveDate}
        receiveStatus={receiveStatus}
        receiveNote={receiveNote}
        purchaseId={receivingOrderId}
        onClose={handleCloseReceiveDialog}
        onReceiveDateChange={setReceiveDate}
        onReceiveStatusChange={setReceiveStatus}
        onReceiveNoteChange={setReceiveNote}
      />
    </Box>
  );
}
