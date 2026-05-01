/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";
import '../AddJobCard/AddJobCard.css'
const TechnicianSection = ({ register, singleCard }) => {
  return (
    <>
      <div className="flex flex-wrap gap-5 items-center justify-between mt-5 mb-10">
        <div>
          <TextField
            className="ownerInput"
            {...register("technician_name")}
            label="Technician Name (T)"
            focused={singleCard?.technician_name || ""}
          />
        </div>
        <div>
          <TextField
            disabled
            className="ownerInput"
            {...register("technician_signature")}
            label="Technician Signature (T)"
          />
        </div>
        <div className="cursor-pointer mb-3 md:mb-0">
          <input
            {...register("technician_date")}
            className="border h-14 w-[250px] px-3 rounded-sm"
            type="date"
            defaultValue={singleCard?.technician_date}
          />
        </div>
        <div>
          <TextField
            disabled
            className="ownerInput"
            {...register("vehicle_owner")}
            label="Vehicle Owner (T)"
          />
        </div>
      </div>
      <div className="mt-3">
        <b>This is not an invoice, all estimates are valid for 30 days</b>
      </div>
    </>
  );
};

export default TechnicianSection;