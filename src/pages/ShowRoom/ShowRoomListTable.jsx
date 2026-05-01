/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { FaEdit, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Box, Button } from "@mui/material";
import { DeleteIcon } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table";
import { usePermissions } from "../../context/PermissionContext";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetAllShowRoomsQuery } from "../../redux/api/showRoomApi";
import { purchaseBtn } from "../../utils/customStyle";
import { formatDate } from "../../utils/formateDate";

const ShowRoomListTable = ({ handleDeleteAction, title, isRecycled }) => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { performActionWithPermission } = usePermissions();
  const { tenantDomain } = useTenantDomain();
  const navigate = useNavigate();

  const limit = 10;

  const { data: showRoomData, isLoading: loading } = useGetAllShowRoomsQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled,
  });

  useEffect(() => {
    const search = new URLSearchParams(location.search).get("search");
    if (search) setFilterType(search);
  }, []);

  const handleIconPreview = (id) => {
    performActionWithPermission(
      "/dashboard/show-room-list",
      "view",
      () => navigate(`/dashboard/show-room-profile?id=${id}`),
      "You don't have permission to view show room details."
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }

  const showrooms = showRoomData?.data?.showrooms || [];
  const totalPages = showRoomData?.data?.meta?.totalPages || 1;

  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "showRoomId", label: "Show Room ID" },
    { key: "showRoom_name", label: "Show Room Name" },
    { key: "fullCompanyNum", label: "Phone No." },
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
      color: "#0EA5E9",
      tooltip: "View Showroom Profile",
      onClick: (item) => handleIconPreview(item._id),
      requirePermission: true,
      permissionPage: "/dashboard/show-room-list",
      permissionAction: "view",
    },
    {
      key: "edit",
      icon: FaEdit,
      color: "#2563EB",
      tooltip: "Edit Showroom",
      link: (item) => `/dashboard/update-show-room?id=${item._id}`,
      requirePermission: true,
      permissionPage: "/dashboard/update-show-room",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      color: "#EF4444",
      tooltip: "Delete Showroom",
      onClick: (item) => handleDeleteAction(item._id),
      requirePermission: true,
      permissionPage: "/dashboard/show-room-list",
      permissionAction: "delete",
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Show Room", href: "/dashboard/show-room-list" },
    { label: title },
  ];

  return (
    <div className="w-full mt-5 mb-24">
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
      <Table
        title={title || "Show Room List"}
        columns={columns}
        data={showrooms}
        actions={actions}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => {
          setFilterType(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search showroom..."
        getRowClass={() =>
          "transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-100 hover:text-black"
        }
      />
    </div>
  );
};

export default ShowRoomListTable;
