/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEye, FaDownload } from "react-icons/fa";
import { ArrowBack, Money } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";

import { useGetAllInvoicesQuery } from "../../redux/api/invoice";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { getRowClass } from "../../utils/getRowClass";
import { wrapBoxStyle } from "../../utils/customStyle";
import { DeleteIcon, EditIcon } from "lucide-react";
import { useCompanyProfileData } from "../../hooks/useCompanyProfileData";

const InvoiceTable = ({
  title = "Invoices",
  status,
  isRecycled,
  handleDeleteAction,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search).get("search");

  const [filterType, setFilterType] = useState(search || "");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { tenantDomain } = useTenantDomain();
  const { data: allInvoices, isLoading: invoiceLoading } =
    useGetAllInvoicesQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled,
      status,
    });
  const { companyProfileData } = useCompanyProfileData();
  const invoiceColumns = [
    { key: "slNo", label: "SL No", type: "index" },
    { key: "job_no", label: "Invoice No." },

    {
      key: "customer",
      label: "Customer Name",
      render: (data) =>
        data.customer?.customer_name ||
        data.company?.company_name ||
        data.showRoom?.showRoom_name ||
        "N/A",
    },
    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (data) => {
        if (!data?.vehicle) return "N/A";
        const vehicles = Array.isArray(data.vehicle)
          ? data.vehicle
          : [data.vehicle];
        return vehicles.map((v) => v.vehicle_name || "—").join(", ");
      },
    },

    {
      key: "vehicle",
      label: "Vehicle Reg No",
      render: (data) => {
        if (!data?.vehicle) return "N/A";
        const vehicles = Array.isArray(data.vehicle)
          ? data.vehicle
          : [data.vehicle];

        return vehicles
          .map((v) => {
            const carRegNo = v?.carReg_no?.trim() || "";
            const carRegistrationNo = v?.car_registration_no?.trim() || "";
            if (carRegNo && carRegistrationNo) {
              return `${carRegNo}-${carRegistrationNo}`;
            }
            return carRegNo || carRegistrationNo || "—";
          })
          .join(", ");
      },
    },

    {
      key: "contact",
      label: "Mobile No.",
      render: (data) =>
        data.customer?.fullCustomerNum ||
        data.company?.fullCompanyNum ||
        data.showRoom?.fullCompanyNum ||
        "N/A",
    },

    { key: "date", label: "Date" },
  ];

  const invoiceActions = [
    {
      key: "money_receipt",
      icon: Money,
      label: "Money Receipt",
      color: "#fff",
      href: (data) =>
        `/dashboard/money-receive-create?order_no=${data.job_no}&id=${
          data._id
        }&net_total=${
          data.net_total === data.advance ? data.net_total : data.due
        }`,
      requirePermission: true,
      permissionPage: "/dashboard/invoice-list",
      permissionAction: "view",
    },
    {
      key: "download",
      icon: FaDownload,
      color: "#fff",
      label: "Download Invoice",
      href: (data) => {
        return `${import.meta.env.VITE_API_URL}/invoices/invoice/${
          data._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`;
      },
      target: "_blank",
      requirePermission: true,
      permissionPage: "/dashboard/invoice-list",
      permissionAction: "view",
    },
    {
      key: "preview",
      icon: FaEye,
      color: "#fff",
      label: "Preview",
      onClick: (data, hooks) =>
        hooks.navigate(`/dashboard/invoice-view?id=${data._id}`),
      requirePermission: true,
      permissionPage: "/dashboard/invoice-list",
      permissionAction: "view",
      permissionMessage: "You don't have permission to view invoice!",
    },
    {
      key: "edit",
      icon: EditIcon,
      color: "#fff",
      label: "Edit Invoice",
      LinkComponent: Link,
      link: (data) => `/dashboard/update-invoice?id=${data._id}`,
      requirePermission: true,
      permissionPage: "/dashboard/update-invoice",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      color: "#fff",
      label: isRecycled
        ? "Delete Permanently / Restore"
        : "Move to Recycled Bin",
      onClick: handleDeleteAction,
      disabled: (data, hooks) => hooks?.deleteLoading,
      requirePermission: true,
      permissionPage: "/dashboard/invoice-list",
      permissionAction: "delete",
      permissionMessage: "You don't have permission to delete invoice!",
    },
  ];

  const externalHooks = { tenantDomain };

  useEffect(() => {
    if (search) setFilterType(search);
  }, [search]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Invoice", href: "/dashboard/invoice-list" },
    { label: title },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ borderRadius: 5 }}
        >
          Back
        </Button>
      </Box>

      <Table
        title={title}
        columns={invoiceColumns}
        data={allInvoices?.data?.invoices || []}
        actions={invoiceActions}
        loading={invoiceLoading}
        currentPage={currentPage}
        totalPages={allInvoices?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        onSearch={setFilterType}
        searchPlaceholder="Search invoices..."
        externalHooks={externalHooks}
        emptyMessage="No matching invoice found."
        getRowClass={getRowClass}
      />
    </Box>
  );
};

export default InvoiceTable;
