/* eslint-disable react/prop-types */
import { CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { FaUserClock, FaUserCheck, FaUserTimes, FaUmbrellaBeach, FaRunning } from "react-icons/fa"

const EmployeeAccount = ({ accountInfo }) => {
  // Helper function to calculate percentages
  const calculatePercentage = (count, total) => {
    if (!total || total === 0) return 0
    const percentage = (count / total) * 100
    return Number.parseFloat(percentage.toFixed(1))
  }

  const myAttendance = accountInfo?.attendance || []
  const totalDays = myAttendance.length
  const absentEntries = myAttendance.filter((att) => !att.in_time || !att.out_time).length

  const lateEntries = myAttendance.filter((att) => att.late_status === true).length

  // In-time entries: has in_time and not late
  const inTimeEntries = myAttendance.filter((att) => att.in_time && !att.late_status).length

  // Out-time entries: has out_time
  const outTimeEntries = myAttendance.filter((att) => att.out_time).length

  const vacationEntries = accountInfo?.leave?.length || 0

  // Calculate percentages
  const absentPercentage = calculatePercentage(absentEntries, totalDays)
  const latePercentage = calculatePercentage(lateEntries, totalDays)
  const inTimePercentage = calculatePercentage(inTimeEntries, totalDays)
  const outTimePercentage = calculatePercentage(outTimeEntries, totalDays)
  const vacationPercentage = calculatePercentage(vacationEntries, totalDays)

  const employee = {
    name: accountInfo?.full_name || "N/A",
    email: accountInfo?.email || "N/A",
    phone: accountInfo?.full_phone_number || "N/A",
    dob: accountInfo?.date_of_birth || "N/A",
    nid: accountInfo?.nid_number || "N/A",
    bloodGroup: accountInfo?.blood_group || "N/A",
    nationality: accountInfo?.nationality || "N/A",
    religion: accountInfo?.religion || "N/A",
    gender: accountInfo?.gender || "N/A",
    address: accountInfo?.present_address || "N/A",
    permanentAddress: accountInfo?.permanent_address || "N/A",
    guardianName: accountInfo?.guardian_name || "N/A",
    relationship: accountInfo?.relationship || "N/A",
    guardianContact: accountInfo?.guardian_full_contact || "N/A",
    fatherName: accountInfo?.father_name || "N/A",
    motherName: accountInfo?.mother_name || "N/A",
    designation: accountInfo?.designation || "N/A",
    joinDate: accountInfo?.join_date || "N/A",
    image: accountInfo?.image || "https://via.placeholder.com/150",
    status: accountInfo?.status || "Active",
  }

  const attendanceCards = [
    {
      id: "in-time",
      title: "In Time",
      value: inTimeEntries,
      percentage: inTimePercentage,
      color: "#10B981",
      icon: <FaUserClock className="text-xl" />,
      description: "On-time arrivals",
    },
    {
      id: "out-time",
      title: "Out Time",
      value: outTimeEntries,
      percentage: outTimePercentage,
      color: "#3B82F6",
      icon: <FaUserCheck className="text-xl" />,
      description: "Completed workdays",
    },
    {
      id: "absent",
      title: "Absent",
      value: absentEntries,
      percentage: absentPercentage,
      color: "#EF4444",
      icon: <FaUserTimes className="text-xl" />,
      description: "Days not present",
    },
    {
      id: "vacation",
      title: "Vacation",
      value: vacationEntries,
      percentage: vacationPercentage,
      color: "#F59E0B",
      icon: <FaUmbrellaBeach className="text-xl" />,
      description: "Leave days taken",
    },
    {
      id: "late",
      title: "Late",
      value: lateEntries,
      percentage: latePercentage,
      color: "#F97316",
      icon: <FaRunning className="text-xl" />,
      description: "Late arrivals",
    },
  ]

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return isNaN(date)
      ? dateString
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
  }

  return (
    <div className="customerProfileWrap p-4 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {attendanceCards.map((card) => (
          <div
            key={card.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div
                    className="p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${card.color}15`, border: `2px solid ${card.color}30` }}
                  >
                    <span style={{ color: card.color }}>{card.icon}</span>
                  </div>
                </div>

                <div style={{ width: 70, height: 70 }}>
                  <CircularProgressbar
                    value={card.percentage}
                    text={`${card.percentage}%`}
                    styles={{
                      path: {
                        stroke: card.color,
                        strokeWidth: 8,
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                      },
                      text: {
                        fill: "#374151",
                        fontSize: "20px",
                        fontWeight: "bold",
                      },
                      trail: {
                        stroke: "#F3F4F6",
                        strokeWidth: 8,
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-700 text-lg mb-1">{card.title}</h3>
                <p className="text-3xl font-bold mb-2" style={{ color: card.color }}>
                  {card.value} <span className="text-sm font-normal text-gray-500">days</span>
                </p>
                <p className="text-sm text-gray-500">{card.description}</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
              <p className="text-xs text-gray-600 text-center font-medium">
                {totalDays > 0 ? `Based on ${totalDays} tracked days` : "No attendance data"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">👤</span>
              Personal Information
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Name</div>
                <div className="w-2/3 font-bold text-gray-800">{employee.name}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Email</div>
                <div className="w-2/3 text-blue-600">{employee.email}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Phone</div>
                <div className="w-2/3 font-medium">{employee.phone}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Birth Date</div>
                <div className="w-2/3 font-medium">{formatDate(employee.dob)}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Gender</div>
                <div className="w-2/3 font-medium">{employee.gender}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Blood Group</div>
                <div className="w-2/3 font-bold text-red-600">{employee.bloodGroup}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 font-semibold text-gray-500">NID</div>
                <div className="w-2/3 font-medium">{employee.nid}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Family & Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">👨‍👩‍👧‍👦</span>
              Family & Emergency
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Father</div>
                <div className="w-2/3 font-bold text-gray-800">{employee.fatherName}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Mother</div>
                <div className="w-2/3 font-bold text-gray-800">{employee.motherName}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Guardian</div>
                <div className="w-2/3 font-bold text-gray-800">{employee.guardianName}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Relationship</div>
                <div className="w-2/3 font-medium">{employee.relationship}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Contact</div>
                <div className="w-2/3 font-medium text-green-600">{employee.guardianContact || "Not provided"}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 font-semibold text-gray-500">Religion</div>
                <div className="w-2/3 font-medium">{employee.religion}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Address & Location */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5">
            <h3 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">📍</span>
              Address & Location
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Nationality</div>
                <div className="w-2/3 font-bold text-gray-800">{employee.nationality}</div>
              </div>
              <div className="flex border-b border-gray-100 pb-3">
                <div className="w-1/3 font-semibold text-gray-500">Present</div>
                <div className="w-2/3 font-medium">{employee.address}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 font-semibold text-gray-500">Permanent</div>
                <div className="w-2/3 font-medium">{employee.permanentAddress}</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center">
                <span className="mr-2">💼</span>
                Work Information
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-semibold text-gray-600">Designation:</span>
                  <span className="ml-2 font-bold text-blue-600">{employee.designation}</span>
                </p>
                <p className="text-sm">
                  <span className="font-semibold text-gray-600">Joined:</span>
                  <span className="ml-2 font-medium">{formatDate(employee.joinDate)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeAccount
