"use client";

import { Box, Button, Card, CardContent, Chip, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { Add, CalendarMonth } from "@mui/icons-material";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

import { useDeleteAdjustmentMutation, useGetAllIAdjustmentQuery } from "../../../redux/api/adjustmentApi";
import { useAppOptions } from "../../../hooks/useAppOptions";
import Table from "../../../components/Table";
import { formatDate } from "../../../utils/formateDate";
import { DeleteIcon } from "lucide-react";
import Breadcrumb from "../../../components/Breadcrumb";
import { purchaseBtn, wrapBoxStyle } from "../../../utils/customStyle";

export default function QuantityAdjustment() {
  const theme = useTheme();
  const { tenantDomain } = useAppOptions();
  const { data: adjustmentData, isLoading } = useGetAllIAdjustmentQuery({ tenantDomain });
  const [deleteAdjustment] = useDeleteAdjustmentMutation();

  const adjustments = adjustmentData?.data?.adjustments || [];

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: theme.palette.error.main,
      cancelButtonColor: theme.palette.grey[500],
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAdjustment({ tenantDomain, id }).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "Adjustment has been deleted.",
            icon: "success",
            confirmButtonColor: theme.palette.primary.main,
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the Adjustment.",
            icon: "error",
            confirmButtonColor: theme.palette.error.main,
          });
        }
      }
    });
  };

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (row) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarMonth fontSize="small" color="primary" />
          <Typography variant="body2">{formatDate(row.date)}</Typography>
        </Stack>
      ),
    },
    {
      key: "referenceNo",
      label: "Reference No",
      render: (row) => <Chip label={row.referenceNo} color="primary" variant="outlined" size="small" />,
    },
    {
      key: "productCount",
      label: "Items",
      render: (row) => <Chip label={row.products.length} color="secondary" size="small" sx={{ fontWeight: "bold" }} />,
    },
    {
      key: "totalQuantity",
      label: "Total Qty",
      render: (row) => {
        const totalQuantity = row.products.reduce((sum, p) => sum + p.quantity, 0);
        return (
          <Typography variant="body2" fontWeight="bold" sx={{ color: totalQuantity > 0 ? "success.main" : "error.main" }}>
            {totalQuantity > 0 ? `+${totalQuantity}` : totalQuantity}
          </Typography>
        );
      },
    },
    {
      key: "products",
      label: "Products",
      render: (row) => (
        <Box sx={{ width: "100%" }}>
          {row.products.slice(0, 2).map((product, idx) => (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                mb: 1,
                borderLeft: `4px solid ${product.type === "addition" ? theme.palette.success.main : theme.palette.error.main}`,
              }}
            >
              <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight="bold">{product.productName}</Typography>
                  <Chip label={product.type} size="small" color={product.type === "addition" ? "success" : "error"} sx={{ height: 20 }} />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 0.5, fontSize: "0.75rem" }}>
                  <Typography variant="caption">Code: <b>{product.productCode}</b></Typography>
                  <Typography variant="caption">Qty: <b>{product.quantity}</b></Typography>
                  {product.serialNumber && <Typography variant="caption">S/N: <b>{product.serialNumber}</b></Typography>}
                </Stack>
              </CardContent>
            </Card>
          ))}
          {row.products.length > 2 && (
            <Tooltip
              title={
                <Box>
                  {row.products.slice(2).map((product, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="caption" fontWeight="bold">{product.productName}</Typography>
                      <Typography variant="caption" display="block">Code: {product.productCode}, Qty: {product.quantity}</Typography>
                    </Box>
                  ))}
                </Box>
              }
            >
              <Chip label={`+${row.products.length - 2} more`} size="small" variant="outlined" color="primary" sx={{ mt: 0.5 }} />
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      key: "note",
      label: "Note",
      render: (row) => (
        <Tooltip title={row.note || "No notes"}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
              color: row.note ? "text.primary" : "text.secondary",
              fontStyle: row.note ? "normal" : "italic",
            }}
          >
            {row.note || "No notes"}
          </Typography>
        </Tooltip>
      ),
    },
  ];

  const actions = [
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete Adjustment",
      onClick: (row) => handleDelete(row._id),
      requirePermission: true,
      permissionPage: "/dashboard/purchase-order",
      permissionAction: "delete",
      permissionMessage: "You don't have permission to delete this order",
    },
  ];

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Product" },
    { label: "Quantity Adjustment" },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Box display='flex' justifyContent='space-between'>
        <Breadcrumb items={breadcrumbItems} />

        <Button sx={purchaseBtn} component={Link} to="/dashboard/add-adjustment" variant="contained" startIcon={<Add />}>
          New Adjustment
        </Button>
      </Box>
      <Table
        title="Quantity Adjustments"
        columns={columns}
        data={adjustments}
        actions={actions}
        loading={isLoading}
        searchPlaceholder="Search by reference, product, or note..."
        emptyMessage="No adjustments found"
      />

    </Box>
  );
}
