import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useTheme } from "@mui/material";
import { useTenantDomain } from "./useTenantDomain";
import {
  useDeletePurchaseReturnMutation,
  useGetAllPurchaseReturnsQuery,
} from "../redux/api/purchaseReturnApi";
import { useGetAllWarehousesQuery } from "../redux/api/warehouseApi";
import { useAppOptions } from "./useAppOptions";

export const usePurchaseReturns = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { tenantDomain } = useTenantDomain();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { performActionWithPermission } = useAppOptions()

  // API mutations and queries
  const [deletePurchaseReturn] = useDeletePurchaseReturnMutation();
  const { data: warehouseData } = useGetAllWarehousesQuery({
    tenantDomain,
    limit: 1000000,
    page: 1,
    searchTerm: "",
  });

  const {
    data: purchaseReturnData,
    isLoading: purchaseLoading,
    refetch,
  } = useGetAllPurchaseReturnsQuery({
    tenantDomain,
    limit: 10,
    page,
    searchTerm: search,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    status: filterStatus !== "all" ? filterStatus : undefined,
    warehouse: filterWarehouse !== "all" ? filterWarehouse : undefined,
  });

  // Derived data
  const warehouseOptions = useMemo(() => {
    if (!warehouseData?.data?.warehouses) return [];
    return warehouseData.data.warehouses.map((war) => ({
      label: war.name,
      value: war._id,
    }));
  }, [warehouseData?.data?.warehouses]);

  const totalReturns = purchaseReturnData?.data?.meta?.total || 0;
  const pendingReturns =
    purchaseReturnData?.data?.returns?.filter((ret) => ret.status === "pending")
      .length || 0;
  const completedReturns =
    purchaseReturnData?.data?.returns?.filter(
      (ret) => ret.status === "completed"
    ).length || 0;
  const cancelledReturns =
    purchaseReturnData?.data?.returns?.filter(
      (ret) => ret.status === "cancelled"
    ).length || 0;

  // Event handlers
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReturn(null);
  };

  const handleViewReturn = (id) => {
    navigate(`/dashboard/purchase-return?id=${id}`);
    handleMenuClose();
  };

  const handleEditReturn = (id) => {
    navigate(`/dashboard/update-purchase-return?id=${id}`);
    handleMenuClose();
  };

  const handleDeleteReturn = async (id) => {
    performActionWithPermission('/dashboard/purchase-return', 'delete',
      async () => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: theme.palette.primary.main,
          cancelButtonColor: theme.palette.error.main,
          confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsLoading(true);
              await deletePurchaseReturn({ tenantDomain, id }).unwrap();
              toast.success("Purchase return deleted successfully!");
              refetch();
              Swal.fire("Deleted!", "Purchase return has been deleted.", "success");
            } catch (error) {
              console.error("Failed to delete purchase return:", error);
              toast.error("Failed to delete purchase return");
              Swal.fire("Error!", "Failed to delete purchase return.", "error");
            } finally {
              setIsLoading(false);
            }
          }
        });
        handleMenuClose();

      }, "You don't have permission to delete purchase return "
    )
  };

  const handleAddReturn = () => {
    navigate("/dashboard/purchase-return-add");
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({ ...dateRange, [name]: value });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const timeoutId = setTimeout(() => {
      setSearch(e.target.value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  return {
    // State
    searchTerm,
    anchorEl,
    dateRange,
    filterStatus,
    filterWarehouse,
    isLoading,
    purchaseLoading,
    page,
    selectedReturn,

    // Data
    purchaseReturnData,
    warehouseOptions,
    totalReturns,
    pendingReturns,
    completedReturns,
    cancelledReturns,

    // Event handlers
    handleMenuClose,
    handleViewReturn,
    handleEditReturn,
    handleDeleteReturn,
    handleAddReturn,
    handleDateRangeChange,
    handlePageChange,
    handleSearchChange,
    setAnchorEl,
    setSelectedReturn,
    setFilterStatus,
    setFilterWarehouse,
  };
};
