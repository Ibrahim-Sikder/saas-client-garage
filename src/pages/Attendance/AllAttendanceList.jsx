import {
  CalendarToday,
  Cancel,
  CheckCircle,
  Person,
  Schedule,
  WatchLater,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  Pagination,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import swal from "sweetalert";
import Loading from "../../components/Loading/Loading";
import { useAppOptions } from "../../hooks/useAppOptions";
import {
  useDeleteAttendanceMutation,
  useGetAllEmployeeAttendancesQuery,
} from "../../redux/api/attendance";
import { AttendanceDetails } from "./AttendanceDetails";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceStats from "./AttendanceStats";
import AttendanceTable from "./AttendanceTable";

const AttendanceListPage = () => {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("none");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const limit = 10;
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const buildQueryParams = () => {
    let queryParams = {
      tenantDomain,
      limit,
      page,
    };

    if (searchTerm) queryParams.searchTerm = searchTerm;

    if (filterType === "daily" && startDate && endDate) {
      queryParams.startDate = startDate.format("YYYY-MM-DD");
      queryParams.endDate = endDate.format("YYYY-MM-DD");
    } else if (filterType === "monthly" && selectedMonth) {
      queryParams.month = selectedMonth;
    } else if (filterType === "yearly" && selectedYear) {
      queryParams.year = selectedYear;
    }

    if (filterStatus && filterStatus !== "all") {
      queryParams.status = filterStatus;
    }

    return queryParams;
  };

  const {
    data: attendanceData,
    isLoading,
    error,
    refetch,
  } = useGetAllEmployeeAttendancesQuery(buildQueryParams());
  const handleDeleteAttendance = async (id, date) => {
    performActionWithPermission(
      "/dashboard/attendance-list",
      "delete",
      async () => {
        const formattedDate = dayjs(date, ["DD-MM-YYYY", "DD-MM-YY"]).format(
          "YYYY-MM-DD",
        );
        const willDelete = await swal({
          title: "Are you sure?",
          text: `You want to delete attendance for ${formattedDate}?`,
          icon: "warning",
          dangerMode: true,
          buttons: ["Cancel", "Yes, Delete"],
        });

        if (willDelete) {
          try {
            const response = await deleteAttendance({
              tenantDomain,
              id,
              date: formattedDate,
            }).unwrap();

            if (response.success) {
              swal(
                "Deleted!",
                `Attendance record has been deleted successfully.`,
                "success",
              );
              refetch();
            } else {
              swal(
                "Error",
                response.message || "Failed to delete attendance",
                "error",
              );
            }
          } catch (error) {
            console.error("Delete error:", error);
            swal(
              "Error",
              error.message || "Failed to delete attendance",
              "error",
            );
          }
        }
      },
      "You don't have permission to delete attendance records.",
    );
  };

  const handleViewDetails = (attendance) => {
    setSelectedAttendance(attendance);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedAttendance(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusChip = (attendance) => {
    if (attendance.absent) {
      return (
        <Chip
          icon={<Cancel />}
          label="Absent"
          color="error"
          variant="outlined"
        />
      );
    } else if (attendance.late_status) {
      return (
        <Chip
          icon={<WatchLater />}
          label="Late"
          color="warning"
          variant="outlined"
        />
      );
    } else {
      return (
        <Chip
          icon={<CheckCircle />}
          label="Present"
          color="success"
          variant="outlined"
        />
      );
    }
  };

  const calculateWorkingHours = (inTime, outTime) => {
    if (!inTime || !outTime) return "N/A";

    const [inHours, inMinutesPart] = inTime.split(":");
    const [inMinutes, inPeriod] = inMinutesPart.split(" ");
    const [outHours, outMinutesPart] = outTime.split(":");
    const [outMinutes, outPeriod] = outMinutesPart.split(" ");

    let inTotalMinutes = parseInt(inHours) * 60 + parseInt(inMinutes);
    if (inPeriod === "PM" && inHours !== "12") inTotalMinutes += 12 * 60;

    let outTotalMinutes = parseInt(outHours) * 60 + parseInt(outMinutes);
    if (outPeriod === "PM" && outHours !== "12") outTotalMinutes += 12 * 60;

    const duration = outTotalMinutes - inTotalMinutes;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Attendance data not found. Try again! {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <AttendanceHeader />
        <AttendanceStats summary={attendanceData?.data?.attendanceSummary} />
        <AttendanceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterType={filterType}
          setFilterType={setFilterType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          page={page}
          setPage={setPage}
          filterMenuAnchor={filterMenuAnchor}
          setFilterMenuAnchor={setFilterMenuAnchor}
          refetch={refetch}
        />

        {/* Tabs for different views */}
        <Paper sx={{ mb: 2, borderRadius: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            variant="scrollable"
          >
            <Tab icon={<Schedule />} label="Daily View" />
            <Tab icon={<CalendarToday />} label="Monthly Summary" />
            <Tab icon={<Person />} label="Employee Reports" />
          </Tabs>
        </Paper>

        <AttendanceTable
          theme={theme}
          attendanceData={attendanceData}
          calculateWorkingHours={calculateWorkingHours}
          getStatusChip={getStatusChip}
          handleViewDetails={handleViewDetails}
          handleDeleteAttendance={handleDeleteAttendance}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * limit + 1}-
            {Math.min(page * limit, attendanceData?.data?.totalRecords || 0)} of{" "}
            {attendanceData?.data?.totalRecords || 0} records
          </Typography>
          <Pagination
            count={attendanceData?.data?.totalPages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>

        <AttendanceDetails
          calculateWorkingHours={calculateWorkingHours}
          open={viewDialogOpen}
          onClose={handleCloseDialog}
          selectedAttendance={selectedAttendance}
          getStatusChip={getStatusChip}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceListPage;
