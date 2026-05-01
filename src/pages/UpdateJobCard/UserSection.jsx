/* eslint-disable react/prop-types */

import EditableDateField from "./EditableDateField";
import '../AddJobCard/AddJobCard.css'
const UserSection = ({ singleCard, formattedDate, onDateChange, currentDate }) => {
  return (
    <div className="flex lg:flex-row flex-col items-center justify-between my-5 lg:text-left text-center">
      <div>
        <div>
          <b>
            Job No: <span className="requiredStart">*</span>
          </b>
          <span> {singleCard?.job_no}</span>
        </div>
        <div className="py-1">
          <b>User type: </b>
          {singleCard?.user_type}
        </div>
        <div>
          <b>User Id: </b>
          {singleCard?.Id}
        </div>
      </div>
      <div>
        <div className="vehicleCard">Vehicle Job Card</div>
      </div>
      <div>
        <div className="cursor-pointer">
          <b>
            Date <span className="requiredStart">*</span>
          </b>
          <EditableDateField
            value={formattedDate}
            onChange={onDateChange}
            maxDate={currentDate}
          />
        </div>
      </div>
    </div>
  );
};

export default UserSection;