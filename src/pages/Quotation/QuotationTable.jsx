/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
import { FaEye, FaDownload, FaFileInvoice, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { DeleteIcon, EditIcon } from "lucide-react";
import swal from "sweetalert";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { wrapBoxStyle } from "../../utils/customStyle";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import {
  useGetAllQuotationsQuery,
  useMoveRecycledQuotationMutation,
  useCancelQuotationMutation,
} from "../../redux/api/quotation";
import { useCompanyProfileData } from "../../hooks/useCompanyProfileData";

const QuotationTable = ({
  isRecycled,
  title = "Quotations",
  status,
  handleMoveAction,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search).get("search");

  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { tenantDomain } = useTenantDomain();

  const { companyProfileData } = useCompanyProfileData();
  const [moveRecycledQuotation, { isLoading: deleteLoading }] =
    useMoveRecycledQuotationMutation();
  const [cancelQuotation, { isLoading: cancelLoading }] =
    useCancelQuotationMutation();

  const { data: allQuotations, isLoading: quotationLoading } =
    useGetAllQuotationsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled,
      status,
    });

  const handleCancel = (id) => {
    swal({
      title: "Are you sure?",
      text: "Do you want to cancel this quotation? This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willCancel) => {
      if (willCancel) {
        cancelQuotation({ id, tenantDomain })
          .unwrap()
          .then(() => {
            swal("Cancelled!", "The quotation has been cancelled.", "success");
          })
          .catch((err) => {
            swal(
              "Error",
              err?.data?.message || "Failed to cancel quotation",
              "error",
            );
          });
      }
    });
  };

  const quotationColumns = [
    { key: "slNo", label: "SL No", type: "index" },
    { key: "job_no", label: "Quotation No." },

    {
      key: "name",
      label: "Customer Name",
      render: (data) =>
        data?.customer?.customer_name ||
        data?.company?.company_name ||
        data?.showRoom?.showRoom_name ||
        "N/A",
    },

    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (d) =>
        Array.isArray(d?.vehicle)
          ? d.vehicle.map((v) => v.vehicle_name || "—").join(", ")
          : d.vehicle?.vehicle_name || "N/A",
    },

    {
      key: "car_no",
      label: "Vehicle Reg No ",
      render: (d) => {
        if (!d?.vehicle) return "N/A";
        const vehicles = Array.isArray(d.vehicle) ? d.vehicle : [d.vehicle];

        return vehicles
          .map((v) => {
            const carRegNo = v?.carReg_no?.trim() || "";
            const carRegistrationNo = v?.car_registration_no?.trim() || "";
            if (carRegNo && carRegistrationNo)
              return `${carRegNo}-${carRegistrationNo}`;
            return carRegNo || carRegistrationNo || "—";
          })
          .join(", ");
      },
    },

    {
      key: "mobile_no",
      label: "Mobile No.",
      render: (d) =>
        d?.customer?.fullCustomerNum ||
        d?.company?.fullCompanyNum ||
        d?.showRoom?.fullCompanyNum ||
        "N/A",
    },

    { key: "date", label: "Date" },
  ];

  const quotationActions = [
    {
      key: "invoice",
      color: "#fff",
      icon: FaFileInvoice,
      label: "View Invoice",
      href: (d) => `/dashboard/create-invoice?order_no=${d.job_no}&id=${d._id}`,
    },
    {
      key: "download",
      icon: FaDownload,
      color: "#fff",
      label: "Download Quotation",
      href: (d) =>
        `${import.meta.env.VITE_API_URL}/quotations/quotation/${
          d._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData),
        )}`,
    },
    {
      key: "preview",
      icon: FaEye,
      color: "#fff",
      label: "Preview",
      onClick: (d) => navigate(`/dashboard/quotation-view?id=${d._id}`),
    },
    {
      key: "edit",
      icon: EditIcon,
      color: "#fff",
      label: "Edit Quotation",
      link: (d) => `/dashboard/update-quotation?id=${d._id}`,
    },

    ...(status === "running"
      ? [
          {
            key: "cancel",
            icon: FaTimes,
            color: "#fff",
            label: "Cancel Quotation",
            onClick: (d) => handleCancel(d._id),
            disabled: (d) => cancelLoading || d.invoiced || d.is_invoiced,
            tooltip: (d) =>
              d.invoiced || d.is_invoiced
                ? "Already Invoiced"
                : "Cancel Quotation",
          },
        ]
      : []),

    {
      key: "delete",
      icon: DeleteIcon,
      color: "#fff",
      label: isRecycled ? "Delete / Restore" : "Move to Recycled",
      onClick: (d) => handleMoveAction?.(d._id),
      disabled: () => deleteLoading,
    },
  ];

  const getQuotationRowClass = (data) => {
    if (data.status === "running") return "bg-red-500 text-white";
    if (data.status === "completed") return "bg-green-500 text-white";
    return "";
  };

  useEffect(() => {
    if (search) setFilterType(search);
  }, [search]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Quotation", href: "/dashboard/quotation-list" },
    { label: title },
  ];

  const handleBack = () => navigate(-1);

  const externalHooks = {
    tenantDomain,
    deleteLoading,
    cancelLoading,
    moveRecycledQuotation,
    cancelQuotation,
    swal,
  };

  return (
    <Box sx={wrapBoxStyle}>
      <Box display="flex" justifyContent="space-between">
        <Breadcrumb items={breadcrumbItems} />
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ borderRadius: 5 }}
        >
          Back
        </Button>
      </Box>

      <Table
        title={title}
        columns={quotationColumns}
        data={allQuotations?.data?.quotations || []}
        actions={quotationActions}
        loading={quotationLoading}
        currentPage={currentPage}
        totalPages={allQuotations?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        onSearch={setFilterType}
        searchPlaceholder="Search quotations..."
        externalHooks={externalHooks}
        emptyMessage="No matching quotation found."
        getRowClass={getQuotationRowClass}
      />
    </Box>
  );
};

export default QuotationTable;
