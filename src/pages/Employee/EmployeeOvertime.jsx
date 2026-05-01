/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Button,
  Box,
} from "@mui/material";
import {
  Add as AddIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";

import { SearchIcon } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import {
  deleteIconStyle,
  editIconStyle,
  tableCellStyle,
  tableContainerStyle,
  tableHeaderStyle,
  tableStyle,
} from "../../style/tableStyle";
import {
  useDeleteEmployeeOvertimeMutation,
  useGetAllEmployeeOvertimesQuery,
} from "../../redux/api/overtimeApi";
import dayjs from "dayjs";
import { useTenantDomain } from "../../hooks/useTenantDomain";

export default function EmployeeOvertime() {
  const tenantDomain = useTenantDomain();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, SetSearch] = useState("");

  const columns = [
    "Sl",
    "Employee name",
    "Date",
    "Start date",
    "End Time",
    "Location",
    "Department",
    "Reason for Overtime",
    "Actions",
  ];

  const { data, isLoading } = useGetAllEmployeeOvertimesQuery({
    tenantDomain, limit: 10,
    page: currentPage,
    searchTerm: search,
  })

  const [deleteEmployeeOvertime] = useDeleteEmployeeOvertimeMutation();


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
          await deleteEmployeeOvertime({ tenantDomain, id }).unwrap();
          Swal.fire(
            "Deleted!",
            "The employee overtime has been deleted.",
            "success"
          );
        } catch (error) {
          Swal.fire(
            "Error!",
            "An error occurred while deleting the employee overtime.",
            "error"
          );
        }
      }
    });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    SetSearch(value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const { meta, employeeOvertimes } = data?.data || {
    meta: {},
    employeeOvertimes: [],
  };
  const { totalPage = 1 } = meta || {};

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 3, mt: 5 }}>
      <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
        Employee Overtime list
      </Typography>

      <Box
        sx={{
          display: {
            xs: "block",
            md: "flex",
          },
          justifyContent: "space-between",
          alignItems: "center",
          gap: {
            xs: 2,
            md: 3,
          },
          margin: "16px 0",
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search leave requests..."
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            width: {
              xs: "100%",
              md: "auto",
            },
            mb: { xs: 2, md: 0 },
          }}
        />

        <Button
          component={Link}
          to="/dashboard/create-overtime"
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            color: "#fff",
            width: {
              xs: "100%",
              md: "auto",
            },
          }}
        >
          Add Overtime
        </Button>
      </Box>

      <TableContainer sx={tableContainerStyle}>
        <section className="tableContainer overflow-x-auto">
          <Table
            className="customTable"
            sx={tableStyle}
            aria-label="employee leave table"
          >
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
              {employeeOvertimes?.map((row, rowIndex) => {
                const { entries, _id } = row;

                return (
                  <>
                    {entries.map((entry, entryIndex) => (
                      <TableRow
                        key={`${_id}-${entryIndex}`}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "white" },
                          "&:nth-of-type(even)": { backgroundColor: "#F8F8F8" },
                        }}
                      >
                        {columns.map((column, colIndex) => {
                          if (column === "Employee name") {
                            return (
                              <TableCell key={colIndex}>
                                {row?.employee?.full_name || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Date") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.date
                                  ? dayjs(entry.date).format("DD MMM YYYY")
                                  : "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Start date") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.startTime || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "End Time") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.endTime || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Location") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.location || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Department") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.department || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Reason for Overtime") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.reason || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Estimated Pay") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.estimatedPay || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Total Hours") {
                            return (
                              <TableCell key={colIndex}>
                                {entry?.totalHours || "N/A"}
                              </TableCell>
                            );
                          }

                          if (column === "Actions") {
                            return (
                              <TableCell key={colIndex} align="center">
                                <Box
                                  component={Link}
                                  to={`/dashboard/update-overtime?overtimeId=${_id}`}
                                  sx={editIconStyle}
                                >
                                  <Pencil size={18} />
                                </Box>
                                <Box
                                  component="span"
                                  sx={deleteIconStyle}
                                  onClick={() => handleDelete(_id)}
                                >
                                  <Trash2 size={18} />
                                </Box>
                              </TableCell>
                            );
                          }

                          return (
                            <TableCell key={colIndex}>
                              {entry[column] || "N/A"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </section>
      </TableContainer>
      <Pagination
        count={totalPage}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />
    </Paper>
  );
}
