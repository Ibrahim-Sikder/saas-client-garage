/* eslint-disable no-unused-vars */
import { FaRegUser } from "react-icons/fa";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useGetAllELeaveRequestQuery } from "../../../redux/api/leaveRequestApi";
import { useTenantDomain } from "../../../hooks/useTenantDomain";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Loading from "../../../components/Loading/Loading";

const DashboardLeave = () => {
  const [currentPage] = useState(1);
  const [search] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const tenantDomain = useTenantDomain();

  const { data, isLoading } = useGetAllELeaveRequestQuery({
    tenantDomain,
    limit: 3,
    page: currentPage,
    searchTerm: search,
  });

  useEffect(() => {
    if (data?.data?.leaveRequests) {
      const pending = data?.data?.leaveRequests.filter(
        (request) => request.status === "Pending"
      );
      setPendingCount(pending.length);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  const leaveRequests = data?.data?.leaveRequests || [];

  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200";
      case "Pending":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200";
      case "Rejected":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-200";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("D MMM YYYY");
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Leave Requests
          </h3>
          {pendingCount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-red-200">
              {pendingCount} Pending
            </span>
          )}
        </div>

        <Link
          to="/dashboard/employee-leave"
          className="flex items-center rounded-full px-4 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:translate-x-1 transition-all duration-300 backdrop-blur-sm group"
        >
          <span className="text-sm font-medium text-blue-600">View All</span>
          <HiOutlineArrowNarrowRight size={15} className="ml-1 text-blue-600 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mb-6" />

      {/* Leave Requests */}
      {leaveRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50">
            <FaRegUser className="mx-auto text-gray-400 mb-3" size={32} />
            <p className="text-gray-500 font-medium">No leave requests found</p>
            <p className="text-sm text-gray-400 mt-1">All requests are processed</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {leaveRequests.slice(0, 2).map((request) => (
            <div
              key={request._id}
              className="bg-gradient-to-br from-blue-50/50 to-white rounded-xl p-4 border border-blue-200/30 hover:shadow-lg hover:border-blue-300/50 transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                  <FaRegUser className="text-white" size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg truncate">
                        {request.employee?.full_name || "Unknown Employee"}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 font-medium">
                        {request.leaveType}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${getStatusStyles(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {/* Date Information */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 text-center">
                      <p className="text-xs text-gray-500 font-medium mb-1">From</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatDate(request.fromDate)}
                      </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 text-center">
                      <p className="text-xs text-gray-500 font-medium mb-1">To</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatDate(request.toDate)}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-center shadow-lg shadow-blue-200">
                      <p className="text-xs text-white/90 font-medium mb-1">Days</p>
                      <p className="text-sm font-bold text-white">
                        {request.noOfDays}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  {request.reason && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-2">Reason</p>
                      <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                        {request.reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {leaveRequests.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <div className="text-xs text-gray-500 text-center font-medium">
            Showing {Math.min(leaveRequests.length, 2)} of {leaveRequests.length} requests
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLeave;