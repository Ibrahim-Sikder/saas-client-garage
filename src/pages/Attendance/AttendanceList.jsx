/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  useDeleteAttendanceMutation,
  useGetAllAttendancesQuery,
} from "../../redux/api/attendance";
import Loading from "../../components/Loading/Loading";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import dayjs from "dayjs";
import swal from "sweetalert";
import AllAttendanceList from "./AllAttendanceList";
const AttendanceList = () => {
  const [filterType, setFilterType] = useState("");
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalPresent: 0,
    totalAbsent: 0,
    totalLate: 0,
  });
  const tenantDomain = useTenantDomain();

  const currentPage = 1;
  const allAttendanceLimit = 500;

  const {
    data: allAttendance,
    isLoading: allAttendanceLoading,
    error: allAttendanceError,
    refetch,
  } = useGetAllAttendancesQuery({
    tenantDomain,
    limit: allAttendanceLimit,
    page: currentPage,
    searchTerm: filterType,
  });

  const [deleteAttendance, { isLoading }] = useDeleteAttendanceMutation();

  useEffect(() => {
    if (allAttendance?.data?.records) {
      const totalRecords = allAttendance.data.records.length;
      const totalPresent = allAttendance.data.records.reduce(
        (sum, record) => sum + record.presentEntries,
        0
      );
      const totalAbsent = allAttendance.data.records.reduce(
        (sum, record) => sum + record.absentEntries,
        0
      );
      const totalLate = allAttendance.data.records.reduce(
        (sum, record) => sum + record.lateEntries,
        0
      );

      setStats({
        totalRecords,
        totalPresent,
        totalAbsent,
        totalLate,
      });
    }
  }, [allAttendance, allAttendanceError]);

  if (allAttendanceLoading) {
    return <Loading />;
  }

  return (
    <div className="py-2 md:py-0 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-md">
      {/* <div className="mt-12">
        <TodayAttendance />
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between my-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-lg shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
              Attendance Dashboard
            </h3>
            <p className="text-slate-500 text-sm">
              Manage and track employee attendance records
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-medium text-slate-700">
            {stats.totalRecords} Records Found
          </span>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Present</p>
            <h4 className="text-3xl font-bold text-green-600">
              {stats.totalPresent}
            </h4>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Users className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Late</p>
            <h4 className="text-3xl font-bold text-amber-600">
              {stats.totalLate}
            </h4>
          </div>
          <div className="bg-amber-100 p-3 rounded-full">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Absent</p>
            <h4 className="text-3xl font-bold text-red-600">
              {stats.totalAbsent}
            </h4>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <UserX className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-indigo-500" />
          Filter Records
        </h4>

        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-full md:w-auto">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Select Date"
                  onChange={handleDateSearch}
                  className="bg-white"
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.5rem",
                        },
                      },
                    },
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
          <button
            onClick={handleAllAttendance}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            <RefreshCw className="h-4 w-4" />
            View All Records
          </button>
        </div>
      </div>


      {allAttendance?.data?.records?.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Present
                  </th>
                  <th className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Absent
                  </th>
                  <th className="bg-gradient-to-r from-indigo-400 to-indigo-300 text-white px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Late
                  </th>
                  <th className="bg-gradient-to-r from-indigo-300 to-indigo-200 text-indigo-900 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allAttendance.data.records.map((attendance, index) => (
                  <tr
                    key={attendance._id}
                    className={`hover:bg-indigo-50 transition-colors duration-150 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-slate-800">
                          {attendance.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white font-medium shadow-sm">
                        {attendance.presentEntries}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-medium shadow-sm">
                        {attendance.absentEntries}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-white font-medium shadow-sm">
                        {attendance.lateEntries}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/dashboard/update-attendance?date=${attendance.date}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300"
                          title="Edit Attendance"
                        >
                          <Edit size={18} />
                        </Link>
                        <Link
                          to={`/dashboard/view-attendance?date=${attendance.date}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 border border-indigo-200 hover:border-indigo-300"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteFilter(attendance.date)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
                          title="Delete Record"
                          disabled={isLoading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-indigo-100 p-6 rounded-full mb-4">
              <Calendar className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {allAttendanceError
                ? "Error Loading Attendance"
                : "No Attendance Records Found"}
            </h3>
            <p className="text-slate-500 mb-6 max-w-md text-center">
              {allAttendanceError
                ? "Failed to fetch attendance data. Please try again."
                : "Try selecting a different date or view all records to see your attendance data"}
            </p>
            <button
              onClick={
                allAttendanceError ? () => refetch() : handleAllAttendance
              }
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {allAttendanceError ? "Retry" : "View All Records"}
            </button>
          </div>
        </div>
      )} */}

      <AllAttendanceList />
    </div>
  );
};

export default AttendanceList;
