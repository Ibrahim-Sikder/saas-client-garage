/* eslint-disable react/prop-types */
// components/EmployeeSalaryFilters.jsx
import {

  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { allMonths } from "../../../utils/month";

const EmployeeSalaryFilters = ({
  filterMonth,
  filterYear,
  filterDay,
  currentYear,
  onMonthChange,
  onYearChange,
  onDayChange,
  onResetFilters,
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel id="month-select-label">Filter by Month</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={filterMonth}
            label="Filter by Month"
            onChange={onMonthChange}
          >
            <MenuItem value="">All Months</MenuItem>
            {allMonths.map((month) => (
              <MenuItem value={month} key={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel id="year-select-label">Filter by Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={filterYear}
            label="Filter by Year"
            onChange={onYearChange}
          >
            {Array.from({ length: 7 }, (_, i) => currentYear - 5 + i).map(
              (year) => (
                <MenuItem value={year} key={year}>
                  {year}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <FormControl fullWidth>
          <InputLabel id="day-select-label">Filter by Day</InputLabel>
          <Select
            labelId="day-select-label"
            id="day-select"
            value={filterDay}
            label="Filter by Day"
            onChange={onDayChange}
          >
            <MenuItem value="">All Days</MenuItem>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <MenuItem value={day} key={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={3}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onResetFilters}
          startIcon={<Clear />}
          fullWidth
          sx={{ height: "56px" }}
        >
          Reset Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default EmployeeSalaryFilters;