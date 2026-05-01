/* eslint-disable react/prop-types */
import { styled } from "@mui/material";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";
import { HiOutlineArrowNarrowRight, HiOutlineEye } from "react-icons/hi";
import { useGetAllJobCardsQuery } from "../../../redux/api/jobCard";
import Loading from "../../../components/Loading/Loading";

const BorderLinearProgress = styled(LinearProgress)(({ theme, color }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      color || (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
  },
}));

const RecentProject = ({ tenantDomain }) => {
  const { data, error, isLoading } = useGetAllJobCardsQuery({
    tenantDomain,
    limit: 5,
    page: 1,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 md:p-6 pb-3">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Recent Projects
        </h3>
        <Link to="/dashboard/quotation-list">
          <button className="flex items-center rounded-full px-3 lg:px-4 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:translate-x-1 transition-all duration-300 backdrop-blur-sm">
            <span className="text-sm font-medium text-blue-600">See More</span>
            <HiOutlineArrowNarrowRight size={15} className="ml-1 text-blue-600 transition-transform duration-300" />
          </button>
        </Link>
      </div>
      
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mx-6" />
      
      {/* Table Container */}
      <div className="overflow-x-auto p-2">
        <table className="max-w-full">
          <thead>
            <tr className="bg-blue-50/50 backdrop-blur-sm">
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Project Id
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Job No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.jobCards?.slice(0, 5).map((job, i) => (
              <tr 
                key={i} 
                className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition-all duration-300 hover:scale-[1.01]"
              >
                <td className="px-4 py-3 text-base font-semibold text-gray-800 font-mono text-start">
                  {job.Id}
                </td>
                <td className="px-0 py-3">
                  <div>
                    <h4 className="text-start">
                      {job.job_no}
                    </h4>
                    <div className="flex text-sm">
                      <small className="block mr-3 text-gray-500">
                        2 Open tasks,{" "}
                      </small>
                      <small className="text-green-500 ">
                        10 tasks completed
                      </small>
                    </div>
                  </div>
                </td>
                <td className="text-start px-4 py-3 text-base font-medium text-gray-600">
                  {job.date}
                </td>
                <td className="px-4 py-3">
                  <Stack spacing={1} sx={{ flexGrow: 1 }}>
                    <BorderLinearProgress
                      stroke="#60BE6B"
                      variant="determinate"
                      value={job.progress || 50}
                    />
                  </Stack>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center group cursor-pointer">
                    <HiOutlineEye 
                      size={20} 
                      className="text-gray-500 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-blue-50/20">
        <div className="text-xs text-gray-500 text-center font-medium">
          Showing {data?.data?.jobCards?.slice(0, 5).length} of {data?.data?.jobCards?.length} projects
        </div>
      </div>
    </div>
  );
};

export default RecentProject;