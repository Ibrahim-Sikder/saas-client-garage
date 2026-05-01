/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { Box, Typography, Button, Paper } from "@mui/material"
import { Search, Refresh, CalendarToday } from "@mui/icons-material"


const NoSalaryDataFound = ({ selectedMonth, onReset }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: "center", borderRadius: 2, backgroundColor: "background.paper" }}>
      <Search sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
        No Salary Data Found
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        We couldn't find any salary records for {selectedMonth}.
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          This could be because:
        </Typography>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            <CalendarToday fontSize="small" sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
            Salaries haven't been processed for this month yet
          </li>
          <li>
            <Search fontSize="small" sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }} />
            There might be a data synchronization issue
          </li>
        </ul>
      </Box>
      <Button variant="contained" color="primary" startIcon={<Refresh />} onClick={onReset} sx={{ mt: 2 }}>
        Reset Filter
      </Button>
    </Paper>
  )
}

export default NoSalaryDataFound

