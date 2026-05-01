/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,

} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Clock, Plus, ArrowLeft } from "lucide-react";
import TASForm from "../../components/form/Form";
import TASAutocomplete from "../../components/form/Autocomplete";
import TASTextarea from "../../components/form/Textarea";
import TASTimePicker from "../../components/form/TimePicker";
import TASInput from "../../components/form/Input";
import TASSelect from "../../components/form/Select";
import { departmentOption } from "../../constant";
import TASSwitch from "../../components/form/switch";
import { useGetAllEmployeesQuery } from "../../redux/api/employee";
import {
  useCreateEmployeeOvertimeMutation,
  useGetSingleEmployeeOvertimeQuery,
  useUpdateEmployeeOvertimeMutation,
} from "../../redux/api/overtimeApi";
import { toast } from "react-toastify";
import TASDateCalendar from "../../components/form/datecalender";
import { useNavigate } from "react-router-dom";
import { ResponsiveCalendarContainer } from "../../utils/customStyle";
import { useTenantDomain } from "../../hooks/useTenantDomain";

export default function OvertimeForm({ overtimeId }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const tenantDomain = useTenantDomain();
  const [createEmployeeOvertime] = useCreateEmployeeOvertimeMutation();
  const [updateEmployeeOvertime] = useUpdateEmployeeOvertimeMutation();
  const {
    data: singleOvertime,
    isLoading,
  } = useGetSingleEmployeeOvertimeQuery({ tenantDomain, overtimeId });

  const navigate = useNavigate();
  const { data } = useGetAllEmployeesQuery({
    tenantDomain,
    limit: 99999999999,
    page: 1,
    searchTerm: "",
  });

  const employeeOptions = useMemo(() => {
    if (!data?.data?.employees) return [];
    return data.data?.employees?.map((employee) => ({
      label: employee.full_name,
      value: employee._id,
    }));
  }, [data]);

  const handleFormSubmit = async (data, reset) => {
    const toastId = toast.loading("Creating Employee Overtime...");

    const formsubmit = {
      employee:
        data.employee &&
          data.employee[0] &&
          employeeOptions.find((cat) => cat.label === data.employee[0])?.value
          ? [
            employeeOptions.find((cat) => cat.label === data.employee[0])
              ?.value,
          ]
          : [],
      entries: [
        {
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          reason: data.reason,
          location: data.location,
          department: data.department,
          isUrgent: data.isUrgent,
        },
      ],
    };

    try {
      const res = await createEmployeeOvertime({
        tenantDomain,
        ...formsubmit,
      }).unwrap();

      toast.update(toastId, {
        render: res.message || "Employee overtime created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      reset();
      navigate("/dashboard/employee-overtime");
    } catch (error) {
      const errorMessage =
        error.message || error?.data?.message || "Something went wrong!";

      toast.update(toastId, {
        render: `Error creating overtime: ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleSubmit = async (data, reset) => {
    const toastId = toast.loading("Updating Employee Overtime...");

    const formsubmit = {
      employee:
        data.employee &&
          data.employee[0] &&
          employeeOptions.find((cat) => cat.label === data.employee[0])?.value
          ? [
            employeeOptions.find((cat) => cat.label === data.employee[0])
              ?.value,
          ]
          : [],
      entries: [
        {
          date: data.date,
          startTime: data.startTime,
          endTime: data.endTime,
          reason: data.reason,
          location: data.location,
          department: data.department,
          isUrgent: data.isUrgent,
        },
      ],
    };

    try {
      const res = await updateEmployeeOvertime({
        tenantDomain,
        overtimeId,
        ...formsubmit,
      }).unwrap();

      toast.update(toastId, {
        render: res.message || "Employee overtime updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      reset();
      navigate("/dashboard/employee-overtime");
    } catch (error) {
      const errorMessage =
        error.message || error?.data?.message || "Something went wrong!";

      toast.update(toastId, {
        render: `Error updating overtime: ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const defaultValues = {
    employee:
      (singleOvertime?.data?.employee && [
        singleOvertime?.data?.employee?.full_name,
      ]) ||
      [],
    startTime: singleOvertime?.data?.entries[0].startTime || "",
    endTime: singleOvertime?.data?.entries[0].endTime || "",
    reason: singleOvertime?.data?.entries[0].reason || "",
    department: singleOvertime?.data?.entries[0].department || "",
    location: singleOvertime?.data?.entries[0].location || "",
    isUrgent: singleOvertime?.data?.entries[0].isUrgent || false,
    date: singleOvertime?.data?.entries[0].date || null,
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <TASForm
      onSubmit={overtimeId ? handleSubmit : handleFormSubmit}
      defaultValues={overtimeId && defaultValues}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            bgcolor: "#f8f9fa",
            minHeight: "100vh",
            py: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2, md: 4 },
            overflow: "hidden", // Prevent horizontal scrolling
          }}
        >
          <Container
            maxWidth="xxl"
            sx={{
              mt: { xs: 1, sm: 2, md: 4 },
              mb: { xs: 1, sm: 2, md: 4 },
              px: { xs: 0, sm: 1, md: 2, lg: 10 }, // Reduced padding on mobile
              width: "100%",
            }}
          >
            <Paper
              elevation={isMobile ? 1 : 3}
              sx={{
                p: { xs: 1.5, sm: 2, md: 3, lg: 4 }, // Reduced padding on mobile
                borderRadius: { xs: 1, sm: 2 },
                bgcolor: "#ffffff",
                width: "100%",
                boxSizing: "border-box", // Ensure padding is included in width calculation
                overflow: "hidden", // Prevent content overflow
              }}
            >
              {/* Header with back button for mobile */}
              {isMobile && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <IconButton
                      onClick={handleBack}
                      sx={{ mr: 1, color: theme.palette.primary.main }}
                    >
                      <ArrowLeft size={20} />
                    </IconButton>
                    <Typography
                      variant="h6"
                      component="h1"
                      sx={{ fontWeight: "bold", color: "#1a237e" }}
                    >
                      {overtimeId ? "Update Overtime" : "Add Overtime"}
                    </Typography>
                  </Box>
                  <Divider />
                </Box>
              )}

              {/* Title - Hide on mobile as we have the header */}
              {!isMobile && (
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  gutterBottom
                  sx={{
                    mb: { xs: 2, md: 4 },
                    fontWeight: "bold",
                    color: "#1a237e",
                    textAlign: "center",
                  }}
                >
                  Employee Overtime Management
                </Typography>
              )}

              <Grid
                container
                spacing={isSmallScreen ? 2 : 3}
                direction={isSmallScreen ? "column-reverse" : "row"}
              >
                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={isSmallScreen ? 0 : 2}
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 3 }, // Reduced padding on mobile
                      borderRadius: { xs: 1, sm: 2 },
                      bgcolor: "#fff",
                      border: isSmallScreen ? "1px solid #e0e0e0" : "none",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                      }}
                    >
                      Overtime Details
                    </Typography>
                    <Grid container spacing={isMobile ? 1.5 : 2}>
                      <Grid item xs={12}>
                        <TASAutocomplete
                          options={employeeOptions}
                          size={isMobile ? "small" : "medium"}
                          fullWidth
                          name="employee"
                          label="Employee Name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TASTimePicker
                          name="startTime"
                          label="Start Time"
                          required={true}
                          fullWidth={true}
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TASTimePicker
                          name="endTime"
                          label="End Time"
                          required={true}
                          fullWidth={true}
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TASTextarea
                          fullWidth
                          label="Reason for Overtime"
                          required
                          multiline
                          name="reason"
                          rows={isMobile ? 3 : 5}
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TASInput
                          size={isMobile ? "small" : "medium"}
                          fullWidth
                          name="location"
                          label="Location"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TASSelect
                          items={departmentOption}
                          size={isMobile ? "small" : "medium"}
                          fullWidth
                          name="department"
                          label="Department"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TASSwitch
                          name="isUrgent"
                          label="Urgent Overtime"
                          required
                          fullWidth
                          margin="normal"
                        />
                      </Grid>

                      {isSmallScreen && (
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            startIcon={<Plus size={18} />}
                            fullWidth
                            sx={{
                              mt: 1,
                              color: "#fff",
                              py: 1.5,
                              borderRadius: "8px",
                            }}
                          >
                            {overtimeId
                              ? "Update Overtime Entry"
                              : "Add Overtime Entry"}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={isSmallScreen ? 0 : 2}
                    sx={{
                      p: { xs: 1.5, sm: 2, md: 3 },
                      borderRadius: { xs: 1, sm: 2 },
                      bgcolor: "#fff",
                      border: isSmallScreen ? "1px solid #e0e0e0" : "none",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "#1a237e",
                        fontWeight: "bold",
                        fontSize: { xs: "1.1rem", md: "1.25rem" },
                        mb: { xs: 1, md: 2 },
                      }}
                    >
                      Select Date
                    </Typography>

                    {/* Responsive calendar container */}
                    <ResponsiveCalendarContainer className="responsive-calendar-container">
                      <TASDateCalendar label="date" name="date" />
                    </ResponsiveCalendarContainer>
                  </Paper>
                </Grid>
              </Grid>
              <Box
                sx={{
                  mt: { xs: 2, md: 4 },
                  p: { xs: 1.5, sm: 2, md: 3 },
                  border: "1px solid #e0e0e0",
                  borderRadius: { xs: 1, sm: 2 },
                  bgcolor: "#f5f5f5",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: 1, sm: 0 },
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{
                    color: "#1a237e",
                    fontWeight: isMobile ? "medium" : "bold",
                  }}
                >
                  Total Overtime Hours:
                </Typography>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  sx={{
                    color: "#1a237e",
                    fontWeight: isMobile ? "medium" : "bold",
                  }}
                >
                  Estimated Overtime Pay: $
                </Typography>
              </Box>
              {!isSmallScreen && (
                <Box
                  sx={{
                    mt: { xs: 2, md: 4 },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "flex-end",
                    gap: 2,
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    size={isMobile ? "medium" : "large"}
                    type="submit"
                    startIcon={<Clock />}
                    sx={{
                      mr: { xs: 0, sm: 2 },
                      color: "#fff",
                      order: { xs: 1, sm: 0 },
                      py: { xs: 1, sm: 1.5 },
                      borderRadius: "8px",
                    }}
                  >
                    {overtimeId ? "Update Overtime" : "Submit Overtime"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size={isMobile ? "medium" : "large"}
                    onClick={handleBack}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      borderRadius: "8px",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Paper>
          </Container>
        </Box>
      </LocalizationProvider>
    </TASForm>
  );
}
