/* eslint-disable react/prop-types */
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useGetAllCustomersQuery } from "../../../redux/api/customerApi";
import Loading from "../../../components/Loading/Loading";

const RecentClient = ({ tenantDomain }) => {
  const {
    data: customerData,
    error,
    isLoading,
  } = useGetAllCustomersQuery({
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
          Recent Clients
        </h3>
        <Link to="/dashboard/customer-list">
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
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-50/50 backdrop-blur-sm">
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Customer Id
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {customerData?.data?.customers.slice(0, 5).map((customer, i) => (
              <tr 
                key={i} 
                className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition-all duration-300 hover:scale-[1.01]"
              >
                <td className="text-start px-4 py-3 text-sm font-semibold text-gray-800 font-mono">
                  {customer.customerId}
                </td>
                <td className="text-start px-4 py-3">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {customer.customer_name}
                      </h4>
                    </div>
                  </div>
                </td>
                <td className="text-start px-4 py-3 text-sm font-medium text-gray-600">
                  {customer.fullCustomerNum}
                </td>
                <td className="text-start px-4 py-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:scale-105 transition-all duration-300">
                    Active
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-blue-50/20">
        <div className="text-xs text-gray-500 text-center font-medium">
          Showing {customerData?.data?.customers.slice(0, 5).length} of {customerData?.data?.customers.length} clients
        </div>
      </div>
    </div>
  );
};

export default RecentClient;