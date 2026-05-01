/* eslint-disable react/prop-types */
"use client";

import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { Download, Eye, EditIcon, DeleteIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { useGetAllJobCardsQuery } from "../../redux/api/jobCard";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import { Box } from "@mui/material";
import { wrapBoxStyle } from "../../../src/utils/customStyle.js";
import { useCompanyProfileData } from "../../hooks/useCompanyProfileData.js";
const JobCardTable = ({
  isRecycled = false,
  title = "Job Cards",
  movedLoading = false,
  handleMoveToRecycled,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search).get("search");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { tenantDomain } = useTenantDomain();

  const { companyProfileData } = useCompanyProfileData();

  const { data: allJobCards, isLoading: jobCardLoading } =
    useGetAllJobCardsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled,
    });

  useEffect(() => {
    if (search) setFilterType(search);
  }, [search]);

  const columns = [
    { key: "index", label: "SL. N.", type: "index" },
    { key: "job_no", label: "Job Card No." },
    {
      key: "customer_name",
      label: "Customer Name",
      render: (item) => {
        switch (item?.user_type) {
          case "customer":
            return item?.customer?.customer_name || "—";
          case "company":
            return item?.company?.company_name || "—";
          case "showRoom":
            return item?.showRoom?.showroom_name || "—";
          default:
            return "—";
        }
      },
    },

    { key: "customer.fullCustomerNum", label: "Mobile No." },
    {
      key: "vehicle.vehicle_name",
      label: "Vehicle Name",
      render: (item) => item.vehicle?.map((v) => v.vehicle_name).join(", "),
    },
    {
      key: "vehicle.carReg_no",
      label: "Car Reg No.",
      render: (item) => {
        if (!item?.vehicle || !Array.isArray(item.vehicle)) return "—";

        return item.vehicle
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

    { key: "date", label: "Date" },
  ];

  const actions = [
    {
      key: "create-quotation",
      label: "Create Quotation",
      icon: FaEdit,

      link: (item) => `/dashboard/create-quotation?order_no=${item.job_no}`,
      tooltip: "Create Quotation",
      color: "#2563EB",
      size: "18px",
    },
    {
      key: "download",
      label: "Download",
      icon: Download,

      href: (item) =>
        `${import.meta.env.VITE_API_URL}/jobCards/jobcard/${
          item._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`,
      tooltip: "Download Job Card",
      target: "_blank",
      color: "#2563EB",
      size: "18px",
    },
    {
      key: "preview",
      label: "Preview",

      icon: Eye,
      onClick: (item) => navigate(`/dashboard/preview?id=${item._id}`),
      tooltip: "Preview Job Card",
      color: "#2563EB",
      size: "18px",
    },
    {
      key: "edit",
      label: "Edit",

      icon: EditIcon,
      link: (item) => `/dashboard/update-jobcard?id=${item._id}`,
      tooltip: "Edit Job Card",
      color: "#2563EB",
      size: "18px",
    },
    {
      key: "recycle",
      label: isRecycled ? "Restore/Delete" : "Recycle",
      icon: DeleteIcon,

      onClick: (item) => handleMoveToRecycled?.(item._id),
      tooltip: isRecycled
        ? "Restore or Permanently Delete"
        : "Move to Recycle Bin",
      disabled: () => movedLoading,
      color: isRecycled ? "#F59E0B" : "#EF4444",
      size: "18px",
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Job Card", href: "/dashboard/jobcard" },
    { label: title },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Breadcrumb items={breadcrumbItems} />

      <Table
        title={title}
        columns={columns}
        data={allJobCards?.data?.jobCards || []}
        loading={jobCardLoading}
        actions={actions}
        currentPage={currentPage}
        totalPages={allJobCards?.data?.meta?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => setFilterType(value)}
        searchPlaceholder="Search job cards..."
        emptyMessage="No matching job cards found."
      />
    </Box>
  );
};

export default JobCardTable;
