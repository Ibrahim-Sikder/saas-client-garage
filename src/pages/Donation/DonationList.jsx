/* eslint-disable react/prop-types */
"use client";

import { Box, Button } from "@mui/material";
import { useState } from "react";
import swal from "sweetalert";
import Breadcrumb from "../../components/Breadcrumb";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table";
import { useAppOptions } from "../../hooks/useAppOptions";
import {
  useDeleteDonationMutation,
  useGetAllDonationQuery,
} from "../../redux/api/donationApi";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";
import { DeleteIcon, EditIcon } from "lucide-react";

export default function DonationList() {
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: donationData, isLoading: donationLoading } =
    useGetAllDonationQuery({
      tenantDomain,
      limit: 10,
      page: currentPage,
      searchTerm: search,
    });

  const [deleteDonation, { isLoading: isDeleting }] =
    useDeleteDonationMutation();

  const handleDelete = async (item) => {
    performActionWithPermission(
      "/dashboard/donation-list",
      "delete",
      async () => {
        const confirmed = await swal({
          title: "Are you sure?",
          text: "Do you really want to delete this donation?",
          icon: "warning",
          buttons: ["Cancel", "Delete"],
          dangerMode: true,
        });

        if (confirmed) {
          try {
            await deleteDonation({ id: item._id, tenantDomain }).unwrap();
            swal("Deleted!", "Donation deleted successfully.", "success");
          } catch (err) {
            swal("Error", "An error occurred while deleting.", "error");
          }
        }
      },
      "You don't have permission to delete donations."
    );
  };

  if (donationLoading) return <Loading />;

  const columns = [
    { key: "name", label: "Donor" },
    { key: "mobile_number", label: "Contact" },
    { key: "donation_purpose", label: "Purpose" },
    {
      key: "donation_amount",
      label: "Amount",
      render: (item) => `৳${item.donation_amount?.toLocaleString() || "0"}`,
    },
    { key: "payment_method", label: "Payment Method" },
  ];

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit Donation",
      link: (item) => `/dashboard/update-donation?id=${item._id}`,
      color: "#2563eb",
      requirePermission: true,
      permissionPage: "/dashboard/donation-list",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete Donation",
      color: "#dc2626",
      onClick: handleDelete,
      disabled: () => isDeleting,
      requirePermission: true,
      permissionPage: "/dashboard/donation-list",
      permissionAction: "delete",
    },
  ];
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Donation", href: "/dashboard/donation-list" },
    { label: "Donation List" },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Breadcrumb items={breadcrumbItems} />
        <Button
          sx={{ ...purchaseBtn, height: "35px" }}
          component="Link"
          to="/dashboard/add-donation"
        >
          Add Donation
        </Button>
      </Box>

      <Table
        title="All Donations"
        columns={columns}
        data={donationData?.data || []}
        actions={actions}
        loading={donationLoading}
        currentPage={currentPage}
        totalPages={donationData?.meta?.totalPage || 1}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        searchPlaceholder="Search donations..."
        emptyMessage="No donations found"
      />
    </Box>
  );
}
