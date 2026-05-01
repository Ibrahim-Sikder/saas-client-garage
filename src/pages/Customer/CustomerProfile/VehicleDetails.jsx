/* eslint-disable react/prop-types */
"use client";

import { useEffect, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { FaEye, FaTrashAlt, FaEdit } from "react-icons/fa";
import { History } from "@mui/icons-material";
import { Box, Button, Chip, Typography } from "@mui/material";
import swal from "sweetalert";
import { toast } from "react-toastify";

import AddVehicleModal from "./AddVehicleModal";
import VehicleDetailsModal from "./VehicleDetailsModal";
import Loading from "../../../components/Loading/Loading";
import {
  useGetAllVehiclesQuery,
  useDeleteVehicleMutation,
} from "../../../redux/api/vehicle";
import Table from "../../../components/Table";
import { purchaseBtn } from "../../../utils/customStyle";

const VehicleDetails = ({
  id,
  user_type,
  tenantDomain,
  performActionWithPermission,
}) => {
  const [open, setOpen] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState(false);
  const [getId, setGetId] = useState("");
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [reload, setReload] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: allVehicle, isLoading } = useGetAllVehiclesQuery({
    tenantDomain,
    id,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });
  const [deleteVehicle, { isLoading: deleteLoading, error: deleteError }] =
    useDeleteVehicleMutation();

  useEffect(() => setCurrentPage(1), [filterType]);

  if (deleteError) toast.error(deleteError?.message);

  const handleOpen = () => {
    setIsEditing(false);
    setVehicleToEdit(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setVehicleToEdit(null);
  };

  const handleEditOpen = (vehicle) => {
    setVehicleToEdit(vehicle);
    setIsEditing(true);
    setOpen(true);
  };

  const handleVehicleDetailsOpen = (id) => {
    setVehicleDetails(true);
    setGetId(id);
  };

  const handleVehicleDetailsClose = () => setVehicleDetails(false);

  const deleteVehicleHandler = async (vehicleId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this vehicle?",
      icon: "warning",
      dangerMode: true,
      buttons: ["Cancel", "Delete"],
    });

    if (willDelete) {
      try {
        await deleteVehicle({ tenantDomain, id: vehicleId }).unwrap();
        swal("Deleted!", "Vehicle deleted successfully.", "success");
        setReload(!reload);
      } catch (error) {
        swal("Error", "An error occurred while deleting the vehicle.", "error");
      }
    }
  };

  const columns = [
    { key: "index", label: "SL No", type: "index" },
    {
      key: "vehicle",
      label: "Car Reg No.",
      render: (item) => {
        const carReg = item.carReg_no || "";
        const carNo = item.car_registration_no || "";
        return `${carReg} ${carNo}`.trim();
      },
    },

    { key: "chassis_no", label: "Chassis No" },
    { key: "engine_no", label: "Engine & CC" },
    { key: "vehicle_name", label: "Vehicle Name" },
    {
      key: "mileageHistory",
      label: "Latest Mileage",
      render: (vehicle) => {
        const mileageHistory = vehicle.mileageHistory || [];

        if (mileageHistory.length > 0) {
          // Get the most recent
          const sortedHistory = [...mileageHistory].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          const latestMileage = sortedHistory[0];
          const formattedDate = new Date(
            latestMileage.date,
          ).toLocaleDateString();

          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Chip
                icon={<History size={16} />}
                label={`${latestMileage.mileage} km`}
                size="small"
                color="primary"
                variant="filled"
                sx={{
                  fontSize: "0.75rem",
                  mb: 0.5,
                  "& .MuiChip-icon": { marginLeft: "4px", marginRight: "-4px" },
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
            </Box>
          );
        }

        return (
          <Typography variant="body2" color="text.secondary" align="center">
            No history
          </Typography>
        );
      },
    },
  ];

  const actions = [
    {
      key: "view",
      icon: FaEye,
      tooltip: "View Vehicle Details",
      onClick: (vehicle) => handleVehicleDetailsOpen(vehicle._id),
    },
    {
      key: "edit",
      icon: FaEdit,
      color: "green",
      tooltip: "Edit Vehicle",
      requirePermission: true,
      permissionPage: "/dashboard/update-customer",
      permissionAction: "edit",
      onClick: (vehicle) => handleEditOpen(vehicle),
    },
    {
      key: "delete",
      icon: FaTrashAlt,
      color: "red",
      tooltip: "Delete Vehicle",
      requirePermission: true,
      permissionPage: "/dashboard/add-customer",
      permissionAction: "delete",
      onClick: (vehicle) => deleteVehicleHandler(vehicle._id),
      disabled: () => deleteLoading,
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="w-full mt-10 mb-24">
      <Button sx={purchaseBtn} onClick={handleOpen}>
        Add New Vehicle <HiOutlinePlus size={20} />
      </Button>

      <Table
        title="Vehicles"
        columns={columns}
        data={allVehicle?.data?.vehicles || []}
        actions={actions}
        loading={isLoading}
        currentPage={allVehicle?.data?.meta?.currentPage || 1}
        totalPages={allVehicle?.data?.meta?.totalPages || 1}
        onPageChange={setCurrentPage}
        onSearch={setFilterType}
        searchPlaceholder="Search Vehicles..."
        emptyMessage="No vehicles found. Add a new vehicle."
      />

      {open && (
        <AddVehicleModal
          user_type={user_type}
          id={id}
          open={open}
          setOpen={setOpen}
          onClose={handleClose}
          setReload={setReload}
          reload={reload}
          tenantDomain={tenantDomain}
          vehicleData={vehicleToEdit}
          isEditing={isEditing}
          performActionWithPermission={performActionWithPermission}
        />
      )}

      {vehicleDetails && (
        <VehicleDetailsModal
          open={vehicleDetails}
          setOpen={setVehicleDetails}
          tenantDomain={tenantDomain}
          handleVehicleDetailsClose={handleVehicleDetailsClose}
          getId={getId}
          id={id}
          performActionWithPermission={performActionWithPermission}
        />
      )}
    </div>
  );
};

export default VehicleDetails;
