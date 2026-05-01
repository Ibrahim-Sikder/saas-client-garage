/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import Loading from "../../../components/Loading/Loading";
import GarageModal from "../../../components/Share/Modal/GarageModal";
import { useGetSingleVehicleQuery } from "../../../redux/api/vehicle";

const VehicleDetailsModal = ({
  handleVehicleDetailsClose,
  getId,
  id,
  tenantDomain,
  open,
  setOpen
}) => {
  const { data: singleVehicle, isLoading } = useGetSingleVehicleQuery({
    tenantDomain,
    id: getId,
  });

  if (isLoading) {
    return <Loading />;
  }

  // Format date for better readability
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const title = 'Vehicle Details'

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
    >
      <div className="p-6 space-y-4">
        {/* Basic Vehicle Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <b>Car Registration No:</b>
          </div>
          <div>
            {" "}
            {singleVehicle?.data?.carReg_no}{" "}
            {singleVehicle?.data?.car_registration_no}
          </div>

          <div>
            <b>Chassis No:</b>
          </div>
          <div>{singleVehicle?.data?.chassis_no}</div>

          <div>
            <b>Engine No & CC:</b>
          </div>
          <div>{singleVehicle?.data?.engine_no}</div>

          <div>
            <b>Vehicle Brand:</b>
          </div>
          <div>{singleVehicle?.data?.vehicle_brand}</div>

          <div>
            <b>Vehicle Name:</b>
          </div>
          <div>{singleVehicle?.data?.vehicle_name}</div>

          <div>
            <b>Vehicle Model:</b>
          </div>
          <div>{singleVehicle?.data?.vehicle_model}</div>

          <div>
            <b>Vehicle Category:</b>
          </div>
          <div>{singleVehicle?.data?.vehicle_category}</div>

          <div>
            <b>Color & Code:</b>
          </div>
          <div>{singleVehicle?.data?.color_code}</div>



          <div>
            <b>Fuel Type:</b>
          </div>
          <div>{singleVehicle?.data?.fuel_type}</div>
          <div>
            <b>Driver Name:</b>
          </div>
          <div>{singleVehicle?.data?.driver_name}</div>
          <div>
            <b>Driver Contact No:</b>
          </div>
          <div>
            {" "}
            {singleVehicle?.data?.driver_country_code}
            {singleVehicle?.data?.driver_contact}{" "}
          </div>
        </div>

        {/* Mileage History Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Mileage History</h3>
          <div className="border rounded-lg overflow-hidden">
            {singleVehicle?.data?.mileageHistory?.map((entry, index) => (
              <div
                key={entry._id}
                className={`flex justify-between items-center p-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
              >
                <span className="text-sm text-gray-600">
                  {formatDate(entry.date)}
                </span>
                <span className="font-medium">{entry.mileage} km</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GarageModal>
  );
};

export default VehicleDetailsModal;
