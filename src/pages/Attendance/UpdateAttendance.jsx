/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Paper,
  Avatar,
  Tooltip,
  CircularProgress,
  Chip,
  Button,
  IconButton,
} from "@mui/material";
import {
  Save,
  ArrowUpIcon as ArrowBack,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  UserCheck,
  UserX,
  Timer,
  Edit,
} from "lucide-react";
import AttendanceTimePicker from "./AttendanceTimePicker";
import AttendanceOutTimePicker from "./AttendanceForOutTime";
import {
  useCreateAttendanceMutation,
  useGetSingleAttendanceQuery,
} from "../../redux/api/attendance";
import Loading from "../../components/Loading/Loading";
import { columns } from "./AddAttendance";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useAppOptions } from "../../hooks/useAppOptions";

const UpdateAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const date = new URLSearchParams(location.search).get("date");
  const { tenantDomain, performActionWithPermission } = useAppOptions()
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [error, setError] = useState("");
  const [presentState, setPresentState] = useState(
    new Array(employeeAttendance?.length).fill(false)
  );
  const [absentState, setAbsentState] = useState(
    new Array(employeeAttendance?.length).fill(false)
  );
  const [inTime, setInTime] = useState(
    new Array(employeeAttendance?.length).fill(null)
  );
  const [outTime, setOutTime] = useState(
    new Array(employeeAttendance?.length).fill(null)
  );
  const [overtime, setOvertime] = useState(
    new Array(employeeAttendance?.length).fill(null)
  );
  const [lateStatus, setLateStatus] = useState(
    new Array(employeeAttendance?.length).fill(false)
  );
  const { data: profileData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  const {
    data: singleAttendance,
    isLoading: singleAttendanceLoading,
    error: singleAttendanceError,
    refetch,
  } = useGetSingleAttendanceQuery({ tenantDomain, date });

  const [updateAttendance, { isLoading: updateLoading, error: updateError }] =
    useCreateAttendanceMutation();

  useEffect(() => {
    if (singleAttendance?.data) {
      setPresentState(singleAttendance.data.map((a) => a.present));
      setAbsentState(singleAttendance.data.map((a) => a.absent));
      setInTime(singleAttendance.data.map((a) => a.in_time));
      setOutTime(singleAttendance.data.map((a) => a.out_time));
      setOvertime(singleAttendance.data.map((a) => a.overtime));
      setLateStatus(singleAttendance.data.map((a) => a.late_status));
    }
  }, [singleAttendance]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/employee`)
      .then((response) => {
        const attendanceData = response.data.employee.map(
          (data) => data.attendance
        );
        const allAttendance = attendanceData.flat();
        const filteredAttendance = allAttendance.filter(
          (attendance) => attendance.date === date
        );
        setEmployeeAttendance(filteredAttendance);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [date]);

  const formatTime = (time) => {
    if (!time) return "";
    return dayjs(time).format("h:mmA");
  };

  const handlePresent = (index) => {
    const newPresentState = [...presentState];
    const newAbsentState = [...absentState];

    // Toggle present state
    newPresentState[index] = !newPresentState[index];

    // If present checkbox is checked, uncheck absent checkbox
    if (newPresentState[index]) {
      newAbsentState[index] = false;
    }

    // Update states
    setPresentState(newPresentState);
    setAbsentState(newAbsentState);
  };

  // Handler for absent checkbox
  const handleAbsent = (index) => {
    const newAbsentState = [...absentState];
    const newPresentState = [...presentState];

    // Toggle absent state
    newAbsentState[index] = !newAbsentState[index];

    // If absent checkbox is checked, uncheck present checkbox
    if (newAbsentState[index]) {
      newPresentState[index] = false;
    }

    // Update states
    setAbsentState(newAbsentState);
    setPresentState(newPresentState);
  };
  const handleAttendanceInTime = (index, time) => {
    const formattedTime = formatTime(time);
    setInTime((prev) => {
      const updated = [...prev];
      updated[index] = formattedTime;
      return updated;
    });
  };

  const handleAttendanceOutTime = (index, time) => {
    const formattedTime = formatTime(time);
    setOutTime((prev) => {
      const updated = [...prev];
      updated[index] = formattedTime;
      return updated;
    });
  };

  const handleAttendanceOvertime = (index, value) => {
    setOvertime((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleLate = (index) => {
    setLateStatus((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleSubMitAttendance = async () => {
    performActionWithPermission('/dashboard/update-attendance', 'edit',
      async () => {
        const newAttendanceData = singleAttendance?.data?.map(
          (attendance, index) => ({
            employee: attendance.employee,
            full_name: attendance.full_name,
            employeeId: attendance.employeeId,
            status: attendance.status,
            designation: attendance.designation,
            date: attendance.date,
            office_time: "10:00",
            present: presentState[index],
            absent: absentState[index],
            in_time: inTime[index],
            out_time: outTime[index],
            overtime: overtime[index],
            late_status: lateStatus[index],
          })
        );

        try {
          const response = await updateAttendance({
            tenantDomain,
            payload: newAttendanceData,
          }).unwrap();
          if (response.success) {
            toast.success("Attendance update successful.");
            navigate("/dashboard/attendance-list");
            refetch();
          }
        } catch (error) {
          toast.error(
            error.message || "An error occurred while updating attendance."
          );
        }
      }, "You don't have permission to update attendance."
    )
  };

  if (singleAttendanceLoading) {
    return <Loading />;
  }

  if (singleAttendanceError) {
    toast.error(
      singleAttendanceError?.data?.message ||
      "An error occurred while fetching attendance data."
    );
  }

  // Calculate attendance statistics
  const totalEmployees = singleAttendance?.data?.length || 0;
  const presentCount = presentState.filter(Boolean).length;
  const absentCount = absentState.filter(Boolean).length;
  const lateCount = lateStatus.filter(Boolean).length;

  return (
    <div className="pt-8 pb-20 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 px-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-lg shadow-lg">
            <Edit className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              Update Attendance
            </h3>
            <div className="flex items-center text-slate-500 text-sm">
              <span>Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-indigo-600">Update Attendance</span>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="text-sm text-slate-500 mb-1">Selected Date</div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span className="font-medium text-slate-700">{date}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 md:px-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total Employees
            </p>
            <h4 className="text-3xl font-bold text-indigo-600">
              {totalEmployees}
            </h4>
          </div>
          <div className="bg-indigo-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Present</p>
            <h4 className="text-3xl font-bold text-green-600">
              {presentCount}
            </h4>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Absent</p>
            <h4 className="text-3xl font-bold text-red-600">{absentCount}</h4>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <UserX className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Late</p>
            <h4 className="text-3xl font-bold text-amber-600">{lateCount}</h4>
          </div>
          <div className="bg-amber-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="px-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <TableContainer component={Paper} elevation={0}>
            <Table aria-label="employee attendance update table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      sx={{
                        backgroundColor:
                          index === 0
                            ? "#4f46e5"
                            : `rgba(79, 70, 229, ${1 - index * 0.07})`,
                        color:
                          index < 8
                            ? "white"
                            : index < 10
                              ? "#1e1b4b"
                              : "#1e1b4b",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        padding: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {singleAttendance?.data?.map((attendance, index) => (
                  <TableRow
                    key={attendance._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f8fafc" : "white",
                      "&:hover": {
                        backgroundColor: "#eef2ff",
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {index + 1}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            backgroundColor: `hsl(${index * 40}, 70%, 50%)`,
                            fontSize: "0.875rem",
                          }}
                        >
                          {attendance.full_name.charAt(0)}
                        </Avatar>
                        <div className="font-medium text-gray-900">
                          {attendance.full_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={attendance.employeeId}
                        size="small"
                        sx={{
                          backgroundColor: "#eef2ff",
                          color: "#4f46e5",
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600">
                        {attendance.designation}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-indigo-500" />
                        <span>{attendance.date}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Checkbox
                        checked={
                          presentState[index] !== undefined
                            ? presentState[index]
                            : attendance?.present
                        }
                        onChange={() => handlePresent(index)}
                        sx={{
                          color: "#22c55e",
                          "&.Mui-checked": {
                            color: "#22c55e",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={
                          absentState[index] !== undefined
                            ? absentState[index]
                            : attendance.absent
                        }
                        onChange={() => handleAbsent(index)}
                        sx={{
                          color: "#ef4444",
                          "&.Mui-checked": {
                            color: "#ef4444",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        <span>{profileData?.data?.officeTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AttendanceTimePicker
                        handleAttendanceInTime={handleAttendanceInTime}
                        index={index}
                        defaultValue={attendance?.in_time}
                      />
                    </TableCell>
                    <TableCell>
                      <AttendanceOutTimePicker
                        handleAttendanceOutTime={handleAttendanceOutTime}
                        index={index}
                        defaultValue={attendance?.out_time}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        variant="outlined"
                        size="small"
                        placeholder="Hours"
                        value={overtime[index] || ""}
                        onChange={(e) =>
                          handleAttendanceOvertime(index, e.target.value)
                        }
                        InputProps={{
                          startAdornment: (
                            <Timer className="h-4 w-4 text-gray-400 mr-1" />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <></>
                      <Tooltip
                        title={
                          lateStatus[index] ? "Mark as On Time" : "Mark as Late"
                        }
                      >
                        <IconButton onClick={() => handleLate(index)}>
                          {presentState[index] ? (
                            <XCircle className="text-red-500" size={24} />
                          ) : (
                            <CheckCircle className="text-green-500" size={24} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex justify-between items-center p-6">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/dashboard/attendance-list")}
            >
              Back to Attendance List
            </Button>
            <Button
              variant="contained"
              startIcon={
                updateLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Save />
                )
              }
              onClick={handleSubMitAttendance}
              disabled={updateLoading}
              sx={{
                backgroundColor: "#4f46e5",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#4338ca",
                },
              }}
            >
              {updateLoading ? "Updating..." : "Update Attendance"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAttendance;
