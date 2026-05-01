/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import {  Money } from "@mui/icons-material";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import Loading from "../../../components/Loading/Loading";
import {
  useGetAllInvoicesQuery,
  useMoveRecycledInvoiceMutation,
} from "../../../redux/api/invoice";
import { getRowClass } from "../../../utils/getRowClass";
import Table from "../../../components/Table";
import { Button } from "@mui/material";
import { purchaseBtn } from "../../../utils/customStyle";
import { DeleteIcon, Download, EditIcon, Eye, View } from "lucide-react";

const CustomerInvoiceList = ({
  id,
  user_type,
  tenantDomain,
  companyProfileData,
}) => {
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data: allInvoices, isLoading: invoiceLoading } =
    useGetAllInvoicesQuery({
      tenantDomain,
      id,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });

  const [moveRecycledInvoice, { isLoading: deleteLoading }] =
    useMoveRecycledInvoiceMutation();

  const handleMoveToRecycledbin = async (invoiceId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to move this invoice to Recycle Bin?",
      icon: "warning",
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await moveRecycledInvoice({ tenantDomain, id: invoiceId }).unwrap();
        swal("Moved!", "Invoice moved to Recycle Bin successfully.", "success");
      } catch (err) {
        swal("Error", "An error occurred while moving the invoice.", "error");
      }
    }
  };

  if (invoiceLoading) return <Loading />;
  const columns = [
    { key: "slNo", label: "SL No", type: "index" },
    { key: "job_no", label: "Invoice No." },

    {
      key: "customer",
      label: "Customer Name",
      render: (data) =>
        data.customer?.customer_name ||
        data.company?.company_name ||
        data.showRoom?.showRoom_name ||
        "N/A",
    },
    {
      key: "vehicle_name",
      label: "Vehicle Name",
      render: (data) => {
        if (!data?.vehicle) return "N/A";
        const vehicles = Array.isArray(data.vehicle)
          ? data.vehicle
          : [data.vehicle];
        return vehicles.map((v) => v.vehicle_name || "—").join(", ");
      },
    },

    {
      key: "vehicle",
      label: "Vehicle Reg No",
      render: (data) => {
        if (!data?.vehicle) return "N/A";
        const vehicles = Array.isArray(data.vehicle)
          ? data.vehicle
          : [data.vehicle];

        return vehicles
          .map((v) => {
            const carRegNo = v?.carReg_no?.trim() || "";
            const carRegistrationNo = v?.car_registration_no?.trim() || "";
            if (carRegNo && carRegistrationNo) {
              return `${carRegNo}-${carRegistrationNo}`;
            }
            return carRegNo || carRegistrationNo || "—";
          })
          .join(", ");
      },
    },

    {
      key: "contact",
      label: "Mobile No.",
      render: (data) =>
        data.customer?.fullCustomerNum ||
        data.company?.fullCompanyNum ||
        data.showRoom?.fullCompanyNum ||
        "N/A",
    },

    { key: "date", label: "Date" },
  ];

  const actions = [
    {
      key: "money",
      color: "#fff",
      icon: Money,
      href: (item) =>
        `/dashboard/money-receive-create?order_no=${item.job_no}&id=${item._id}&net_total=${item.due}`,
      tooltip: "Money Receipt",
    },
    {
      key: "preview",
      icon: Eye,
      color: "#fff",
      onClick: (item) =>
        window.location.assign(`/dashboard/invoice-view?id=${item._id}`),
      tooltip: "Preview Invoice",
    },
    {
      key: "download",
      icon: Download,
      color: "#fff",
      href: (item) =>
        `${import.meta.env.VITE_API_URL}/invoices/invoice/${
          item._id
        }?tenantDomain=${tenantDomain}&companyProfileData=${encodeURIComponent(
          JSON.stringify(companyProfileData)
        )}`,
      target: "_blank",
      tooltip: "Download Invoice",
    },
    {
      key: "edit",
      icon: EditIcon,
      color: "#fff",
      link: (item) =>
        `/dashboard/update-invoice?id=${item._id}&user_type=${user_type}&user=${id}`,
      tooltip: "Edit Invoice",
    },
    {
      key: "delete",
      icon: DeleteIcon,
      color: "#fff",
      onClick: (item) => handleMoveToRecycledbin(item._id),
      tooltip: "Move to Recycle Bin",
      disabled: () => deleteLoading,
    },
  ];

  return (
    <div className="mb-24 mt-10 w-full">
      <Button
        component={Link}
        sx={purchaseBtn}
        to={`/dashboard/create-invoice?id=${id}`}
      >
        Create Invoice <HiOutlinePlus size={20} className="ml-2" />
      </Button>
      <Table
        title="Invoices"
        columns={columns}
        data={allInvoices?.data?.invoices || []}
        loading={invoiceLoading}
        currentPage={currentPage}
        totalPages={allInvoices?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        onSearch={setFilterType}
        getRowClass={getRowClass}
        searchPlaceholder="Search invoices..."
        actions={actions}
      />
    </div>
  );
};

export default CustomerInvoiceList;
