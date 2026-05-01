/* eslint-disable react/prop-types */
import { Save } from "lucide-react";
import { CircularProgress } from "@mui/material";

const SubmitButton = ({ isLoading, onSubmit }) => (
  <div className="flex justify-end p-6">
    <button
      disabled={isLoading}
      onClick={onSubmit}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      type="submit"
    >
      {isLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        <Save className="h-5 w-5" />
      )}
      Submit Attendance
    </button>
  </div>
);

export default SubmitButton;
