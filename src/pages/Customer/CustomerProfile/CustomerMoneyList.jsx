/* eslint-disable react/prop-types */

"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaDownload,
  FaMoneyBillWave,
} from "react-icons/fa";
import { HiOutlinePlus } from "react-icons/hi";
import swal from "sweetalert";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading/Loading";
import { Button } from "@mui/material";
import { purchaseBtn } from "../../../utils/customStyle";
import {
  useGetAllMoneyReceiptsQuery,
  useMoveRecycledMoneyReceiptMutation,
} from "../../../redux/api/money-receipt";
import Table from "../../../components/Table";

const CustomerMoneyList = ({
  id,
  user_type,
  tenantDomain,
  companyProfileData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();

  const limit = 10;

  const {
    data: allMoneyReceipts,
    isLoading: moneyReceiptLoading,
    error,
  } = useGetAllMoneyReceiptsQuery({
    tenantDomain,
    id,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });

  const [moveRecycledMoneyReceipt, { isLoading: deleteLoading }] =
    useMoveRecycledMoneyReceiptMutation();

  const handleMoveRecycledbin = async (receiptId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this Money Receipt to Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledMoneyReceipt({
          tenantDomain,
          id: receiptId,
        }).unwrap();
        swal(
          "Moved!",
          "Money Receipt moved to Recycle bin successfully.",
          "success"
        );
      } catch (err) {
        swal(
          "Error",
          "An error occurred while moving the money receipt.",
          "error"
        );
      }
    }
  };

  const handleIconPreview = (receiptId) => {
    navigate(`/dashboard/money-receipt-view?id=${receiptId}`);
  };

  if (moneyReceiptLoading) return <Loading />;
  if (error) toast.error(error.message);
  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "job_no", label: "Final B.A Bill" },
    { key: "thanks_from", label: "R With Thanks " },
    {
      key: "vehicle.carReg_no",
      label: "Car Reg No",
      render: (row) => {
        const vehicle = row?.vehicle;
        if (!vehicle) return "—";

        const carRegNo = vehicle?.carReg_no?.trim() || "";
        const carRegistrationNo = vehicle?.car_registration_no?.trim() || "";

        if (carRegNo && carRegistrationNo) {
          return `${carRegNo} ${carRegistrationNo}`;
        }

        return carRegNo || carRegistrationNo || "—";
      },
    },

    { key: "total_amount", label: "Total" },
    {
      key: "advance",
      label: "Advance",
      render: (row) => row.advance || 0,
    },
    { key: "remaining", label: "Due" },
    {
      key: "date",
      label: "Date",
      render: (row) =>
        row.default_date !== "NaN-NaN-NaN" ? row.default_date : row.check_date,
    },
  ];

  const actions = [
    {
      key: "preview",
      icon: FaEye,
      color: "#fff",
      tooltip: "Preview Money Receipt",
      onClick: (item) => handleIconPreview(item._id),
    },
    {
      key: "download",
      icon: FaDownload,
      tooltip: "Download Money Receipt",
      color: "#fff",
      href: (item) =>
        `${import.meta.env.VITE_API_URL}/money-receipts/money/${
          item._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`,
      target: "_blank",
    },
    {
      key: "edit",
      icon: FaEdit,
      color: "#fff",
      tooltip: "Edit Money Receipt",
      link: (item) =>
        `/dashboard/money-receipt-update?id=${item._id}&user_type=${user_type}&user=${id}`,
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      color: "#fff",
      tooltip: deleteLoading ? "Deleting..." : "Move to Recycle Bin",
      onClick: (item) => handleMoveRecycledbin(item._id),
      disabled: () => deleteLoading,
    },
  ];

  const getRowClass = (item) => {
    if (item.remaining === 0) return "bg-[#2dce89] text-white";
    if (item.remaining === item.total_amount) return "bg-[#f5365c] text-white";
    return "bg-[#ffad46] text-black";
  };

  return (
    <div className="mb-24 mt-10 w-full">
      <div className="flex flex-wrap items-center justify-between mb-5">
        <Button
          to={`/dashboard/money-receive-create?id=${id}`}
          sx={purchaseBtn}
          component={Link}
        >
          Add Money Receipt <HiOutlinePlus size={20} />
        </Button>
      </div>

      <Table
        title="Money Receipts"
        columns={columns}
        data={allMoneyReceipts?.data?.moneyReceipts || []}
        actions={actions}
        getRowClass={getRowClass}
        loading={moneyReceiptLoading}
        currentPage={allMoneyReceipts?.data?.meta?.currentPage || 1}
        totalPages={allMoneyReceipts?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        onSearch={setFilterType}
        searchPlaceholder="Search Money Receipts..."
        emptyMessage={
          <div className="flex flex-col items-center justify-center h-64 text-center p-4 bg-gray-100 rounded-lg">
            <FaMoneyBillWave className="text-6xl text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Money Receipts Found
            </h3>
            <p className="text-gray-600 mb-4">
              Start by adding your first money receipt to keep track of
              payments.
            </p>
            <Link
              to={`/dashboard/money-receive-create?id=${id}`}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition duration-300 flex items-center gap-x-2"
            >
              <FaMoneyBillWave /> Create Your First Money Receipt
            </Link>
          </div>
        }
      />
    </div>
  );
};

export default CustomerMoneyList;
