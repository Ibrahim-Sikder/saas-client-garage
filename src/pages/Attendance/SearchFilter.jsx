/* eslint-disable react/prop-types */
import { Search } from "lucide-react";

const SearchFilter = ({ searchTerm, setSearchTerm, officeTime }) => (
  <div className="md:px-6 mb-6">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name, ID or designation..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Office Time:</span>
          <span className="font-medium text-indigo-600">{officeTime || "10:00 AM"}</span>
        </div>
      </div>
    </div>
  </div>
);

export default SearchFilter;