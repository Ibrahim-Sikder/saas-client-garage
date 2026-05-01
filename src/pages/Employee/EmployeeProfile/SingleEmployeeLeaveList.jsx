/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "../Employee.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Pagination,
  Box,
} from "@mui/material";
import "../Employee.css";
import { useState } from "react";
import LeaveRequestForm from "./LeaveRequestForm";
import { useGetLeaveRequestByEmployeeIdQuery } from "../../../redux/api/leaveRequestApi";
import Loading from "../../../components/Loading/Loading";
import { Pencil, Trash2 } from "lucide-react";
import {
  deleteIconStyle,
  editIconStyle,
  tableCellStyle,
  tableHeaderStyle,
  tableStyle,
} from "../../../style/tableStyle";

const SingleEmployeeLeaveList = ({ tenantDomain, id, performActionWithPermission }) => {


  const [currentPage, setCurrentPage] = useState(1);
  const [search, SetSearch] = useState("");
  const [selectedLeaveRequestId, setSelectedLeaveRequestId] = useState(null)
  const { data, isLoading } = useGetLeaveRequestByEmployeeIdQuery({
    tenantDomain,
    employeeId: id,
  });


  const [open, setOpen] = useState(false);
  const handleOpen = (leaveRequestId = null) => {
    setSelectedLeaveRequestId(leaveRequestId);
    setOpen(true);
  };
  const handleAddOpen = () => setOpen(true)
  const handleClose = () => setOpen(false);
  const handleSearch = (e) => {
    const value = e.target.value;
    SetSearch(value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const { meta } = data?.data || { meta: {}, leaveRequests: [] };
  const { totalPage = 1 } = meta || {};

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

  const [columns, setColumns] = useState([
    "employee",
    "Leave Type",
    "From date",
    "To date",
    "No of Days",
    "Reason",
    "Remaining Leaves",
    "Status",
    "Actions",
  ]);
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="table-container">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight="bold"
            sx={{ width: "300px" }}
          >
            My Leave Requests
          </Typography>
          <div
            onClick={handleAddOpen}
            className="relative rounded-sm my-5 flex justify-end w-full "
          >
            <button className="p-1 py-3 md:px-3 text-sm md:text-xl text-white duration-300 rounded-lg bg-sky-500 active:scale-95">
              + Request Leave
            </button>
          </div>
        </Box>
        <TableContainer>
          <Table sx={tableStyle} aria-label="employee leave table">
            <TableHead>
              <TableRow sx={tableHeaderStyle}>
                {columns.map((column, index) => (
                  <TableCell sx={tableCellStyle} key={index}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "white" },
                    "&:nth-of-type(even)": { backgroundColor: "#F8F8F8" },
                  }}
                >
                  <TableCell>{row.employee.full_name}</TableCell>
                  <TableCell>{row.leaveType}</TableCell>
                  <TableCell>
                    {new Date(row.fromDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(row.toDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color="primary"
                      label={`${row.noOfDays} days`}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>
                    <Chip
                      color="info"
                      label={`${row.remainingLeaves} days`}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      component="span"
                      sx={editIconStyle}
                      onClick={() => handleOpen(row._id)}
                    >
                      <Pencil size={18} />
                    </Box>
                    <Box component="span" sx={deleteIconStyle}>
                      <Trash2 size={18} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={totalPage}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        />
      </Paper>
      {open && <LeaveRequestForm open={open} setOpen={setOpen}
        performActionWithPermission={performActionWithPermission} tenantDomain={tenantDomain}
        onClose={handleClose} employeeId={id} id={selectedLeaveRequestId} />}
    </div>
  );
};


export default SingleEmployeeLeaveList;
