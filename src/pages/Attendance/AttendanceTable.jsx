/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Can from "../../components/Can";

const AttendanceTable = ({
  theme,
  attendanceData,
  calculateWorkingHours,
  getStatusChip,
  handleViewDetails,
  handleDeleteAttendance,
}) => {
  return (
    <Paper sx={{ width: "100%", borderRadius: 3, overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
            >
              <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                In Time
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Out Time
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Working Hours
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Overtime
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData?.data?.attendances?.map((attendance) => (
              <TableRow
                key={attendance._id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  },
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: theme.palette.primary.main,
                      }}
                    >
                      {attendance.full_name?.charAt(0) || "E"}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600">
                        {attendance.full_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {attendance.employeeId} • {attendance.designation}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">{attendance.date}</Typography>
                </TableCell>
                <TableCell align="center">
                  {getStatusChip(attendance)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={attendance.in_time || "N/A"}
                    color={attendance.in_time ? "primary" : "default"}
                    variant={attendance.in_time ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={attendance.out_time || "N/A"}
                    color={attendance.out_time ? "primary" : "default"}
                    variant={attendance.out_time ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" fontWeight="500">
                    {calculateWorkingHours(
                      attendance.in_time,
                      attendance.out_time
                    )}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={
                      attendance.overtime ? `${attendance.overtime}h` : "N/A"
                    }
                    color={attendance.overtime ? "secondary" : "default"}
                    variant={attendance.overtime ? "filled" : "outlined"}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(attendance)}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <Can page="/dashboard/attendance-list" action="edit">
                        <IconButton
                          component={Link}
                          to={`/dashboard/update-attendance?date=${attendance?.date}`}
                          color="secondary"
                        >
                          <Edit />
                        </IconButton>
                      </Can>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Can page="/dashboard/attendance-list" action="delete">
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleDeleteAttendance(
                              attendance._id,
                              attendance.date
                            )
                          }
                        >
                          <Delete />
                        </IconButton>
                      </Can>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {(!attendanceData?.data?.attendances ||
        attendanceData.data.attendances.length === 0) && (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            No attendance records found
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AttendanceTable;
