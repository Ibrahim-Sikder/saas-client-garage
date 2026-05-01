/* eslint-disable react/prop-types */
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import avatar from "../../../../public/assets/chat3.jpg";
import { AnimatedAvatar } from "../../../utils/customStyle";
import { useMemo } from "react";

const EmployeeProfileHeader = ({
  employee,
  attendancePercentage,
  attendanceCount,
  daysInMonth,
  monthName,
  currentYear,
}) => {
  // --- Logic to find current month's salary data from the array ---
  const currentSalaryData = useMemo(() => {
    if (!employee?.salary || !monthName || !currentYear) return null;

    // Find the record where month and year match the props
    return employee.salary.find(
      (item) =>
        item.month_of_salary === monthName &&
        String(item.year_of_salary) === String(currentYear),
    );
  }, [employee, monthName, currentYear]);

  // Extract values safely, defaulting to 0
  const displayOvertime = currentSalaryData?.total_overtime || 0;
  const displaySalary = currentSalaryData?.salary_amount || 0;

  return (
    <Box sx={{ mt: -12, px: 4, pb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative" }}>
              <AnimatedAvatar
                src={employee?.image || avatar}
                alt={employee?.full_name}
                className="profile-image-pulse"
                sx={{
                  width: 160,
                  height: 160,
                  border: "6px solid rgba(255,255,255,0.9)",
                }}
              />
              <Box
                sx={{
                  bottom: 10,
                  right: 10,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight="bold"
              mt={3}
              sx={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
              }}
            >
              {employee?.full_name}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                fontWeight: 500,
                textAlign: "center",
                mt: 1,
              }}
            >
              {employee?.designation}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              p: 3,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(102, 126, 234, 0.1)",
                  }}
                >
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={`Joined: ${employee?.join_date}`}
                    sx={{
                      borderRadius: "20px",
                      px: 2,
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(240, 147, 251, 0.1)",
                  }}
                >
                  <EmailIcon sx={{ mr: 2, color: "#f093fb", fontSize: 28 }} />
                  <Typography fontWeight="500">{employee?.email}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(118, 75, 162, 0.1)",
                  }}
                >
                  <PhoneIcon sx={{ mr: 2, color: "#764ba2", fontSize: 28 }} />
                  {/* Updated to use full_phone_number from API */}
                  <Typography fontWeight="500">
                    {employee?.full_phone_number || employee?.phone_number}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: "12px",
                    background: "rgba(245, 87, 108, 0.1)",
                  }}
                >
                  <LocationOnIcon
                    sx={{ mr: 2, color: "#f5576c", fontSize: 28 }}
                  />
                  {/* Updated to use present_address from API */}
                  <Typography fontWeight="500">
                    {employee?.present_address || employee?.permanent_address}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mt: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "20px",
                p: 3,
                color: "white",
                boxShadow: "0 15px 35px rgba(102, 126, 234, 0.3)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Overtime
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 50,
                    height: 50,
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 28 }} />
                </Avatar>
              </Box>
              {/* Displaying overtime from specific month record */}
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {displayOvertime} hrs
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {monthName}, {currentYear}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "20px",
                p: 3,
                color: "white",
                boxShadow: "0 15px 35px rgba(240, 147, 251, 0.3)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total Salary
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 50,
                    height: 50,
                  }}
                >
                  ৳
                </Avatar>
              </Box>
              {/* Displaying salary from specific month record */}
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                ৳ {displaySalary}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                minWidth: 200,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "20px",
                p: 3,
                color: "white",
                boxShadow: "0 15px 35px rgba(79, 172, 254, 0.3)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Attendance
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={attendancePercentage}
                  size={50}
                  thickness={6}
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                {attendancePercentage}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {attendanceCount} / {daysInMonth} days
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmployeeProfileHeader;
