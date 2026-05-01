/* eslint-disable react/prop-types */
"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import Table from "../../components/Table";
import Loading from "../../components/Loading/Loading";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";
import {
  useDeleteUnitMutation,
  useGetAllIUnitQuery,
} from "../../redux/api/unitApi";
import { DeleteIcon, EditIcon } from "lucide-react";

const UnitTable = ({ handleUpdateOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();

  const { data, isLoading, refetch } = useGetAllIUnitQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm,
  });

  const [deleteUnit] = useDeleteUnitMutation();

  const units = data?.data?.units || [];
  const meta = data?.data?.meta || {};
  const totalPages = meta.totalPage || 1;
  const handleDelete = (unit) => {
    performActionWithPermission(
      "/dashboard/unit",
      "delete",
      async () => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#6366f1",
          cancelButtonColor: "#ef4444",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "Cancel",
          background: "#ffffff",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await deleteUnit({ tenantDomain, id: unit._id }).unwrap();
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "The unit has been deleted successfully.",
                icon: "success",
                confirmButtonColor: "#6366f1",
                background: "#ffffff",
              });
            } catch (error) {
              Swal.fire({
                title: "Error!",
                text: "An error occurred while deleting the unit.",
                icon: "error",
                confirmButtonColor: "#6366f1",
                background: "#ffffff",
              });
            }
          }
        });
      },
      "You don't have permission to delete units"
    );
  };

  const columns = [
    { key: "unit", label: "Unit Name" },
    { key: "short_name", label: "Short Name" },
  ];

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      color: "#3b82f6",
      tooltip: "Edit",
      onClick: (unit) => handleUpdateOpen(unit._id),
      requirePermission: true,
      permissionPage: "/dashboard/unit",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      color: "#ef4444",
      tooltip: "Delete",
      onClick: handleDelete,
      requirePermission: true,
      permissionPage: "/dashboard/unit",
      permissionAction: "delete",
    },
  ];

  return (
    <Table
      title="Units"
      columns={columns}
      data={units}
      actions={actions}
      loading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={(page) => setCurrentPage(page)}
      onSearch={(value) => setSearchTerm(value)}
      searchPlaceholder="Search units..."
      emptyMessage="No units found. Try a different search or add a new unit."
      renderExtraContent={() => (
        <div className="flex justify-center mt-4">
          {isLoading && <Loading />}
        </div>
      )}
    />
  );
};

export default UnitTable;
