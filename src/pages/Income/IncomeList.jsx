"use client";
/* eslint-disable no-unused-vars */

import NoteIcon from "@mui/icons-material/Note";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Box, Button, Chip, Tooltip, Typography } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";

import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table";
import { useAppOptions } from "../../hooks/useAppOptions";
import {
  useDeleteIncomeMutation,
  useGetAllIncomesQuery,
} from "../../redux/api/income";
import { useAccountSummaryQuery } from "../../redux/api/meta.api";
import IncomeStatisticsCard from "./IncomeStatisticsCard";

const getPaymentMethodIcon = (method) => {
  switch (method?.toLowerCase()) {
    case "cash":
      return "💵";
    case "credit_card":
      return "💳";
    case "bank_transfer":
      return "🏦";
    case "check":
      return "📝";
    case "bkash":
    case "mobile_payment":
      return "📱";
    case "nagad":
      return "📲";
    default:
      return "💰";
  }
};

const IncomeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 15;

  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const { data: accountSummary } = useAccountSummaryQuery({ tenantDomain });
  const { data: allIncomes, isLoading } = useGetAllIncomesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    search: searchTerm,
  });

  const [deleteIncome] = useDeleteIncomeMutation();

  const handleDelete = async (id) => {
    performActionWithPermission(
      "/dashboard/income-list",
      "delete",
      async () => {
        const willDelete = await swal({
          title: "Are you sure?",
          text: "Are you sure that you want to delete this income record?",
          icon: "warning",
          dangerMode: true,
        });

        if (willDelete) {
          try {
            await deleteIncome({ tenantDomain, id }).unwrap();
            swal("Deleted!", "Income record deleted successfully.", "success");
          } catch (error) {
            swal(
              "Error",
              "An error occurred while deleting the record.",
              "error"
            );
          }
        }
      },
      "You don't have permission to delete income"
    );
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) return <Loading />;

  const incomes = allIncomes?.data?.incomes || [];
  const totalPages = allIncomes?.data?.meta?.totalPage || 1;
  const totalEntries = allIncomes?.data?.meta?.total || 0;

  const columns = [
    { key: "index", label: "SL", type: "index" },
    {
      key: "invoice_id.invoice_no",
      label: "Invoice",
      render: (item) => item?.invoice_id?.invoice_no || "N/A",
    },
    {
      key: "type",
      label: "Type",
      render: (item) => {
        let incomeType = "Other";
        if (item.serviceIncomeAmount > 0 && item.partsIncomeAmount > 0)
          incomeType = "Service & Parts";
        else if (item.serviceIncomeAmount > 0) incomeType = "Service";
        else if (item.partsIncomeAmount > 0) incomeType = "Parts";

        return (
          <Chip
            label={incomeType}
            size="small"
            sx={{
              backgroundColor: "#e6f2ff",
              color: "#42A1DA",
              fontWeight: "medium",
            }}
          />
        );
      },
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (item) => (
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "#2980b9" }}
          >
            ৳
            {Number(item.totalAmount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
          <Typography fontSize="0.75rem" fontWeight="bold">
            Total Income: ${item.totalOtherIncome}
          </Typography>
        </Box>
      ),
    },
    {
      key: "payment_method",
      label: "Payment Method",
      render: (item) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: "4px", fontSize: "1.2rem" }}>
            {getPaymentMethodIcon(item.payment_method)}
          </span>
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {item.payment_method}
          </Typography>
        </Box>
      ),
    },
    {
      key: "transactionNumber",
      label: "Transaction",
      render: (item) => (
        <Box>
          <Typography variant="body2">
            {item.transactionNumber || "N/A"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            A/C: {item.accountNumber || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      key: "note",
      label: "Details",
      render: (item) => (
        <Box textAlign="center">
          {item.note && item.note.trim() !== "" && (
            <Tooltip title={item.note} arrow>
              <NoteIcon fontSize="small" sx={{ color: "#42A1DA" }} />
            </Tooltip>
          )}
          <Typography variant="caption">
            {item.income_items?.length || 0} items
          </Typography>
        </Box>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (item) => (
        <Box>
          <Typography variant="body2">
            {new Date(item.date || item.createdAt).toLocaleDateString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>
      ),
    },
  ];

  const actions = [
    {
      key: "edit",
      icon: Pencil,
      color: "#2563EB",
      tooltip: "Edit Income",
      link: (item) => `/dashboard/update-income?id=${item._id}`,
      requirePermission: true,
      permissionPage: "/dashboard/income-list",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: Trash2,
      color: "#EF4444",
      tooltip: "Delete Income",
      onClick: (item) => handleDelete(item._id),
      requirePermission: true,
      permissionPage: "/dashboard/income-list",
      permissionAction: "delete",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        p: 2,
      }}
    >
      <IncomeStatisticsCard accountSummary={accountSummary} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ReceiptIcon sx={{ fontSize: 28, color: "#42A1DA", mr: 1.5 }} />
          <Typography variant="h5" fontWeight="bold">
            Income History
          </Typography>
        </Box>

        <Link to="/dashboard/add-income">
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #2980b9 0%, #1e6091 100%)",
              },
            }}
          >
            Add New Income
          </Button>
        </Link>
      </Box>

      <Table
        title="Income Records"
        columns={columns}
        data={incomes}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        searchPlaceholder="Search by invoice, amount, or method..."
        emptyMessage="No income records found"
        getRowClass={() =>
          "transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-100 hover:text-black"
        }
        renderExtraContent={() =>
          totalEntries > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Showing {(currentPage - 1) * limit + 1}–
              {Math.min(currentPage * limit, totalEntries)} of {totalEntries}{" "}
              entries
            </Typography>
          )
        }
      />
    </Box>
  );
};

export default IncomeList;
