/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetAllVehiclesQuery } from "../../redux/api/vehicle";
import Table from "../../components/Table";
import { DeleteIcon, EditIcon } from "lucide-react";

export const Vehicles = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { tenantDomain } = useTenantDomain();

  const { data: allVehicle, isLoading } = useGetAllVehiclesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm,
    isRecycled: false,
  });

  const columns = useMemo(
    () => [
      {
        key: "index",
        label: "SL",
        type: "index",
      },
      {
        key: "customerId",
        label: "Customer ID",
        render: (item) => {
          if (item.user_type === "customer") return item.customer?.customerId;
          if (item.user_type === "company") return item.company?.companyId;
          if (item.user_type === "showRoom") return item.showRoom?.showRoomId;
          return "N/A";
        },
      },
      {
        key: "carReg",
        label: "Car Reg No",
        render: (item) =>
          `${item.carReg_no || ""} ${item.car_registration_no || ""}`.trim(),
      },
      { key: "vehicle_name", label: "Vehicle Name" },
      { key: "vehicle_brand", label: "Brand" },
      { key: "vehicle_model", label: "Model" },
      { key: "vehicle_category", label: "Category" },
      { key: "user_type", label: "User Type" },
    ],
    []
  );

  const actions = [
    {
      key: "edit",
      icon: EditIcon,
      color: "#2563EB",
      tooltip: "Edit Vehicle",
      link: (item) => `/dashboard/update-vehicle?id=${item._id}`,
    },
    {
      key: "delete",
      icon: DeleteIcon,
      color: "#EF4444",
      tooltip: "Delete Vehicle",
      onClick: (item) => console.lsog("Delete", item._id),
    },
  ];

  return (
    <div>
      <Table
        title="Vehicles"
        columns={columns}
        data={allVehicle?.data?.vehicles || []}
        // actions={actions}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={allVehicle?.data?.meta?.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page)}
        onSearch={(value) => setSearchTerm(value)}
        searchPlaceholder="Search vehicles..."
        getRowClass={(item) =>
          item.user_type === "customer"
            ? "bg-green-50"
            : item.user_type === "company"
            ? "bg-blue-50"
            : item.user_type === "showRoom"
            ? "bg-yellow-50"
            : ""
        }
      />
    </div>
  );
};
