/* eslint-disable react/prop-types */
import { FaCarSide, FaFileInvoice } from "react-icons/fa";
import {
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import ExpanseIncomeChart from "../../../components/Chart/ExpanseIncomeChart";
import Loading from "../../../components/Loading/Loading";
import { useGetAllMetaQuery } from "../../../redux/api/meta.api";

const ProjectOverView = ({ tenantDomain }) => {
  const { data: allMetaData, isLoading } = useGetAllMetaQuery({ tenantDomain });
  if (isLoading) return <Loading />;

  const userData = [
    {
      id: 1,
      name: "Customers",
      user: allMetaData?.data?.totalCustomers,
      icon: (
        <HiOutlineUserGroup
          className="text-white transition-all duration-300"
          size={50}
        />
      ),
      path: "/dashboard/customer-list",
      color: "bg-gradient-to-br from-blue-400 to-blue-700",
    },
    {
      id: 2,
      name: "Show Room",
      user: allMetaData?.data?.totalShowRooms,
      icon: (
        <HiOutlineUsers
          className="text-white transition-all duration-300"
          size={50}
        />
      ),
      path: "/dashboard/show-room-list",
      color: "bg-gradient-to-br from-green-400 to-green-700",
    },
    {
      id: 3,
      name: "Company",
      user: allMetaData?.data?.totalCompanies,
      icon: (
        <HiOutlineUsers
          className="text-white transition-all duration-300"
          size={50}
        />
      ),
      path: "/dashboard/company-list",
      color: "bg-gradient-to-br from-purple-400 to-purple-700",
    },
    {
      id: 4,
      name: "Job Card",
      user: allMetaData?.data?.totalJobCard,
      icon: (
        <HiOutlineBriefcase
          className="text-white transition-all duration-300"
          size={50}
        />
      ),
      path: "/dashboard/jobcard-list",
      color: "bg-gradient-to-br from-orange-400 to-orange-700",
    },
    {
      id: 5,
      name: "Quotation",
      user: allMetaData?.data?.totalQuotation,
      icon: (
        <FaCarSide
          className="text-white transition-all duration-300"
          size={50}
        />
      ),
      path: "/dashboard/quotation-list",
      color: "bg-gradient-to-br from-red-400 to-red-700",
    },
    {
      id: 6,
      name: "Invoice",
      user: allMetaData?.data?.totalInvoice,
      icon: (
        <FaFileInvoice
          className="text-white transition-all duration-300"
          size={50}
        />
      ),
      path: "/dashboard/invoice-list",
      color: "bg-gradient-to-br from-indigo-400 to-indigo-700",
    },
  ];

  return (
    <>
      <div className="mt-5">
        <h3 className="text-3xl font-bold mb-8">Project Overview</h3>

        <div className="grid grid-cols-1 xl:grid-cols-[55%_45%] gap-8">
          {/* Stats Cards - 55% width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
            {userData?.map((data) => (
              <div key={data.id}>
                <Link to={data.path}>
                  <div
                    className={`relative rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer min-h-[180px] flex flex-col items-center justify-center overflow-hidden ${data.color} text-white`}
                  >
                    {/* Wave background */}
                    <div className="absolute inset-0 opacity-20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="20 0 590 300"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                      >
                        <path
                          fill="#ffffff"
                          fillOpacity="0.3"
                          d="M0,160L48,181.3C96,203,192,245,288,229.3C384,213,480,139,576,122.7C672,107,768,149,864,149.3C960,149,1056,107,1152,122.7C1248,139,1344,213,1392,250.7L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                        ></path>
                      </svg>
                    </div>

                    {/* Icon & Text */}
                    <div className="relative z-0 w-20 h-20 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110">
                      {data.icon}
                    </div>
                    <div className="mt-4 relative z-0">
                      <span className="text-center text-2xl font-bold block">
                        {data.user}
                      </span>
                      <h2 className="mt-2 text-lg font-semibold">
                        {data.name}
                      </h2>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Chart Section - 45% width */}
          <div className="bg-white rounded-xl shadow-lg lg:p-6 border border-gray-200">
            <ExpanseIncomeChart />
            {/* <Calendar/> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectOverView;
