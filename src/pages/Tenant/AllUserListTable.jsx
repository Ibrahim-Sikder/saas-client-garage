/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useMemo, useState } from "react";
import { FaCheckCircle, FaLock, FaTrash, FaUsers } from "react-icons/fa";
import Loading from "../../components/Loading/Loading";
import SummaryCards from "../../components/SummaryCard";
import Table from "../../components/Table";
import { useAppOptions } from "../../hooks/useAppOptions";
import { useGetAllUserQuery } from "../../redux/api/userApi";
import { purchaseBtn, wrapBoxStyle } from "../../utils/customStyle";
import AddUserModal from "./AddUserModal";

const AllUserListTable = ({
  isRecycled,
  deleteLoading,
  handleMoveToRecycleBin,
}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  const {
    data: userData,
    isLoading,
    refetch,
  } = useGetAllUserQuery({ tenantDomain, isRecycled });

  const users = userData?.data || [];

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      [user.name, user.email].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  if (isLoading) return <Loading />;
  const summaryCards = [
    {
      title: "Total Users",
      value: users.length,
      color: "#764ba2",
      bgColor: "#ede7f6",
      icon: <FaUsers />,
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      color: "#45a049",
      bgColor: "#e6f4ea",
      icon: <FaCheckCircle />,
    },
    {
      title: "Blocked Users",
      value: users.filter((u) => u.status === "blocked").length,
      color: "#d32f2f",
      bgColor: "#fdecea",
      icon: <FaLock />,
    },
  ];

  const columns = [
    {
      label: "Name",
      key: "name",
      render: (u) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              bgcolor: "primary.main",
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            {u.name.charAt(0).toUpperCase()}
          </Box>
          {u.name}
        </Box>
      ),
    },
    { label: "Email", key: "email" },
    {
      label: "Role",
      key: "role",
      render: (u) => (
        <span style={{ textTransform: "capitalize" }}>{u.role}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (u) => (
        <span
          style={{
            color: u.status === "active" ? "#45a049" : "#d32f2f",
            fontWeight: "bold",
          }}
        >
          {u.status === "active" ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      label: "Created",
      key: "createdAt",
      render: (u) =>
        u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A",
    },
  ];

  const actions = [
    {
      key: "delete",
      icon: FaTrash,
      tooltip: "Delete User",
      onClick: (user) => handleMoveToRecycleBin(user._id),
      requirePermission: true,
      permissionPage: "/dashboard/all-user-list",
      permissionAction: "delete",
      disabled: () => deleteLoading,
    },
  ];

  return (
    <Box sx={wrapBoxStyle}>
      <SummaryCards cards={summaryCards} singleRow />
      <Box mb={3} display="flex" justifyContent="flex-end">
        <Button onClick={() => setIsAddUserOpen(true)} sx={purchaseBtn}>
          <Add /> Add User
        </Button>
      </Box>

      <Table
        title="All Users"
        columns={columns}
        data={filteredUsers}
        actions={actions}
        loading={isLoading}
        currentPage={page}
        totalPages={Math.ceil(filteredUsers.length / rowsPerPage)}
        onPageChange={setPage}
        onSearch={setSearchTerm}
        searchPlaceholder="Search users by name or email..."
        emptyMessage="No users found."
      />
      <AddUserModal
        tenantDomain={tenantDomain}
        performActionWithPermission={performActionWithPermission}
        open={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={refetch}
      />
    </Box>
  );
};

export default AllUserListTable;
