/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Clock, CheckCircle, XCircle, Timer } from "lucide-react";
import {
  TableRow,
  TableCell,
  Checkbox,
  TextField,
  Avatar,
  Chip,
  Tooltip,
  Box,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AttendanceTimePicker from "./AttendanceTimePicker";
import AttendanceOutTimePicker from "./AttendanceForOutTime";

const EmployeeRow = ({
  employee,
  index,
  profileData,
  presentState,
  absentState,
  inTime,
  outTime,
  overtime,
  lateStatus,
  selectedDate,
  handlePresent,
  handleAbsent,
  handleAttendanceInTime,
  handleAttendanceOutTime,
  handleAttendanceOvertime,
  handleLate,
  handleDateChange,
}) => {
  const handleDateSelection = (newDate) => {
    if (handleDateChange) {
      handleDateChange(index, newDate);
    }
  };

  return (
    <TableRow
      sx={{
        backgroundColor: index % 2 === 0 ? "#f8fafc" : "white",
        "&:hover": { backgroundColor: "#eef2ff" },
        transition: "background-color 0.2s",
      }}
    >
      <TableCell>
        <div className="font-medium text-gray-900">{index + 1}</div>
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
            {employee.full_name.charAt(0)}
          </Avatar>
          <div className="font-medium text-gray-900">{employee.full_name}</div>
        </div>
      </TableCell>

      <TableCell>
        <Chip
          label={employee.employeeId}
          size="small"
          sx={{
            backgroundColor: "#eef2ff",
            color: "#4f46e5",
            fontWeight: 500,
          }}
        />
      </TableCell>

      <TableCell>
        <div className="text-gray-600">{employee.designation}</div>
      </TableCell>

      <TableCell>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateSelection}
            format="DD-MM-YYYY"
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                sx: {
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </TableCell>

      <TableCell>
        <Checkbox
          onChange={() => handlePresent(index)}
          checked={presentState[index]}
          sx={{
            color: "#22c55e",
            "&.Mui-checked": { color: "#22c55e" },
          }}
        />
      </TableCell>

      <TableCell>
        <Checkbox
          onChange={() => handleAbsent(index)}
          checked={absentState[index]}
          sx={{
            color: "#ef4444",
            "&.Mui-checked": { color: "#ef4444" },
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
        />
      </TableCell>

      <TableCell>
        <AttendanceOutTimePicker
          handleAttendanceOutTime={handleAttendanceOutTime}
          index={index}
        />
      </TableCell>

      <TableCell>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          placeholder="Hours"
          onChange={(e) => handleAttendanceOvertime(index, e.target.value)}
          InputProps={{
            startAdornment: <Timer className="h-4 w-4 text-gray-400 mr-1" />,
          }}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
        />
      </TableCell>

      <TableCell>
        {presentState[index] ? (
          <Tooltip title="Mark as Late">
            <Box sx={{ display: "flex", justifyContent: "center", cursor: "pointer" }}>
              <div
                onClick={() => handleLate(index, true)}
                className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
              >
                <XCircle className="text-green-600" size={20} />
              </div>
            </Box>
          </Tooltip>
        ) : (
          <Tooltip title="Mark as On Time">
            <Box sx={{ display: "flex", justifyContent: "center", cursor: "pointer" }}>
              <div
                onClick={() => handleLate(index, false)}
                className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
              >
                <CheckCircle className="text-red-600" size={20} />
              </div>
            </Box>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

export default EmployeeRow;