/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { FaTrashAlt, FaEdit, FaEye, FaDownload } from "react-icons/fa";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import EmptyCustomerData from "../../../components/EmptyCustomerData/EmptyCustomerData";
import {
  useGetAllJobCardsQuery,
  useMovetoRecycleBinJobCardMutation,
} from "../../../redux/api/jobCard";
import Table from "../../../components/Table";
import { Button } from "@mui/material";
import { purchaseBtn } from "../../../utils/customStyle";

const CustomerJobCardList = ({
  id,
  customerId,
  user_type,
  tenantDomain,
  companyProfileData,
}) => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const { data: jobCards, isLoading } = useGetAllJobCardsQuery({
    tenantDomain,
    id,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });
  const [movetoRecycleBinJobCard, { isLoading: deleteLoading }] =
    useMovetoRecycleBinJobCardMutation();

  const deletePackage = async (jobCardId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this job card to Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await movetoRecycleBinJobCard({ tenantDomain, id: jobCardId }).unwrap();
        swal(
          "Moved to Recycle bin!",
          "Move to Recycle bin successful.",
          "success",
        );
      } catch (error) {
        swal(
          "Error",
          "An error occurred while deleting the job card.",
          "error",
        );
      }
    }
  };
  const columns = [
    { key: "index", label: "SL. N.", type: "index" },
    { key: "job_no", label: "Job Card No." },
    {
      key: "customer_name",
      label: "Customer Name",
      render: (item) => {
        switch (item?.user_type) {
          case "customer":
            return item?.customer?.customer_name || "—";
          case "company":
            return item?.company?.company_name || "—";
          case "showRoom":
            return item?.showRoom?.showRoom_name || "—";
          default:
            return "—";
        }
      },
    },

    { key: "customer.fullCustomerNum", label: "Mobile No." },
    {
      key: "vehicle.vehicle_name",
      label: "Vehicle Name",
      render: (item) => item.vehicle?.map((v) => v.vehicle_name).join(", "),
    },
    {
      key: "vehicle.carReg_no",
      label: "Car Reg No.",
      render: (item) => {
        if (!item?.vehicle || !Array.isArray(item.vehicle)) return "—";

        return item.vehicle
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

    { key: "date", label: "Date" },
  ];

  const getRowClass = () => "";

  const actions = [
    {
      key: "create-quotation",
      icon: FaEdit,
      tooltip: "Create Quotation",
      link: (item) => `/dashboard/create-quotation?order_no=${item.job_no}`,
      color: "purple",
    },
    {
      key: "preview",
      icon: FaEye,
      tooltip: "Preview",
      onClick: (item, { navigate }) =>
        navigate(`/dashboard/preview?id=${item._id}`),
    },
    {
      key: "download",
      icon: FaDownload,
      tooltip: "Download Job Card",
      href: (item) =>
        `${import.meta.env.VITE_API_URL}/jobCards/jobcard/${
          item._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData),
        )}`,
      target: "_blank",
      color: "",
    },
    {
      key: "edit",
      icon: FaEdit,
      tooltip: "Edit Job Card",
      link: (item) =>
        `/dashboard/update-jobcard?id=${item._id}&user_type=${user_type}&user=${id}`,
      color: "blue",
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      tooltip: deleteLoading ? "Deleting..." : "Delete Job Card",
      onClick: (item) => deletePackage(item._id),
      disabled: () => deleteLoading,
      color: "red",
    },
  ];

  return (
    <div className="mb-24 mt-10 w-full">
      <Button
        sx={purchaseBtn}
        component={Link}
        to={`/dashboard/create-job-card?id=${customerId}&user_type=${user_type}`}
      >
        Create Job Card <HiOutlinePlus size={20} />
      </Button>
      <Table
        title="Job Card List"
        columns={columns}
        data={jobCards?.data?.jobCards || []}
        actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={jobCards?.data?.meta?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => {
          setFilterType(value);
          setCurrentPage(1);
        }}
        getRowClass={getRowClass}
        emptyMessage={
          <EmptyCustomerData
            title="Your Garage Awaits!"
            subtitle="Rev up your productivity! Start by creating your first job card and watch your garage come to life."
            buttonText="Create Your First Job Card"
            link={`/dashboard/create-job-card?id=${customerId}&user_type=${user_type}`}
          />
        }
      />
    </div>
  );
};

export default CustomerJobCardList;
