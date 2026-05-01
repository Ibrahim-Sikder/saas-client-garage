/* eslint-disable react/prop-types */
import { Users, CheckCircle, UserX, Clock } from "lucide-react";

const StatsCards = ({ totalEmployees, presentCount, absentCount, lateCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 md:px-6">
    <StatCard 
      label="Total Employees" 
      value={totalEmployees} 
      icon={Users} 
      color="indigo" 
    />
    <StatCard 
      label="Present" 
      value={presentCount} 
      icon={CheckCircle} 
      color="green" 
    />
    <StatCard 
      label="Absent" 
      value={absentCount} 
      icon={UserX} 
      color="red" 
    />
    <StatCard 
      label="Late" 
      value={lateCount} 
      icon={Clock} 
      color="amber" 
    />
  </div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${color}-500 flex items-center justify-between`}>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h4 className={`text-3xl font-bold text-${color}-600`}>{value}</h4>
    </div>
    <div className={`bg-${color}-100 p-3 rounded-full`}>
      <Icon className={`h-6 w-6 text-${color}-600`} />
    </div>
  </div>
);

export default StatsCards;