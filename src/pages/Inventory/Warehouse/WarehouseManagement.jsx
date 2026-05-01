"use client";
import { useState, useEffect } from "react";
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { Add as AddIcon, Visibility as VisibilityIcon, Warehouse as WarehouseIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import swal from "sweetalert";
import { DeleteIcon, EditIcon } from "lucide-react";
import { useGetAllWarehousesQuery, useDeleteWarehouseMutation } from "../../../redux/api/warehouseApi";
import WarehouseModal from "./WarehouseModal";
import ViewWarehouseDetails from "./WarehouseDetailsModal";
import { formatDate } from "../../../utils/formateDate";
import { useAppOptions } from "../../../hooks/useAppOptions";

import Breadcrumb from "../../../components/Breadcrumb";
import SummaryCards from "../../../components/SummaryCard";

import { warehouseTypes } from "../../../data";
import Table from "../../../components/Table";
import { purchaseBtn } from "../../../utils/customStyle";

export default function WarehouseManagement() {

  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editWarehouseId, setEditWarehouseId] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [setSearchTerm] = useState("");

  const { data: warehouseData, isLoading: isDataLoading, refetch } = useGetAllWarehousesQuery({ tenantDomain });
  const [deleteWarehouse] = useDeleteWarehouseMutation();


  useEffect(() => setLoading(isDataLoading), [isDataLoading]);
  useEffect(() => {
    if (warehouseData?.data?.warehouses) setWarehouses(warehouseData.data.warehouses);
  }, [warehouseData]);

  const handleClickOpen = () => { setEditWarehouseId(null); setOpen(true); };
  const handleClose = () => { setOpen(false); setEditWarehouseId(null); };
  const handleEditOpen = (id) => { setEditWarehouseId(id); setOpen(true); };
  const handleViewDetails = (warehouse) => { setSelectedWarehouse(warehouse); setViewDetailsOpen(true); };
  const handleCloseDetails = () => { setViewDetailsOpen(false); setSelectedWarehouse(null); };

  const handleDeleteWarehouse = async (id) => {
    performActionWithPermission('/dashboard/warehouse', 'delete', async () => {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "You want to move this warehouse to Recycle bin?",
        icon: "warning",
        dangerMode: true,
      });

      if (willDelete) {
        try {
          await deleteWarehouse({ tenantDomain, id }).unwrap();
          swal("Move to Recycle bin!", "Move to Recycle bin successful.", "success");
          refetch();
        } catch (error) {
          swal("Error", "An error occurred while deleting the warehouse.", "error");
        }
      }
    }, `You don't have permission to delete warehouse`);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "active": return <CheckCircleIcon color="success" />;
      case "inactive": return <CheckCircleIcon color="error" />;
      default: return <CheckCircleIcon color="success" />;
    }
  };

  const getTypeLabel = (type) => {
    const typeObj = warehouseTypes.find((t) => t.value === type) || { value: type, label: type };
    return typeObj.label;
  };

  const columns = [
    { key: "warehouseId", label: "ID" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type", render: (w) => getTypeLabel(w.type) },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "manager", label: "Manager" },
    { key: "capacity", label: "Capacity", render: (w) => w.capacity ? `${w.capacity} sq ft` : "N/A" },
    { key: "openingDate", label: "Opening Date", render: (w) => w.openingDate ? formatDate(w.openingDate) : "N/A" },
    { key: "status", label: "Status", render: (w) => getStatusChip(w.status) },
  ];

  const actions = [
    {
      key: "view",
      label: "View",
      icon: VisibilityIcon,
      tooltip: "View details",
      onClick: (w) => handleViewDetails(w),
    },
    {
      key: "edit",
      label: "Edit",
      icon: EditIcon,
      tooltip: "Edit warehouse",
      onClick: (w) => handleEditOpen(w._id),
    },
    {
      key: "delete",
      label: "Delete",
      icon: DeleteIcon,
      tooltip: "Delete warehouse",
      onClick: (w) => handleDeleteWarehouse(w._id),
      requirePermission: true,
      permissionPage: "/dashboard/warehouse",
      permissionAction: "delete",
      permissionMessage: "You don't have permission to delete warehouse",
    },
  ];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Warehouse", href: "/dashboard/warehouse" },
    { label: "Warehouse Management" },
  ];

  const summaryCardData = [
    {
      title: "Total Warehouses",
      value: loading ? <LinearProgress sx={{ my: 2 }} /> : warehouses.length,
      subtitle: "Total number of warehouses and locations",
      color: "#006a4e",
      bgColor: "#006a4e",
      icon: <WarehouseIcon />,
    },
    {
      title: "Active Warehouses",
      value: loading ? <LinearProgress sx={{ my: 2 }} /> : warehouses.filter((w) => w.status === "active").length,
      subtitle: "Number of active warehouses",
      color: "#4caf50",
      bgColor: "#4caf50",
      icon: <CheckCircleIcon />,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumb items={breadcrumbItems} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>Warehouse Management</Typography>

      </Box>

      <SummaryCards cards={summaryCardData} />

      <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", mb: 3 }}>

        <Button sx={purchaseBtn} variant="contained" startIcon={<AddIcon />} onClick={handleClickOpen}>
          New Warehouse
        </Button>
      </Box>

      <Table
        title="Warehouses"
        columns={columns}
        data={warehouses}
        actions={actions}
        loading={loading}
        onSearch={(val) => setSearchTerm(val)}
        searchPlaceholder="Search warehouses by name, city, manager..."
      />

      <WarehouseModal open={open} onClose={handleClose} warehouseId={editWarehouseId} />
      <ViewWarehouseDetails
        setOpen={setViewDetailsOpen}
        open={viewDetailsOpen}
        onClose={handleCloseDetails}
        warehouse={selectedWarehouse}
        getTypeChip={getTypeLabel}
        getStatusChip={getStatusChip}
        onEdit={handleEditOpen}
      />

    </Box>
  );
}
