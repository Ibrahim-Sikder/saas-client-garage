/* eslint-disable react/prop-types */
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useGetAllInvoicesQuery } from "../../../redux/api/invoice";
import Loading from "../../../components/Loading/Loading";

const RecentInvoice = ({ tenantDomain }) => {
  const {
    data: invoiceData,
    error: invoiceError,
    isLoading: invoiceLoading,
  } = useGetAllInvoicesQuery({
    tenantDomain,
    limit: 5,
    page: 1,
  });

  if (invoiceLoading) return <Loading />;
  if (invoiceError) return <div>Something went wrong!</div>;

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden w-full mt-5 md:mt-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 lg:px-4 p-6 pb-3">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Recent Invoices
        </h3>
        <Link to="/dashboard/create-invoice-list">
          <button className="flex items-center rounded-full px-3 lg:px-4 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:translate-x-1 transition-all duration-300 backdrop-blur-sm">
            <span className="text-sm font-medium text-blue-600">See More</span>
            <HiOutlineArrowNarrowRight size={15} className="ml-1 text-blue-600 transition-transform duration-300" />
          </button>
        </Link>
      </div>
      
      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mx-6" />
      
      {/* Table Container */}
      <div className="overflow-x-auto p-2 w-full">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-50/50 backdrop-blur-sm">
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Invoice ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Invoice No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Total Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Net Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.data?.invoices.slice(0, 5).map((invoice, i) => (
              <tr 
                key={i} 
                className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition-all duration-300 hover:scale-[1.01]"
              >
                <td className="text-start  px-4 py-3 text-sm font-semibold text-gray-800 font-mono">
                  {invoice.Id}
                </td>
                <td className="text-start  px-4 py-3 text-sm font-medium text-gray-900">
                  {invoice.invoice_no}
                </td>
                <td className="text-start  px-4 py-3 text-sm font-medium text-gray-600">
                  {invoice.date}
                </td>
                <td className="text-start  px-4 py-3 text-sm font-bold text-green-600">
                  ${invoice.total_amount}
                </td>
                <td className="text-start  px-4 py-3 text-sm font-bold text-blue-600">
                  ${invoice.net_total}
                </td>
                <td className="text-start px-4 py-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-semibold uppercase tracking-wide shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:scale-105 transition-all duration-300">
                    Paid
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
          Showing {invoiceData?.data?.invoices.slice(0, 5).length} of {invoiceData?.data?.invoices.length} invoices
        </div>
      </div>
    </div>
  );
};

export default RecentInvoice;