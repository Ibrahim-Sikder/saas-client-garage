/* eslint-disable react/prop-types */
import { ArrowBack } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaUserTie } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Breadcrumb from "../../components/Breadcrumb";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table";
import { usePermissions } from "../../context/PermissionContext";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetAllCustomersQuery } from "../../redux/api/customerApi";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";
import { formatDate } from "../../utils/formateDate";

const CustomerListTable = ({ handleDeleteAction, isRecycled, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const search = new URLSearchParams(location.search).get("search");
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  const limit = 10;

  useEffect(() => {
    if (search) setFilterType(search);
  }, [search]);

  const {
    data: customerData,
    isLoading: customerLoading,
    error,
  } = useGetAllCustomersQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled,
  });

  if (error) toast.error(error?.message);

  const handleIconPreview = (id) => {
    performActionWithPermission(
      "/dashboard/customer-list",
      "view",
      () => navigate(`/dashboard/customer-profile?id=${id}`),
      "You don't have permission to view customer details."
    );
  };
  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "customerId", label: "Customer ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "fullCustomerNum", label: "Phone No." },
    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (item) => {
        const lastVehicle = item?.vehicles
          ? [...item.vehicles].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )[0]
          : null;
        return lastVehicle?.vehicle_name || "—";
      },
    },
    {
      key: "vehicles",
      label: "Vehicle Reg No",
      render: (item) => {
        const firstVehicle = item?.vehicles?.[0];
        if (!firstVehicle) return "—";

        const carRegNo = firstVehicle?.carReg_no || "";
        const carRegistrationNo = firstVehicle?.car_registration_no || "";
        const combined =
          carRegNo && carRegistrationNo
            ? `${carRegNo}-${carRegistrationNo}`
            : carRegNo || carRegistrationNo || "—";

        return combined;
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (item) => (item?.createdAt ? formatDate(item.createdAt) : "—"),
    },
  ];
  const actions = [
    {
      key: "view",
      icon: FaUserTie,
      tooltip: "View Customer",
      color: "#16A34A",
      requirePermission: true,
      permissionPage: "/dashboard/customer-list",
      permissionAction: "view",
      onClick: (item) => handleIconPreview(item._id),
    },
    {
      key: "edit",
      icon: FaEdit,
      tooltip: "Edit Customer",
      color: "#2563EB",
      requirePermission: true,
      permissionPage: "/dashboard/update-customer",
      permissionAction: "edit",
      link: (item) => `/dashboard/update-customer?id=${item._id}`,
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      tooltip: isRecycled
        ? "Delete Permanently or Restore"
        : "Move to Recycle Bin",
      color: isRecycled ? "#DC2626" : "#F59E0B",
      requirePermission: true,
      permissionPage: "/dashboard/customer-list",
      permissionAction: "delete",
      onClick: (item) => handleDeleteAction(item._id),
    },
  ];
  const getRowClass = (item) => {
    if (isRecycled) return "bg-gray-100 text-gray-600";
    if (item.status === "inactive") return "bg-red-100 text-gray-700";
    if (item.status === "vip") return "bg-yellow-100 text-black";
    return "text-gray-800";
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Customer", href: "/dashboard/customer-list" },
    { label: title },
  ];
  return (
    <Box sx={wrapBoxStyle}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ ...purchaseBtn, height: "40px" }}
        >
          Back
        </Button>
      </Box>
      {customerLoading ? (
        <Loading />
      ) : (
        <Table
          title={title || "Customer List"}
          columns={columns}
          data={customerData?.data?.customers || []}
          actions={actions}
          loading={customerLoading}
          currentPage={currentPage}
          totalPages={customerData?.data?.meta?.totalPages || 1}
          onPageChange={setCurrentPage}
          onSearch={setFilterType}
          searchPlaceholder="Search customers..."
          emptyMessage="No matching customers found."
          getRowClass={getRowClass}
        />
      )}
    </Box>
  );
};

export default CustomerListTable;
