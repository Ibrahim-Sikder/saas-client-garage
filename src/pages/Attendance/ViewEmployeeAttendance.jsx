"use client";

/* eslint-disable no-unused-vars */
import { HiCheck, HiDocumentDownload, HiPrinter, HiX } from "react-icons/hi";
import { FiFilter, FiCalendar } from "react-icons/fi";
import "./Attendance.css";
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGetAllAttendancesQuery } from "../../redux/api/attendance";
import { useGetAllEmployeesQuery } from "../../redux/api/employee";
import { useReactToPrint } from "react-to-print";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTenantDomain } from "../../hooks/useTenantDomain";

const ViewEmployeeAttendance = () => {
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const printRef = useRef(null);
  const tenantDomain = useTenantDomain();

  const { data, isLoading } = useGetAllAttendancesQuery({
    tenantDomain,
    limit: 10,
    page: 1,
  });

  const { data: employeeData, isLoading: employeeLoading } =
    useGetAllEmployeesQuery({
      tenantDomain,
      limit: 10,
      page: 1,
    });

  const [error, setError] = useState("");

  const location = useLocation();
  const date = new URLSearchParams(location.search).get("date");

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Employee Attendance Report",
  });

  // Prepare data for CSV and PDF
  const prepareData = () => {
    if (!employeeData?.data?.employees) return [];

    return employeeData.data.employees.map((employee, i) => {
      const attendanceInfo = employee.attendance[0] || {};
      const salaryInfo = employee.salary[0] || {};

      return [
        i + 1,
        attendanceInfo.date || "",
        employee.full_name,
        employee.employeeId,
        employee.designation,
        attendanceInfo.present ? "Yes" : "No",
        !attendanceInfo.present ? "Yes" : "No",
        "10:00",
        attendanceInfo.in_time || "",
        attendanceInfo.out_time || "",
        salaryInfo.overtime_amount || "",
        attendanceInfo.late_status ? "Yes" : "No",
      ];
    });
  };

  // Prepare CSV data for download
  const prepareCSVData = () => {
    const data = prepareData();
    return [
      [
        "SL No",
        "Date",
        "Name",
        "Employee ID",
        "Designation",
        "Present",
        "Absence",
        "Office Time",
        "In Time",
        "Out Time",
        "Overtime",
        "Late",
      ],
      ...data,
    ];
  };

  // Handle PDF download
  const handlePDFDownload = () => {
    const doc = new jsPDF();
    const data = prepareData();

    doc.setFontSize(18);
    doc.text("Employee Attendance Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.autoTable({
      head: [
        [
          "SL No",
          "Date",
          "Name",
          "Employee ID",
          "Designation",
          "Present",
          "Absence",
          "Office Time",
          "In Time",
          "Out Time",
          "Overtime",
          "Late",
        ],
      ],
      body: data,
      startY: 35,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 161, 218], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save("employee-attendance.pdf");
  };

  if (isLoading || employeeLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg font-medium text-gray-700">
          Loading attendance data...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Employee Attendance Report
          </h3>
          <div className="text-sm text-gray-500 flex items-center">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-blue-600">All Employee Attendance</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center hover:bg-gray-200 transition-colors"
          >
            <FiFilter className="mr-2" />
            Filter
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md flex items-center hover:bg-indigo-200 transition-colors"
          >
            <HiPrinter className="mr-2" />
            Print
          </button>

          <CSVLink
            data={prepareCSVData()}
            filename={"employee-attendance.csv"}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-md flex items-center hover:bg-green-200 transition-colors"
          >
            <HiDocumentDownload className="mr-2" />
            Download CSV
          </CSVLink>

          <button
            onClick={handlePDFDownload}
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md flex items-center hover:bg-yellow-200 transition-colors"
          >
            <HiDocumentDownload className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full"
                />
                <FiCalendar className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Apply Filter
            </button>
            <button
              onClick={() => setFilterDate("")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto" ref={printRef}>
        <div className="print-header text-center mb-4 hidden print:block">
          <h2 className="text-xl font-bold">Employee Attendance Report</h2>
          <p className="text-sm text-gray-600">
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>

        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                SL No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Employee ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Designation
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Present
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Absence
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Office Time
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                In Time
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Out Time
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Overtime
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border">
                Late
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employeeData?.data?.employees?.map((employee, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 text-sm text-gray-900 border">
                  {i + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border">
                  {employee.attendance.map((attend, index) => (
                    <div key={index} className="text-sm">
                      {attend.date}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border">
                  {employee.full_name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border">
                  {employee.employeeId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 border">
                  {employee.designation}
                </td>
                <td className="px-4 py-3 text-sm text-center border">
                  {employee.attendance.map((attend, index) => (
                    <div key={index} className="flex justify-center">
                      {attend.present === true ? (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <HiCheck className="text-green-600" size={20} />
                        </div>
                      ) : (
                        <div className="w-8 h-8"></div>
                      )}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm text-center border">
                  {employee.attendance.map((attend, index) => (
                    <div key={index} className="flex justify-center">
                      {attend.present === false ? (
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                          <HiCheck className="text-red-600" size={20} />
                        </div>
                      ) : (
                        <div className="w-8 h-8"></div>
                      )}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">
                  10.00
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">
                  {employee.attendance.map((attend, index) => (
                    <div key={index} className="text-sm">
                      {attend.in_time || "-"}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">
                  {employee.attendance.map((attend, index) => (
                    <div key={index} className="text-sm">
                      {attend.out_time || "-"}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-900 border">
                  {employee.salary.map((slr, index) => (
                    <div key={index} className="text-sm">
                      {slr.overtime_amount || "-"}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 text-sm text-center border">
                  {employee.attendance.map((attend, index) => (
                    <div key={index} className="flex justify-center">
                      {attend.late_status === true ? (
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <HiCheck className="text-amber-600" size={20} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <HiX className="text-green-600" size={20} />
                        </div>
                      )}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewEmployeeAttendance;
