/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

  Grid,
  Chip,
  Alert
} from "@mui/material"
import { motion } from "framer-motion"
import { Calendar, User, AlertCircle, Filter, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Loading from "../../../components/Loading/Loading"
import { months } from "../../../constant"

const MonthlyTable = ({ attendanceData, employeeName, isLoading }) => {
  const [filterType, setFilterType] = useState("monthly")
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState("")
  const [filteredData, setFilteredData] = useState([])

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Process and filter data based on selected filters
  useEffect(() => {
    if (!attendanceData || attendanceData.length === 0) {
      setFilteredData([])
      return
    }

    let result = [...attendanceData]

    if (filterType === "date" && selectedDate) {
      result = result.filter(item => item.date === selectedDate)
    } else if (filterType === "monthly") {
      result = result.filter(item => {
        const [day, month, year] = item.date.split("-")
        return parseInt(month) === selectedMonth && parseInt(year) === selectedYear
      })
    } else if (filterType === "yearly") {
      result = result.filter(item => {
        const [day, month, year] = item.date.split("-")
        return parseInt(year) === selectedYear
      })
    }

    setFilteredData(result)
  }, [attendanceData, filterType, selectedMonth, selectedYear, selectedDate])

  const processAttendanceData = () => {
    const processedData = {}
    filteredData.forEach((record) => {
      const [day, month, year] = record.date.split("-")
      const key = `${year}-${month}-${day}`
      if (record.absent) {
        processedData[key] = "A"
      } else if (record.late_status) {
        processedData[key] = "L"
      } else if (record.present) {
        processedData[key] = "P"
      }
    })
    return processedData
  }

  const attendanceMap = processAttendanceData()

  const getAttendanceStatus = (year, month, day) => {
    const key = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    return attendanceMap[key] || "-"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "P":
        return theme.palette.success.main
      case "A":
        return theme.palette.error.main
      case "L":
        return theme.palette.warning.main
      default:
        return theme.palette.grey[200]
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "P":
        return "Present"
      case "A":
        return "Absent"
      case "L":
        return "Late"
      default:
        return "No data"
    }
  }

  // Generate year options (from 2020 to current year + 1)
  const currentYear = new Date().getFullYear()
  const yearOptions = []
  for (let year = 2020; year <= currentYear + 1; year++) {
    yearOptions.push(year)
  }

  // Generate date options for date filter
  const dateOptions = [...new Set(attendanceData.map(item => item.date))].sort((a, b) => {
    const [dayA, monthA, yearA] = a.split("-")
    const [dayB, monthB, yearB] = b.split("-")
    return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`)
  })



  if (isLoading) {
    return <Loading />
  }

  return (
    <Paper
      elevation={3}
      sx={{ p: 4, borderRadius: 2, background: "linear-gradient(145deg, #f3f4f6 0%, #ffffff 100%)" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: theme.palette.primary.main, display: "flex", alignItems: "center", gap: 2 }}
        >
          <Calendar size={32} />
          Attendance Sheet
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: theme.palette.primary.light,
            p: 2,
            borderRadius: 2,
          }}
        >
          <User size={24} sx={{ color: 'white' }} />
          <Typography variant="h6" sx={{ color: 'white' }}>
            {employeeName}
          </Typography>
        </Box>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ mb: 4, p: 3, bgcolor: theme.palette.grey[50], borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Filter size={20} /> Filter Attendance
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Filter Type</InputLabel>
              <Select
                value={filterType}
                label="Filter Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="date">By Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {filterType === "monthly" && (
            <>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="Month"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    label="Year"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {yearOptions.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          {filterType === "yearly" && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  label="Year"
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {yearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {filterType === "date" && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Date</InputLabel>
                <Select
                  value={selectedDate}
                  label="Select Date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {dateOptions.map((date) => (
                    <MenuItem key={date} value={date}>
                      {date}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Chip
          label={`${filteredData.length} records found`}
          color="primary"
          variant="outlined"
          sx={{ mt: 2 }}
        />
      </Box>

      {filteredData.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No attendance records found for the selected filter.
        </Alert>
      ) : (
        <Box sx={{ overflowX: "auto", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Table size={isMobile ? "small" : "medium"} sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: 'white' }} >
                    Day
                  </TableCell>
                  {months.map((month) => (
                    <TableCell
                      key={month}
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: 'white',
                        ...(month === months[selectedMonth - 1] && filterType === 'monthly' && {
                          bgcolor: theme.palette.secondary.main,
                        }),
                      }}
                    >
                      {month}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <TableRow
                    key={day}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: day * 0.03 }}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: theme.palette.action.hover },
                      "&:hover": { bgcolor: theme.palette.action.selected },
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: "bold", color: theme.palette.text.secondary }}>
                      {day}
                    </TableCell>
                    {months.map((_, monthIndex) => {
                      const status = getAttendanceStatus(selectedYear, monthIndex + 1, day)
                      return (
                        <TableCell key={monthIndex} align="center" sx={{ p: 1 }}>
                          <Tooltip
                            title={`${day}-${monthIndex + 1}-${selectedYear}: ${getStatusText(status)}`}
                            arrow
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                          >
                            <Box
                              component={motion.div}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                bgcolor: getStatusColor(status),
                                color: status === "-" ? theme.palette.text.secondary : theme.palette.common.white,
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "all 0.2s ease-in-out",
                              }}
                            >
                              {status}
                            </Box>
                          </Tooltip>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
        {["P", "L", "A", "-"].map((status) => (
          <Box key={status} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: getStatusColor(status),
              }}
            />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {getStatusText(status)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          color: theme.palette.text.secondary,
        }}
      >
        <AlertCircle size={16} />
        <Typography variant="caption">Attendance data shown for the year {selectedYear}</Typography>
      </Box>
    </Paper>
  )
}

export default MonthlyTable