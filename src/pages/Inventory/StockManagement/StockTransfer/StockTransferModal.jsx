// StockManagement/StockTransfer/StockTransferModal.js
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useCallback } from "react";
import {
  Box,
  Button,
  LinearProgress,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { useGetAllStocksQuery } from "../../../../redux/api/stocksApi";
import { useGetAllWarehousesQuery } from "../../../../redux/api/warehouseApi";

import StockTransferForm from "./StockTransferForm";
import useStockTransfer from "../../../../hooks/useStockTransfer";
import toast from "react-hot-toast";
import GarageModal from "../../../../components/Share/Modal/GarageModal";

function StockTransferModal({
  open,
  onClose,
  onSubmit,
  tenantDomain,
  performActionWithPermission,
}) {
  const theme = useTheme();

  const { data: stockData, isLoading: stockLoading } = useGetAllStocksQuery({
    tenantDomain,
    page: 1,
    limit: 100,
    searchTerm: "",
  });
  const { data: warehouseResponse, isLoading: warehouseLoading } =
    useGetAllWarehousesQuery({
      tenantDomain,
      page: 1,
      limit: 100,
      searchTerm: "",
    });
  const {
    formData,
    transferItems,
    errors,
    warehouses,
    availableProducts,
    formSubmitting,
    handleInputChange,
    handleSelectChange,
    handleAddItem,
    handleRemoveItem,
    handleProductChange,
    handleQuantityChange,
    handleNoteChange,
    handleSubmit,
    getWarehouseName,
    resetForm,
  } = useStockTransfer({
    stockData,
    warehouseResponse,
    tenantDomain,
  });
  const handleSafeClose = useCallback(() => {
    resetForm();
    if (onClose && typeof onClose === "function") {
      setTimeout(() => {
        onClose();
      }, 0);
    }
  }, [onClose, resetForm]);

  const handleFormSubmit = async () => {
    performActionWithPermission(
      "/dashboard/stock-transfer",
      "create",
      async () => {
        let res;
        try {
          res = await handleSubmit((result) => {
            if (result.success) {
              handleSafeClose();
              if (onSubmit && typeof onSubmit === "function") {
                onSubmit(result.data);
              }
            }
          });
          if (res.success) {
            toast.success(res.message || "Stock transfer successfully !");
          }
        } catch (error) {
          toast.error(error.message || "Failed to transfer");
        }
      },
      `You don't have permission to stock transfer`
    );
  };

  const isLoading = stockLoading || warehouseLoading || formSubmitting;
  const title = "Stock Transfer ";
  return (

    <GarageModal open={open} setOpen={onClose} title={title} maxWidth="md">
      {isLoading ? (
        <LinearProgress sx={{ my: 4 }} />
      ) : (
        <StockTransferForm
          formData={formData}
          transferItems={transferItems}
          errors={errors}
          warehouses={warehouses}
          availableProducts={availableProducts}
          formSubmitting={formSubmitting}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleProductChange={handleProductChange}
          handleQuantityChange={handleQuantityChange}
          handleNoteChange={handleNoteChange}
          handleSubmit={handleSubmit}
          getWarehouseName={getWarehouseName}
          theme={theme}
        />
      )}
      {formSubmitting && <LinearProgress sx={{ mt: 3 }} />}

      <Box display='flex' justifyContent='end'>

        <Button
          onClick={handleFormSubmit}
          variant="contained"
          disabled={
            isLoading ||
            formSubmitting ||
            !formData.fromLocation ||
            !formData.toLocation ||
            !formData.transferredBy ||
            !transferItems ||
            transferItems.length === 0 ||
            transferItems.some((item) => !item || !item.product) ||
            transferItems.some(
              (item) => item && item.product && item.quantity <= 0
            ) ||
            Object.keys(errors).length > 0
          }
          sx={{
            borderRadius: 2,
            py: 1,
            px: 3,
            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          }}
        >
          Complete Transfer
        </Button>
      </Box>
    </GarageModal>
  );
}

export default StockTransferModal;
