/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { UserCheck, Calendar } from "lucide-react";

const HeaderSection = ({ formattedDate }) => (
  <div className="flex flex-col md:flex-row items-center content-center md:justify-between mb-8 md:px-6">
    <div className="flex flex-col items-center gap-3">
      <div className="bg-indigo-600 p-2 md:p-3 rounded-lg shadow-lg">
        <UserCheck className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent">
          Attendance Management
        </h3>
        <div className="flex items-center text-slate-500 text-sm">
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span className="text-indigo-600">Attendance</span>
        </div>
      </div>
    </div>

    <div className="mt-4 md:mt-0">
      <div className="text-sm text-slate-500 mb-1">Today's Date</div>
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
        <Calendar className="h-4 w-4 text-indigo-500" />
        <span className="font-medium text-slate-700">{formattedDate}</span>
      </div>
    </div>
  </div>
);

export default HeaderSection;