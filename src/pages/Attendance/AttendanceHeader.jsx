import { Box, Typography, useTheme } from "@mui/material";

const AttendanceHeader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white",
        boxShadow: theme.shadows[4],
      }}
    >
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Attendance Management
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9 }}>
        View and manage all attendance records in your system
      </Typography>
    </Box>
  );
};

export default AttendanceHeader;
