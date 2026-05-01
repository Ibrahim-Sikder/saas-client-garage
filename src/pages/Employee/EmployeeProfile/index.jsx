/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import EmployeeAccount from "./EmployeeAccount";
import SingleEmployeeLeaveList from "./SingleEmployeeLeaveList";
import EmployeeSalary from "./EmployeeSalary";
import EmployeeAttendance from "./EmployeeAttendance";
import "../Employee.css";
import EmployeeProfileHeader from "./EmployeeProfileHeader";
import EmployeeHeaderStyle from "./EmployeeHeaderStyle";
import { useGetSingleEmployeeQuery } from "../../../redux/api/employee";
import Loading from "../../../components/Loading/Loading";
import { tabsStyles, tabStyles } from "../../../utils/customStyle";
import { StyledPaper } from "../../../utils";
import { useAppOptions } from "../../../hooks/useAppOptions";
import { getMonthName } from "../../../utils/getMonth";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const EmployeeProfile = () => {
  const [value, setValue] = useState(0);
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const { data, isLoading, error } = useGetSingleEmployeeQuery({
    tenantDomain,
    id,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    toast.error(error?.status);
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const formattedCurrentMonth =
    currentMonth < 10 ? `0${currentMonth}` : currentMonth;
  const monthName = getMonthName(currentMonth);

  const totalOvertime = data?.data?.attendance
    .filter((record) => {
      const [, month, year] = record.date.split("-");
      return (
        month === String(formattedCurrentMonth) && year === String(currentYear)
      );
    })
    .reduce((total, record) => total + record.overtime, 0);

  const totalSalary = data?.data?.salary?.reduce((total, record) => {
    return total + (record.total_payment || 0);
  }, 0);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const attendanceCount =
    data?.data?.attendance.filter((record) => {
      const [, month, year] = record.date.split("-");
      return (
        month === String(formattedCurrentMonth) && year === String(currentYear)
      );
    }).length || 0;

  const attendancePercentage = Math.round(
    (attendanceCount / daysInMonth) * 100,
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        minHeight: "50vh",
      }}
    >
      <StyledPaper
        elevation={24}
        sx={{
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          overflow: "hidden",
        }}
      >
        <EmployeeHeaderStyle />

        <EmployeeProfileHeader
          employee={data?.data}
          totalOvertime={totalOvertime}
          totalSalary={totalSalary}
          attendancePercentage={attendancePercentage}
          attendanceCount={attendanceCount}
          daysInMonth={daysInMonth}
          monthName={monthName}
          currentYear={currentYear}
        />

        <div className="text-black mt-14">
          <Box
            sx={{
              background: "rgba(102, 126, 234, 0.05)",
              borderRadius: "20px",
              p: 1,
              mb: 3,
            }}
          >
            <Tabs
              sx={{
                ...tabsStyles,
                "& .MuiTab-root": {
                  ...tabStyles,
                  borderRadius: "15px",
                  margin: "0 4px",
                  transition: "all 0.3s ease",
                  "&.Mui-selected": {
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    color: "white",
                    fontWeight: "bold",
                  },
                },
              }}
              value={value}
              onChange={handleChange}
              aria-label="employee tabs"
            >
              <Tab label="Account" />
              <Tab label="Attendance" />
              <Tab label="Leave" />
              <Tab label="Salary" />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <EmployeeAccount id={id} accountInfo={data?.data} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <EmployeeAttendance
              id={id}
              attendanceData={data?.data?.attendance}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <SingleEmployeeLeaveList
              tenantDomain={tenantDomain}
              id={id}
              performActionWithPermission={performActionWithPermission}
            />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <EmployeeSalary tenantDomain={tenantDomain} id={id} />
          </TabPanel>

          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              p: 3,
              background: "rgba(102, 126, 234, 0.05)",
              borderRadius: "15px",
            }}
          >
            <Typography
              sx={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              © Copyright 2024 | Garage Master | All Rights Reserved
            </Typography>
          </Box>
        </div>
      </StyledPaper>
    </Box>
  );
};

export default EmployeeProfile;
