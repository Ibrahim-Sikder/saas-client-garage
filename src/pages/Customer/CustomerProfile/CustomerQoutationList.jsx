/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import {
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaFileInvoice,
  FaDownload,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { toast } from "react-toastify";
import {
  useGetAllQuotationsQuery,
  useMoveRecycledQuotationMutation,
} from "../../../redux/api/quotation";
import Table from "../../../components/Table";
import { Button } from "@mui/material";
import { purchaseBtn } from "../../../utils/customStyle";

const CustomerQuotationList = ({
  id,
  customerId,
  user_type,
  tenantDomain,
  companyProfileData,
}) => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch quotations
  const { data: allQuotations, isLoading: quotationLoading } =
    useGetAllQuotationsQuery({
      tenantDomain,
      id,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const [
    moveRecycledQuotation,
    { idLoading: deleteLoading, error: deleteError },
  ] = useMoveRecycledQuotationMutation();

  const deletePackage = async (quotationId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this quotation to Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledQuotation({ tenantDomain, id: quotationId }).unwrap();
        swal(
          "Moved to Recycle bin!",
          "Move to Recycle bin successful.",
          "success",
        );
      } catch (error) {
        swal(
          "Error",
          "An error occurred while deleting the quotation.",
          "error",
        );
      }
    }
  };

  if (deleteError) {
    toast.error(deleteError?.message);
  }

  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "job_no", label: "Quotation No." },
    {
      key: "customer.customer_name",
      label: "Customer Name",
      render: (item) =>
        item.customer?.customer_name ||
        item.company?.company_name ||
        item.showRoom?.showRoom_name ||
        "N/A",
    },
    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (d) =>
        Array.isArray(d?.vehicle)
          ? d.vehicle.map((v) => v.vehicle_name || "—").join(", ")
          : d.vehicle?.vehicle_name || "N/A",
    },

    {
      key: "car_no",
      label: "Vehicle Reg No ",
      render: (d) => {
        if (!d?.vehicle) return "N/A";
        const vehicles = Array.isArray(d.vehicle) ? d.vehicle : [d.vehicle];

        return vehicles
          .map((v) => {
            const carRegNo = v?.carReg_no?.trim() || "";
            const carRegistrationNo = v?.car_registration_no?.trim() || "";
            if (carRegNo && carRegistrationNo)
              return `${carRegNo}-${carRegistrationNo}`;
            return carRegNo || carRegistrationNo || "—";
          })
          .join(", ");
      },
    },
    {
      key: "mobile",
      label: "Mobile No.",
      render: (item) =>
        item.customer?.fullCustomerNum ||
        item.company?.fullCompanyNum ||
        item.showRoom?.fullCompanyNum ||
        "N/A",
    },
    { key: "date", label: "Date" },
  ];

  const getRowClass = (item) => {
    if (item.status === "running") return "bg-[#f5365c] text-white";
    if (item.status === "completed") return "bg-[#2dce89] text-white";
    return "";
  };

  const actions = [
    {
      key: "preview",
      icon: FaEye,
      tooltip: "Preview",
      color: "#fff",
      onClick: (item, { navigate }) =>
        navigate(`/dashboard/quotation-view?id=${item._id}`),
    },
    {
      key: "create-invoice",
      icon: FaFileInvoice,
      color: "#fff",
      tooltip: "Create Invoice",
      href: (item) =>
        `/dashboard/create-invoice?order_no=${item.job_no}&id=${item._id}`,
    },
    {
      key: "download",
      icon: FaDownload,
      color: "#fff",
      tooltip: "Download Quotation",
      href: (item) =>
        `${import.meta.env.VITE_API_URL}/quotations/quotation/${
          item._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData),
        )}`,
      target: "_blank",
    },
    {
      key: "edit",
      icon: FaEdit,
      color: "#fff",
      tooltip: "Edit Quotation",
      link: (item) =>
        `/dashboard/update-quotation?id=${item._id}&user_type=${user_type}&user=${id}`,
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      color: "#fff",
      tooltip: deleteLoading ? "Deleting..." : "Delete Quotation",
      onClick: (item) => deletePackage(item._id),
      disabled: () => deleteLoading,
    },
  ];

  return (
    <div className="mb-24 mt-10 w-full">
      <Button
        sx={purchaseBtn}
        component={Link}
        to={`/dashboard/create-quotation?id=${id}`}
      >
        Create Quotation <HiOutlinePlus size={20} />
      </Button>

      <Table
        title="Customer Quotations"
        columns={columns}
        data={allQuotations?.data?.quotations || []}
        actions={actions}
        loading={quotationLoading}
        currentPage={currentPage}
        totalPages={allQuotations?.data?.meta?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => {
          setFilterType(value);
          setCurrentPage(1);
        }}
        getRowClass={getRowClass}
        emptyMessage={
          <div className="flex flex-col items-center justify-center h-[400px] text-center bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg shadow-lg overflow-hidden">
            <FaFileInvoice className="text-6xl text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold text-blue-800 mb-4">
              No Quotations Found
            </h2>
            <p className="text-xl text-gray-600 mb-6 max-w-md">
              Start creating quotations to streamline your garage's pricing
              process.
            </p>
            <Link
              to={`/dashboard/create-quotation?id=${id}`}
              className="group relative inline-flex items-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-blue-500 hover:bg-blue-700 transition duration-300"
            >
              <span className="absolute right-0 translate-x-full transition-transform group-hover:-translate-x-4">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium transition-all group-hover:mr-4">
                Create Your First Quotation
              </span>
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default CustomerQuotationList;
