/* eslint-disable react/prop-types */
import { Pencil, Trash2 } from "lucide-react";
import Table from "../../../components/Table";
import { Chip } from "@mui/material";
import { format } from "date-fns";
import LeaveRequestForm from "./LeaveRequestForm";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDeleteLeaveRequestMutation } from "../../../redux/api/leaveRequestApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";

const getStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Rejected":
      return "error";
    case "Pending":
      return "warning";
    default:
      return "default";
  }
};

export default function EmployeeLeaveTable({
  data,
  isLoading,
  currentPage,
  setCurrentPage,
  setSearch,
  performActionWithPermission,
}) {
  const { tenantDomain } = useTenantDomain();
  const [open, setOpen] = useState(false);
  const [leaveRequestId, setLeaveRequestId] = useState(null);

  const [deleteLeaveRequest] = useDeleteLeaveRequestMutation();

  const handleOpen = (id) => {
    setLeaveRequestId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLeaveRequestId(null);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteLeaveRequest(id).unwrap();
          Swal.fire(
            "Deleted!",
            "The leave request has been deleted.",
            "success"
          );
        } catch (error) {
          Swal.fire("Error!", "An error occurred while deleting.", "error");
        }
      }
    });
  };

  const leaveRequests = data?.data?.leaveRequests || [];
  const totalPages = data?.data?.meta?.totalPage || 1;

  const columns = [
    { key: "employee.full_name", label: "Employee Name" },
    { key: "leaveType", label: "Leave Type" },
    {
      key: "fromDate",
      label: "From",
      render: (row) => format(new Date(row.fromDate), "yyyy-MM-dd"),
    },
    {
      key: "toDate",
      label: "To",
      render: (row) => format(new Date(row.toDate), "yyyy-MM-dd"),
    },
    {
      key: "noOfDays",
      label: "No of Days",
      render: (row) => <Chip label={`${row.noOfDays} days`} size="small" />,
    },
    { key: "reason", label: "Reason" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Chip
          label={row.status}
          color={getStatusColor(row.status)}
          size="small"
        />
      ),
    },
  ];

  const actions = [
    {
      key: "edit",
      icon: Pencil,
      tooltip: "Edit Leave Request",
      onClick: (row) => handleOpen(row._id),
      requirePermission: true,
      permissionPage: "/dashboard/leave-request",
      permissionAction: "edit",
    },
    {
      key: "delete",
      icon: Trash2,
      tooltip: "Delete Leave Request",
      onClick: (row) => handleDelete(row._id),
      requirePermission: true,
      permissionPage: "/dashboard/leave-request",
      permissionAction: "delete",
    },
  ];

  return (
    <>
      <Table
        title="Employee Leave Requests"
        columns={columns}
        data={leaveRequests}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={setSearch}
        searchPlaceholder="Search leave requests..."
        emptyMessage="No leave requests found."
      />

      {open && (
        <LeaveRequestForm
          open={open}
          setOpen={setOpen}
          performActionWithPermission={performActionWithPermission}
          onClose={handleClose}
          id={leaveRequestId}
          tenantDomain={tenantDomain}
        />
      )}
    </>
  );
}
