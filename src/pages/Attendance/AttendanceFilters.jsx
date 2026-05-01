/* eslint-disable react/prop-types */

import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Menu,
  Paper,
} from "@mui/material";
import { Search, FilterList, Refresh, DateRange } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

const AttendanceFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  setPage,
  filterMenuAnchor,
  setFilterMenuAnchor,
  refetch,
}) => {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(1);
  };

  const handleFilterMenuOpen = (e) => setFilterMenuAnchor(e.currentTarget);
  const handleFilterMenuClose = () => setFilterMenuAnchor(null);
  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setPage(1);
    handleFilterMenuClose();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterType("none");
    setStartDate(null);
    setEndDate(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setPage(1);
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
        <TextField
          placeholder="Search by employee name or ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250, flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="present">Present</MenuItem>
            <MenuItem value="absent">Absent</MenuItem>
            <MenuItem value="late">Late</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<DateRange />}
          onClick={handleFilterMenuOpen}
        >
          {filterType === "none"
            ? "Date Filter"
            : filterType === "daily"
            ? "Date Range"
            : filterType === "monthly"
            ? "Monthly"
            : "Yearly"}
        </Button>

        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem
            onClick={() => handleFilterTypeChange("none")}
            selected={filterType === "none"}
          >
            No Date Filter
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterTypeChange("daily")}
            selected={filterType === "daily"}
          >
            Date Range
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterTypeChange("monthly")}
            selected={filterType === "monthly"}
          >
            Monthly
          </MenuItem>
          <MenuItem
            onClick={() => handleFilterTypeChange("yearly")}
            selected={filterType === "yearly"}
          >
            Yearly
          </MenuItem>
        </Menu>

        {filterType === "daily" && (
          <Box display="flex" gap={1}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(val) => {
                setStartDate(val);
                setPage(1);
              }}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(val) => {
                setEndDate(val);
                setPage(1);
              }}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
          </Box>
        )}
        {filterType === "monthly" && (
          <TextField
            label="Month"
            type="month"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setPage(1);
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
        )}
        {filterType === "yearly" && (
          <TextField
            label="Year"
            type="number"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setPage(1);
            }}
            InputLabelProps={{ shrink: true }}
            size="small"
            inputProps={{ min: 2000, max: 2100 }}
          />
        )}

        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={refetch}
          sx={{ ml: "auto" }}
        >
          Refresh
        </Button>
      </Box>
    </Paper>
  );
};

export default AttendanceFilters;
