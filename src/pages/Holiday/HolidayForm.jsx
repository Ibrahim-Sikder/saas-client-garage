/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client"

import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
  IconButton,
} from "@mui/material"
import { Calendar, Users } from "lucide-react"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { useNavigate } from "react-router-dom"
import { ArrowBack } from "@mui/icons-material"
import { backBtnStyle } from "../../utils/customStyle"
import { HiOutlineUserGroup } from "react-icons/hi"
import {
  useCreateHolidayMutation,
  useGetSingleHolidayQuery,
  useUpdateHolidayMutation,
} from "../../redux/api/holidayApi"
import TASForm from "../../components/form/Form"
import TASInput from "../../components/form/Input"
import TASTextarea from "../../components/form/Textarea"
import TASSelect from "../../components/form/Select"
import { applicableEmployeeOption, holidayOption } from "../../constant"
import TASAutocomplete from "../../components/form/Autocomplete"
import TASDateCalendar from "../../components/form/datecalender"
import HolidayFileUpload from "./Fileupload"
import TASDatepicker from "../../components/form/Datepicker"
import { toast } from "react-toastify"

export default function HolidayForm({ holidayId }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [createHoliday] = useCreateHolidayMutation()
  const [updateHoliday] = useUpdateHolidayMutation()
  const { data: singleHoliday, isLoading, error } = useGetSingleHolidayQuery(holidayId)

  const navigate = useNavigate()

  const handleFormSubmit = async (data, reset) => {
    const toastId = toast.loading("Creating Holiday...")
    const attachments = Array.isArray(data.attachments) ? data.attachments[0] : data.attachments

    const submitData = {
      ...data,
      attachments,
      totalDays: Number(data.totalDays),
    }
    try {
      const res = await createHoliday(submitData).unwrap()
      toast.update(toastId, {
        render: res.message || "Holiday created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })

      reset()
      navigate("/dashboard/holiday")
    } catch (error) {
      const errorMessage = error.message || error?.data?.message || "Something went wrong!"

      toast.update(toastId, {
        render: `Error creating holiday: ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
    } finally {
      toast.dismiss(toastId)
    }
  }

  const onSubmit = async (data, reset) => {
    const toastId = toast.loading("Creating Holiday...")
    const attachments = Array.isArray(data.attachments) ? data.attachments[0] : data.attachments

    const submitData = {
      ...data,
      attachments,
      totalDays: Number(data.totalDays),
    }
    try {
      const res = await updateHoliday({ holidayId, ...submitData }).unwrap()

      toast.update(toastId, {
        render: res.message || "Holiday update successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      })

      reset()
      navigate("/dashboard/holiday")
    } catch (error) {
      const errorMessage = error.message || error?.data?.message || "Something went wrong!"

      toast.update(toastId, {
        render: `Error updating holiday: ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
    } finally {
      toast.dismiss(toastId)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    )
  }

  const defaultValues = {
    holidayName: singleHoliday?.data?.holidayName || "",
    totalDays: singleHoliday?.data?.totalDays || "",
    toDate: singleHoliday?.data?.toDate || "",
    fromDate: singleHoliday?.data?.fromDate || "",
    description: singleHoliday?.data?.description || "",
    status: singleHoliday?.data?.status || "",
    createdDate: singleHoliday?.data?.createdDate || "",
    applicableEmployees: singleHoliday?.data?.applicableEmployees || [],
  }

  const handleBack = () => {
    navigate(-1)
  }

  // Mobile view for the header
  const MobileHeader = () => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <IconButton onClick={handleBack} sx={{ mr: 1, color: theme.palette.primary.main }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 600, flex: 1, textAlign: "center" }}>
          {holidayId ? "Update Holiday" : "Create Holiday"}
        </Typography>
        <Box sx={{ width: 40, display: "flex", justifyContent: "center" }}>
          <HiOutlineUserGroup size={24} className="invoicIcon" />
        </Box>
      </Box>
      <Divider />
    </Box>
  )

  // Desktop header
  const DesktopHeader = () => (
    <Paper sx={{ mb: 3 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
            <Button onClick={handleBack} startIcon={<ArrowBack />} sx={backBtnStyle}>
              Back
            </Button>
            <HiOutlineUserGroup className="invoicIcon" />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              {holidayId ? "Update Holiday" : "Create Holiday"}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Paper>
  )

  return (
    <TASForm onSubmit={holidayId ? onSubmit : handleFormSubmit} defaultValues={holidayId && defaultValues}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            bgcolor: "#f8f9fa",
            minHeight: "100vh",
            py: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2, md: 4 },
          }}
        >
          <Container maxWidth="xxl" sx={{ px: { xs: 0, sm: 1, md: 2 } }}>
            {isMobile ? <MobileHeader /> : <DesktopHeader />}

            <Grid container spacing={{ xs: 2, md: 3 }} direction={isSmallScreen ? "column-reverse" : "row"}>
              {/* Main form section */}
              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: { xs: 1, sm: 2 },
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: { xs: 2, md: 3 }, fontWeight: 600 }}>
                    {holidayId ? "Update Holiday Details" : "Create New Holiday"}
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 3 } }}>
                    <TASInput
                      fullWidth
                      label="Holiday Name"
                      name="holidayName"
                      required
                      variant="outlined"
                      size={isMobile ? "small" : "medium"}
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TASDatepicker
                          name="fromDate"
                          label="From Date"
                          required={true}
                          fullWidth={true}
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TASDatepicker
                          name="toDate"
                          label="To Date"
                          required={true}
                          fullWidth={true}
                          size={isMobile ? "small" : "medium"}
                        />
                      </Grid>
                    </Grid>

                    <TASInput fullWidth label="Total Days" name="totalDays" size={isMobile ? "small" : "medium"} />

                    <TASSelect
                      items={holidayOption}
                      size={isMobile ? "small" : "medium"}
                      fullWidth
                      name="status"
                      label="Status"
                    />

                    <TASTextarea
                      fullWidth
                      label="Description"
                      required
                      multiline
                      name="description"
                      rows={isMobile ? 3 : 5}
                      size={isMobile ? "small" : "medium"}
                    />

                    <TASAutocomplete
                      options={applicableEmployeeOption}
                      size={isMobile ? "small" : "medium"}
                      fullWidth
                      name="applicableEmployees"
                      label="Applicable Employee"
                    />

                    <HolidayFileUpload
                      name="attachments"
                      accept="image/*,.pdf,.doc,.docx,jpeg,png,jpg"
                      label="Upload Attachments"
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        mt: { xs: 1, md: 2 },
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth={isMobile}
                        sx={{
                          color: "white",
                          "&:hover": { bgcolor: "#2A2A2A" },
                          textTransform: "none",
                          px: { xs: 2, md: 4 },
                          py: { xs: 1, md: 1.5 },
                          order: { xs: 1, sm: 0 },
                        }}
                      >
                        {holidayId ? "Update Holiday" : "Create Holiday"}
                      </Button>
                      <Button
                        variant="outlined"
                        fullWidth={isMobile}
                        sx={{
                          borderColor: "#0A0A0A",
                          color: "#0A0A0A",
                          "&:hover": {
                            borderColor: "#2A2A2A",
                            bgcolor: "transparent",
                          },
                          textTransform: "none",
                          px: { xs: 2, md: 4 },
                          py: { xs: 1, md: 1.5 },
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Sidebar section */}
              <Grid item xs={12} md={4}>
                <Stack spacing={{ xs: 2, md: 3 }} direction={isTablet ? "row" : "column"}>
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: { xs: 1, sm: 2 },
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      flex: isTablet ? 1 : "auto",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: { xs: 1, md: 2 },
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: { xs: "1rem", md: "1.25rem" },
                      }}
                    >
                      <Calendar size={isMobile ? 16 : 20} />
                      Select Dates
                    </Typography>

                    <Box sx={{ width: "100%", height: { xs: "auto", sm: "300px" } }}>
                      <TASDateCalendar label="date" name="createdDate" />
                    </Box>
                  </Paper>

                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: { xs: 1, sm: 2 },
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      flex: isTablet ? 1 : "auto",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        mb: { xs: 1, md: 2 },
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: { xs: "1rem", md: "1.25rem" },
                      }}
                    >
                      <Users size={isMobile ? 16 : 20} />
                      Employee Summary
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={6} sm={isTablet ? 12 : 6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Employees:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          150
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={isTablet ? 12 : 6}>
                        <Typography variant="body2" color="text.secondary">
                          Full-time:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          100
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={isTablet ? 12 : 6}>
                        <Typography variant="body2" color="text.secondary">
                          Part-time:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          30
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={isTablet ? 12 : 6}>
                        <Typography variant="body2" color="text.secondary">
                          Contract:
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          20
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </LocalizationProvider>
    </TASForm>
  )
}
