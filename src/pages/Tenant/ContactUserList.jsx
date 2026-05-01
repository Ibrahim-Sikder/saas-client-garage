"use client";

import { useState } from "react";
import { Box, CircularProgress, Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  useDeleteContactUserMutation,
  useGetAllContactUserQuery,
} from "../../redux/api/userApi";
import { DeleteIcon } from "lucide-react";
import Table from "../../components/Table";
import { wrapBoxStyle } from "../../utils/customStyle";

const ContactUserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: userData, isLoading, refetch } = useGetAllContactUserQuery({});
  const [deleteUser, { isLoading: deleteLoading }] =
    useDeleteContactUserMutation();

  const users = userData?.data?.users || [];

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser({ id: userId }).unwrap();
        toast.success("Contact deleted successfully");
        refetch();
      } catch {
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleSearch = (value) => setSearchTerm(value);
  const filteredUsers = users.filter((user) => {
    const searchContent =
      `${user.garageName} ${user.email} ${user.phone} ${user.message}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });
  const columns = [
    { key: "garageName", label: "Garage" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "message",
      label: "Message",
      render: (user) => (
        <Tooltip title={user.message}>
          <Box
            sx={{
              maxWidth: 200,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.message}
          </Box>
        </Tooltip>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (user) =>
        user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
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
      icon: DeleteIcon,
      color: "#f44336",
      tooltip: "Delete Contact",
      onClick: (user) => handleDeleteUser(user._id),
      disabled: () => deleteLoading,
    },
  ];

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={wrapBoxStyle}>
      <Table
        title="Contact Submissions"
        columns={columns}
        data={filteredUsers}
        actions={actions}
        loading={isLoading}
        onSearch={handleSearch}
        searchPlaceholder="Search contacts..."
        emptyMessage="No contacts found"
      />
    </Box>
  );
};

export default ContactUserList;
