/* eslint-disable react/prop-types */
import {
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const FilterSection = ({
  dateRange,
  filterStatus,
  filterWarehouse,
  warehouseOptions,
  onDateRangeChange,
  onStatusChange,
  onWarehouseChange,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Start Date */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={onDateRangeChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

        {/* End Date */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="End Date"
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={onDateRangeChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={onStatusChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Warehouse Filter */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={filterWarehouse}
              label="Warehouse"
              onChange={onWarehouseChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Warehouses</MenuItem>
              {warehouseOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FilterSection;
