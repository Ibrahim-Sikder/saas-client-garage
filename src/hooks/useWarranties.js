/* eslint-disable no-unused-vars */
import { useState } from "react";
import Swal from "sweetalert2";
import {
  useDeleteWarrantyMutation,
  useGetAllWarrantyQuery,
} from "../redux/api/warrantyApi";
import { useAppOptions } from "./useAppOptions";

export const useWarranties = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    performActionWithPermission,
    tenantDomain,
    currentPage,
    setCurrentPage,
  } = useAppOptions();
  const queryParams = {
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm,
  };

  const {
    data: warrantyData,
    isLoading,
    refetch,
  } = useGetAllWarrantyQuery(queryParams);
  const [deleteWarranty] = useDeleteWarrantyMutation();

  const warranties = warrantyData?.data || [];

  const handleOpenModal = () => {
    setEditingWarranty(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingWarranty(null);
  };

  const handleEditWarranty = (warranty) => {
    setEditingWarranty(warranty);
    setOpenModal(true);
  };

  const handleDeleteWarranty = async (id) => {
    performActionWithPermission(
      "/dashboard/warranties",
      "delete",
      async () => {
        try {
          const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6a1b9a",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          });

          if (!result.isConfirmed) return;

          // Delete API call
          await deleteWarranty({ tenantDomain, id }).unwrap();

          // Refetch warranties after deletion
          refetch();

          // Success message
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The warranty has been deleted successfully.",
            showConfirmButton: false,
            timer: 2000,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text:
              error?.data?.message ||
              "An error occurred while deleting the warranty.",
            confirmButtonColor: "#6a1b9a",
          });
        }
      },
      "You don't have permission to delete warranty"
    );
  };

  return {
    openModal,
    editingWarranty,
    warranties,
    isLoading,
    searchTerm,
    setSearchTerm,
    handleOpenModal,
    handleCloseModal,
    handleEditWarranty,
    handleDeleteWarranty,
    refetch,
    tenantDomain,
  };
};
