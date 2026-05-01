/* eslint-disable react/prop-types */
import Table from "@/components/Table";
import { DeleteIcon, EditIcon, Eye } from "lucide-react";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../components/Loading/Loading";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import {
  useDueAllMoneyReceiptsQuery,
  useMoveRecycledMoneyReceiptMutation,
} from "../../redux/api/money-receipt";

const DueMoneyReceiptList = () => {
  const navigate = useNavigate();
  const { tenantDomain } = useTenantDomain();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const limit = 10;

  const [moveRecycledMoneyReceipt, { isLoading: deleteLoading }] =
    useMoveRecycledMoneyReceiptMutation();

  const { data: allMoneyReceipts, isLoading: moneyReceiptLoading } =
    useDueAllMoneyReceiptsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const { data: CompanyInfoData } = useGetCompanyProfileQuery({ tenantDomain });
  const companyProfileData = {
    companyName: CompanyInfoData?.data?.companyName,
    address: CompanyInfoData?.data?.address,
    website: CompanyInfoData?.data?.website,
    phone: CompanyInfoData?.data?.phone,
    email: CompanyInfoData?.data?.email,
    logo: CompanyInfoData?.data?.logo[0],
    companyNameBN: CompanyInfoData?.data?.companyNameBN,
  };

  const handleMoveRecycledbin = async (item) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this Money Receipt to Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledMoneyReceipt({ tenantDomain, id: item._id }).unwrap();
        swal("Moved!", "Money Receipt moved to Recycle Bin.", "success");
      } catch (error) {
        swal("Error", "An error occurred while moving the receipt.", "error");
      }
    }
  };

  const getRowClass = (card) => {
    if (card.remaining === 0) return "bg-[#2dce89] text-green-900";
    if (card.remaining === card.total_amount)
      return "bg-[#f5365c] text-red-900";
    return "bg-[#ffad46] text-yellow-900";
  };

  const columns = [
    { key: "index", label: "SL No", type: "index" },
    { key: "thanks_from", label: "Received with thanks from" },
    { key: "job_no", label: "Final Payment against bill no" },
    { key: "total_amount", label: "Total Amount" },
    { key: "advance", label: "Advance Service Bill" },
    { key: "remaining", label: "Due Service Bill" },
    {
      key: "date",
      label: "Date",
      render: (item) =>
        item.default_date !== "NaN-NaN-NaN"
          ? item.default_date
          : item.check_date,
    },
  ];
  const actions = [
    {
      key: "view",
      icon: Eye,
      onClick: (item) =>
        navigate(`/dashboard/money-receipt-view?id=${item._id}`),
      tooltip: "View",
    },
    {
      key: "download",
      icon: FaDownload,
      href: (item) =>
        `${import.meta.env.VITE_API_URL}/money-receipts/money/${
          item._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`,
      target: "_blank",
      tooltip: "Download",
    },
    {
      key: "edit",
      icon: EditIcon,
      link: (item) => `/dashboard/money-receipt-update?id=${item._id}`,
      tooltip: "Edit",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      onClick: handleMoveRecycledbin,
      disabled: () => deleteLoading,
      tooltip: "Move to Recycle Bin",
    },
  ];

  if (moneyReceiptLoading) return <Loading />;

  return (
    <div className="mt-5">
      <Table
        title="Money Receipt Due List"
        columns={columns}
        data={allMoneyReceipts?.data?.moneyReceipts || []}
        actions={actions}
        currentPage={currentPage}
        totalPages={allMoneyReceipts?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        loading={moneyReceiptLoading}
        onSearch={(value) => {
          setFilterType(value);
          setCurrentPage(1);
        }}
        getRowClass={getRowClass}
        searchPlaceholder="Search money receipts..."
      />
    </div>
  );
};

export default DueMoneyReceiptList;
