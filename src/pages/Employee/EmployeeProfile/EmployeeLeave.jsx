/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { FaUsers } from "react-icons/fa";
import "../Employee.css";
import EmployeeLeaveTable from "./EmployeeLeaveTable";
import { useState, useMemo } from "react";
import {
  Users,
  UserMinus,
  ClipboardList,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useGetAllELeaveRequestQuery } from "../../../redux/api/leaveRequestApi";
import { format } from "date-fns";
import { useAppOptions } from "../../../hooks/useAppOptions";
import SummaryCards from "../../../components/SummaryCard";

const EmployeeLeave = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const { data, isLoading, isError } = useGetAllELeaveRequestQuery({
    tenantDomain,
    limit: 10,
    page: currentPage,
    searchTerm: search,
  });

  // Calculate dashboard metrics
  const dashboardMetrics = useMemo(() => {
    if (!data || !data?.data?.leaveRequests) return {};

    const today = format(new Date(), "yyyy-MM-dd");

    return data?.data?.leaveRequests.reduce(
      (metrics, request) => {
        metrics[request.status] = (metrics[request.status] || 0) + 1;

        const fromDate = request.fromDate.split("T")[0];
        const toDate = request.toDate.split("T")[0];

        if (
          request.status === "Approved" &&
          today >= fromDate &&
          today <= toDate
        ) {
          metrics.todayLeaves = (metrics.todayLeaves || 0) + 1;
        }

        return metrics;
      },
      {
        total: data?.data?.leaveRequests.length,
        todayLeaves: 0,
      }
    );
  }, [data]);

  const summaryCards = [
    {
      title: "Total Requests",
      value: dashboardMetrics.total || 0,
      color: "#10B981", // emerald
      bgColor: "#D1FAE5",
      icon: <Users />,
    },
    {
      title: "Pending Requests",
      value: dashboardMetrics.Pending || 0,
      color: "#F59E0B", // amber
      bgColor: "#FEF3C7",
      icon: <ClipboardList />,
    },
    {
      title: "Approved Requests",
      value: dashboardMetrics.Approved || 0,
      color: "#EF4444", // red/rose
      bgColor: "#FEE2E2",
      icon: <CheckCircle />,
    },
    {
      title: "Today's Leaves",
      value: dashboardMetrics.todayLeaves || 0,
      color: "#3B82F6", // blue
      bgColor: "#DBEAFE",
      icon: <Calendar />,
    },
    {
      title: "Rejected Requests",
      value: dashboardMetrics.Rejected || 0,
      color: "#8B5CF6", // violet
      bgColor: "#EDE9FE",
      icon: <UserMinus />,
    },
  ];

  return (
    <div className="w-full py-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-xl">
          <FaUsers className="text-2xl text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Leave
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Overview of employee leave requests and status
          </p>
        </div>
      </div>

      <SummaryCards cards={summaryCards} singleRow={true} />

      <div className="mt-8">
        <EmployeeLeaveTable
          performActionWithPermission={performActionWithPermission}
          currentPage={currentPage}
          data={data}
          setSearch={setSearch}
          setCurrentPage={setCurrentPage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EmployeeLeave;
