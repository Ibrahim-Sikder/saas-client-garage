/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react"
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
  TextField,
  InputAdornment,
  Pagination,
  Button,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material"
import { Add as AddIcon, CalendarMonth, DateRange, AccessTime, Group } from "@mui/icons-material"
import Swal from "sweetalert2"
import { debounce } from "lodash"

import {
  deleteIconStyle,
  editIconStyle,
  tableCellStyle,
  tableContainerStyle,
  tableHeaderStyle,
  tableStyle,
} from "../../style/tableStyle"
import { SearchIcon } from "lucide-react"
import { Pencil, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useDeleteHolidayMutation, useGetAllHolidaysQuery } from "../../redux/api/holidayApi"

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "success"
    case "inactive":
      return "error"
    case "pending":
      return "warning"
    default:
      return "default"
  }
}

export default function Holiday() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, SetSearch] = useState("")
  const [columns] = useState([
    "Sl",
    "Holiday name",
    "From date",
    "To date",
    "Total Days",
    "Status",
    "Applicable Employees",
    "Actions",
  ])
  const [rows, setRows] = useState([])

  const { data, isLoading } = useGetAllHolidaysQuery({
    limit: 10,
    page: currentPage,
    searchTerm: search,
  })

  const [deleteHoliday] = useDeleteHolidayMutation()

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
          await deleteHoliday(id).unwrap()
          Swal.fire("Deleted!", "The holiday has been deleted.", "success")
        } catch (error) {
          Swal.fire("Error!", "An error occurred while deleting the holiday.", "error")
        }
      }
    })
  }

  const handleSearch = debounce((e) => {
    const value = e.target.value
    SetSearch(value)
  }, 500) // Delay in milliseconds (500ms)

  const handlePageChange = (event, page) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    search
  }, [search])

  const { meta, holidays } = data?.data || { meta: {}, holidays: [] }
  const { totalPage = 1 } = meta || {}

  // Mobile card view for holidays
  const MobileHolidayCard = ({ holiday, index }) => (
    <Card
      sx={{
        mb: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
            {holiday.holidayName}
          </Typography>
          <Chip label={holiday.status} color={getStatusColor(holiday.status)} size="small" sx={{ height: 24 }} />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarMonth fontSize="small" sx={{ mr: 0.5, color: "text.secondary", fontSize: "0.9rem" }} />
              <Typography variant="body2" color="text.secondary">
                From: {new Date(holiday.fromDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DateRange fontSize="small" sx={{ mr: 0.5, color: "text.secondary", fontSize: "0.9rem" }} />
              <Typography variant="body2" color="text.secondary">
                To: {new Date(holiday.toDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccessTime fontSize="small" sx={{ mr: 0.5, color: "text.secondary", fontSize: "0.9rem" }} />
              <Typography variant="body2" color="text.secondary">
                Days: {holiday.totalDays}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {Array.isArray(holiday.applicableEmployees) && holiday.applicableEmployees.length > 0 && (
          <>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1.5, mb: 0.5 }}>
              <Group fontSize="small" sx={{ mr: 0.5, color: "text.secondary", fontSize: "0.9rem" }} />
              <Typography variant="body2" color="text.secondary">
                Applicable to:
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {holiday.applicableEmployees.map((employee, idx) => (
                <Chip
                  key={idx}
                  label={employee}
                  size="small"
                  color={idx % 3 === 0 ? "primary" : idx % 3 === 1 ? "secondary" : "primary"}
                  sx={{
                    height: 24,
                    fontSize: "0.7rem",
                    color: "white",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              ))}
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
          <IconButton
            component={Link}
            to={`/dashboard/update-holiday?holidayId=${holiday._id}`}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              backgroundColor: theme.palette.primary.light + "20",
              mr: 1,
              padding: "4px",
            }}
          >
            <Pencil size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(holiday._id)}
            sx={{
              color: theme.palette.error.main,
              backgroundColor: theme.palette.error.light + "20",
              padding: "4px",
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )

  // Tablet view - simplified table with fewer columns
  const TabletHolidayTable = () => (
    <TableContainer sx={tableContainerStyle}>
      <Table className="customTable" sx={tableStyle} aria-label="employee leave table">
        <TableHead>
          <TableRow sx={tableHeaderStyle}>
            <TableCell sx={tableCellStyle}>Holiday name</TableCell>
            <TableCell sx={tableCellStyle}>Date</TableCell>
            <TableCell sx={tableCellStyle}>Status</TableCell>
            <TableCell sx={tableCellStyle}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...holidays, ...rows].map((row, rowIndex) => (
            <TableRow
              key={row._id || `new-row-${rowIndex}`}
              sx={{
                "&:nth-of-type(odd)": { backgroundColor: "white" },
                "&:nth-of-type(even)": { backgroundColor: "#F8F8F8" },
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {row.holidayName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {row.totalDays} days
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{new Date(row.fromDate).toLocaleDateString()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  to {new Date(row.toDate).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex" }}>
                  <Box to={`/dashboard/update-holiday?holidayId=${row._id}`} component={Link} sx={editIconStyle}>
                    <Pencil size={18} />
                  </Box>
                  <Box component="span" sx={deleteIconStyle} onClick={() => handleDelete(row._id)}>
                    <Trash2 size={18} />
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  // Desktop view - full table
  const DesktopHolidayTable = () => (
    <TableContainer sx={tableContainerStyle}>
      <Table className="customTable" sx={tableStyle} aria-label="employee leave table">
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
          {[...holidays, ...rows].map((row, rowIndex) => (
            <TableRow
              key={row._id || `new-row-${rowIndex}`}
              sx={{
                "&:nth-of-type(odd)": { backgroundColor: "white" },
                "&:nth-of-type(even)": { backgroundColor: "#F8F8F8" },
              }}
            >
              <TableCell>{rowIndex + 1}</TableCell>
              <TableCell>{row.holidayName}</TableCell>
              <TableCell>{new Date(row.fromDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(row.toDate).toLocaleDateString()}</TableCell>
              <TableCell>{row.totalDays}</TableCell>
              <TableCell>
                <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
              </TableCell>
              <TableCell>
                {Array.isArray(row.applicableEmployees) && row.applicableEmployees.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "5px",
                      maxWidth: "300px",
                    }}
                  >
                    {row.applicableEmployees.map((employee, index) => (
                      <Chip
                        color={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "primary"}
                        key={index}
                        label={employee}
                        size="small"
                        sx={{
                          color: "white",
                          transition: "background-color 0.3s ease, transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex" }}>
                  <Box to={`/dashboard/update-holiday?holidayId=${row._id}`} component={Link} sx={editIconStyle}>
                    <Pencil size={18} />
                  </Box>
                  <Box component="span" sx={deleteIconStyle} onClick={() => handleDelete(row._id)}>
                    <Trash2 size={18} />
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        p: { xs: 1.5, sm: 2, md: 3 },
        mt: { xs: 2, sm: 3, md: 5 },
        borderRadius: { xs: "12px", sm: "16px" },
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h5"}
        component="h1"
        gutterBottom
        fontWeight="bold"
        sx={{ mb: { xs: 2, sm: 2.5 } }}
      >
        Holiday list
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: { xs: 1.5, sm: 2 },
          mb: { xs: 2, sm: 2.5 },
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search holidays..."
          onChange={handleSearch}
          fullWidth={isMobile}
          sx={{
            maxWidth: { sm: "300px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={18} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          component={Link}
          to="/dashboard/create-holiday"
          startIcon={<AddIcon />}
          variant="contained"
          fullWidth={isMobile}
          sx={{
            color: "#fff",
            borderRadius: "8px",
            py: { xs: 1, sm: "auto" },
          }}
        >
          Add Holiday
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Typography>Loading holidays...</Typography>
        </Box>
      ) : (
        <>
          {isMobile ? (
            // Mobile view - card layout
            <Box sx={{ mt: 2 }}>
              {[...holidays, ...rows].length > 0 ? (
                [...holidays, ...rows].map((holiday, index) => (
                  <MobileHolidayCard key={holiday._id || `new-row-${index}`} holiday={holiday} index={index} />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">No holidays found</Typography>
                </Box>
              )}
            </Box>
          ) : isTablet ? (
            // Tablet view - simplified table
            <Box sx={{ overflowX: "auto" }}>
              <TabletHolidayTable />
            </Box>
          ) : (
            // Desktop view - full table
            <Box sx={{ overflowX: "auto" }}>
              <DesktopHolidayTable />
            </Box>
          )}
        </>
      )}

      <Pagination
        count={totalPage}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        size={isMobile ? "small" : "medium"}
        sx={{
          mt: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            mx: { xs: 0.25, sm: 0.5 },
          },
        }}
      />
    </Paper>
  )
}
