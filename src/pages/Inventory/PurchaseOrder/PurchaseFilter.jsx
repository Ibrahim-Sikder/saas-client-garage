/* eslint-disable react/prop-types */
import { CalendarToday } from "@mui/icons-material";
import { Paper, Grid, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FiltersSection = ({ dateRange, onDateRangeChange, filterStatus, onFilterStatusChange }) => {
  const dateFields = ["startDate", "endDate"];
  const statusOptions = ["all", "pending", "confirmed", "shipped", "received", "cancelled"];

  return (
    <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>


      <Grid container spacing={2} sx={{ mb: 2 }}>


        {dateFields.map((field, i) => (
          <Grid item xs={6} md={3} key={i}>
            <TextField
              fullWidth
              type="date"
              name={field}
              label={field === "startDate" ? "Start Date" : "End Date"}
              value={dateRange[field]}
              onChange={onDateRangeChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <InputAdornment position="start"><CalendarToday fontSize="small" /></InputAdornment>, sx: { borderRadius: 2 } }}
            />
          </Grid>
        ))}

        <Grid item xs={12} md={3}>

          <FormControl fullWidth>
            <InputLabel>Status Filter</InputLabel>
            <Select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)} sx={{ borderRadius: 2 }}>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

    </Paper>
  );
};

export default FiltersSection;
