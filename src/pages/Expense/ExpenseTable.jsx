import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Chip, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

const columns = [
  { field: "date", headerName: "Date", flex: 1 },
  { field: "reference", headerName: "Reference", flex: 1 },
  { field: "supplier", headerName: "Supplier", flex: 1 },
  { field: "warehouse", headerName: "Warehouse", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={
          params.value === "Completed"
            ? "success"
            : params.value === "Ordered"
            ? "primary"
            : "warning"
        }
        size="small"
      />
    ),
  },
  {
    field: "payment",
    headerName: "Payment",
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={params.value === "Paid" ? "success" : "error"}
        size="small"
      />
    ),
  },
  { field: "total", headerName: "Total", flex: 1 },
  { field: "paid", headerName: "Paid", flex: 1 },
  { field: "due", headerName: "Due", flex: 1 },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    renderCell: () => <ActionMenu />,
  },
];

const rows = [
  {
    id: 1,
    date: "01/01/2024",
    reference: "S-326564580710",
    supplier: "William Prady",
    warehouse: "Warehouse 8",
    status: "Completed",
    payment: "Paid",
    total: "$5250",
    paid: "$5250",
    due: "$0",
  },
  {
    id: 2,
    date: "01/05/2024",
    reference: "S-987654321098",
    supplier: "Emily Jones",
    warehouse: "Warehouse 3",
    status: "Ordered",
    payment: "Unpaid",
    total: "$5000",
    paid: "$0",
    due: "$5000",
  },
  // Add more rows as needed
];

const ActionMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="contained"
        size="small"
        onClick={handleClick}
        sx={{ textTransform: "none", color: "white" }}
      >
        Action
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Link to="/dashboard/update-purchase">Edit </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
    </>
  );
};

const ExpenseTable = () => {
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default ExpenseTable;
