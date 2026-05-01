/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
"use client";

import { HiOutlineEye } from "react-icons/hi";
import { FaRegTrashAlt, FaUserEdit } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";
import {
  useDeleteAttendanceMutation,
  useGetTodayAttendanceQuery,
} from "../../redux/api/attendance";
import Loading from "../../components/Loading/Loading";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { RefreshCw } from "lucide-react";

const TodayAttendance = () => {
  const tenantDomain = useTenantDomain();
  const [retryCount, setRetryCount] = useState(0);

  const {
    data: todayAttendance,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetTodayAttendanceQuery(
    { tenantDomain },
    {
      skip: !tenantDomain,
      refetchOnMountOrArgChange: true,
    }
  );


  const [deleteAttendance, { isLoading: isDeleting }] =
    useDeleteAttendanceMutation();

  // Format today's date as DD-MM-YYYY
  const parsedDate = new Date();
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const handleDeleteAttendance = async () => {
    try {
      const dateToDelete = todayAttendance?.data?.date || formattedDate;
      const response = await deleteAttendance({
        tenantDomain,
        date: dateToDelete,
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        refetch();
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred while deleting the attendance"
      );
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Today's Attendance
        </h3>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Today's Attendance
        </h3>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-red-700 font-medium">
                Failed to load today's attendance data
              </p>
              <p className="text-red-600 text-sm mt-1">
                {error?.message || "Please try again later"}
              </p>
            </div>
            <button
              onClick={() => {
                refetch();
                setRetryCount(retryCount + 1);
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract data with safe defaults
  const attendanceData = todayAttendance?.data || {};
  const {
    presentEntries = 0,
    absentEntries = 0,
    lateEntries = 0,
    presentPercentage = 0,
    absentPercentage = 0,
    latePercentage = 0,
  } = attendanceData;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Today's Attendance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AttendanceCard
          title="Present"
          value={presentEntries}
          percentage={presentPercentage}
          color="#60BE6B"
        />
        <AttendanceCard
          title="Absent"
          value={absentEntries}
          percentage={absentPercentage}
          color="#F62D51"
        />
        <AttendanceCard
          title="Late"
          value={lateEntries}
          percentage={latePercentage}
          color="#FF851A"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Present
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Absent
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Late
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {attendanceData.date || formattedDate}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#E7F6EC] flex items-center justify-center">
                    <span className="text-[#60BF6B] font-medium">
                      {presentEntries}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFE9EC] flex items-center justify-center">
                    <span className="text-[#F62D51] font-medium">
                      {absentEntries}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFF6E3] flex items-center justify-center">
                    <span className="text-[#FF851A] font-medium">
                      {lateEntries}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center justify-center space-x-3">
                  <Link
                    to={`/dashboard/update-attendance?date=${attendanceData.date || formattedDate
                      }`}
                    className="text-[#60BF6B] hover:text-[#4a9854] transition-colors"
                  >
                    <FaUserEdit size={18} />
                  </Link>
                  <Link
                    to={`/dashboard/view-attendance?date=${attendanceData.date || formattedDate
                      }`}
                    className="text-[#42A1DA] hover:text-[#3481ad] transition-colors"
                  >
                    <HiOutlineEye size={18} />
                  </Link>
                  <button
                    onClick={handleDeleteAttendance}
                    className="text-[#F62D51] hover:text-[#d42544] transition-colors"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="loading loading-spinner text-red-500"></span>
                    ) : (
                      <FaRegTrashAlt size={18} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AttendanceCard = ({ title, value, percentage, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h4 className="text-lg font-semibold text-gray-700 mb-4">{title}</h4>
    <div className="flex items-center justify-between">
      <div style={{ width: 80, height: 80 }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: "#f3f4f6",
            textSize: "24px",
          })}
        />
      </div>
      <div className="text-4xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  </div>
);

export default TodayAttendance;
