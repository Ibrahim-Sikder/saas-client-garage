/* eslint-disable react/prop-types */
import { ArrowBack } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { FaEdit, FaTrashAlt, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table";
import { usePermissions } from "../../context/PermissionContext";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetAllCompaniesQuery } from "../../redux/api/companyApi";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";
import { formatDate } from "../../utils/formateDate";
const CompanyListTable = ({ handleDeleteAction, isRecycled, title }) => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();
  const navigate = useNavigate();

  const limit = 10;

  const { data: companyData, isLoading: companyLoading } =
    useGetAllCompaniesQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled,
    });

  const handleIconPreview = (id) => {
    performActionWithPermission(
      "/dashboard/customer-list",
      "view",
      () => navigate(`/dashboard/company-profile?id=${id}`),
      "You don't have permission to view customer details."
    );
  };

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center text-xl">
        <Loading />
      </div>
    );
  }

  const companies = companyData?.data?.companies || [];
  const totalPages = companyData?.data?.meta?.totalPages || 1;
  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "companyId", label: "Company ID" },
    { key: "company_name", label: "Company Name" },
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
      tooltip: "View Company Profile",
      onClick: (item) => handleIconPreview(item._id),
      requirePermission: true,
      permissionPage: "/dashboard/customer-list",
      permissionAction: "view",
    },
    {
      key: "edit",
      icon: FaEdit,
      color: "#2563EB",
      tooltip: "Edit Company",
      link: (item) => `/dashboard/update-company?id=${item._id}`,
      requirePermission: true,
      permissionPage: "/dashboard/update-company",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      color: "#EF4444",
      tooltip: "Delete Company",
      onClick: (item) => handleDeleteAction(item._id),
      requirePermission: true,
      permissionPage: "/dashboard/company-list",
      permissionAction: "delete",
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Company", href: "/dashboard/company-list" },
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
      <Table
        title={title || "Company List"}
        columns={columns}
        data={companies}
        actions={actions}
        loading={companyLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => {
          setFilterType(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search Company..."
        getRowClass={() =>
          "transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-100 hover:text-black"
        }
      />
    </Box>
  );
};

export default CompanyListTable;
