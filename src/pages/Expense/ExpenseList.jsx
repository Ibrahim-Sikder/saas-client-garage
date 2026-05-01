/* eslint-disable no-unused-vars */
"use client";

import { ArrowBack, Payment } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";
import Table from "../../components/Table"; // Your reusable Table
import { useAppOptions } from "../../hooks/useAppOptions";
import {
  useDeleteExpenseMutation,
  useGetAllExpensesQuery,
} from "../../redux/api/expense";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";
import { DeleteIcon, EditIcon } from "lucide-react";

export default function ExpenseList() {
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllExpensesQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  });

  const [deleteExpense] = useDeleteExpenseMutation();

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (item) =>
        item.date
          ? new Date(item.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
    },
    {
      key: "transactionNumber",
      label: "Reference",
      render: (item) => (
        <span className="px-2 py-1 text-sm rounded-md border bg-blue-50 text-blue-700 border-blue-200 font-medium">
          {item.transactionNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (item) => (
        <span className="text-emerald-600 font-semibold">
          ৳{item.totalAmount?.toLocaleString() || "0"}
        </span>
      ),
    },
    {
      key: "payment_method",
      label: "Payment Method",
      render: (item) => (
        <span className="px-2 py-1 text-sm rounded-md border bg-sky-50 text-sky-700 border-sky-200 flex items-center gap-1">
          <Payment sx={{ fontSize: "14px" }} />
          {item.payment_method || "N/A"}
        </span>
      ),
    },
    {
      key: "expense_items",
      label: "Expense Items",
      render: (item) =>
        Array.isArray(item.expense_items) && item.expense_items.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.expense_items.slice(0, 2).map((ei, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs rounded-md bg-amber-50 text-amber-800 border border-amber-200"
              >
                {ei.name}: {ei.amount?.toLocaleString() || "0"}
              </span>
            ))}
            {item.expense_items.length > 2 && (
              <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-600">
                +{item.expense_items.length - 2} items
              </span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No items</span>
        ),
    },
  ];

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      tooltip: "Edit Expense",
      link: (item) => `/dashboard/update-expense/?id=${item._id}`,
      color: "#2563eb",
      requirePermission: true,
      permissionPage: "/dashboard/expense-list",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      tooltip: "Delete Expense",
      color: "#dc2626",
      requirePermission: true,
      permissionPage: "/dashboard/expense-list",
      permissionAction: "delete",
      onClick: (item) =>
        performActionWithPermission(
          "/dashboard/expense-list",
          "delete",
          async () => {
            const result = await Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#1976d2",
              cancelButtonColor: "#d32f2f",
              confirmButtonText: "Yes, delete it!",
            });
            if (result.isConfirmed) {
              try {
                await deleteExpense({ tenantDomain, id: item._id }).unwrap();
                Swal.fire(
                  "Deleted!",
                  "The expense has been deleted.",
                  "success"
                );
              } catch (error) {
                Swal.fire(
                  "Error!",
                  "An error occurred while deleting.",
                  "error"
                );
              }
            }
          },
          "You don't have permission to delete expenses."
        ),
    },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Expense", href: "/dashboard/expense-list" },
    { label: "Expense List" },
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
        title="Expense List"
        columns={columns}
        data={data?.data?.expenses || []}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={data?.data?.meta?.totalPage || 1}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        searchPlaceholder="Search expenses..."
        emptyMessage="No expenses found"
      />
    </Box>
  );
}
