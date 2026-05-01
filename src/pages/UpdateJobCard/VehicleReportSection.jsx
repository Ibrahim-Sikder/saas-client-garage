/* eslint-disable react/prop-types */
import '../AddJobCard/AddJobCard.css'
const VehicleReportSection = ({ register }) => {
  return (
    <div className="mt-10 vehicleReport">
      <div className="vehicleReportLeftSide">
        <div className="vehicleTextField">
          <b className="block mb-3">
            Vehicle Interior Parts, Papers, Tools, Meter Light & Others
          </b>
          <textarea
            {...register("vehicle_interior_parts")}
            className="textEditor"
          ></textarea>
        </div>
        <div className="mt-5">
          <b className="block mb-1">Reported Defect</b>
          <textarea
            {...register("reported_defect")}
            className="textEditor"
          ></textarea>
        </div>
        <div className="mt-5">
          <b className="block mb-1">Reported Action</b>
          <textarea
            {...register("reported_action")}
            className="textEditor"
          ></textarea>
        </div>
      </div>
      <div className="vehicleReportRightSide">
        <b className="block mb-3">
          Vehicle Body Report (Mark with X where damage)
        </b>
        <div className="mt-2 imgWrap">
          <img src="/assets/car2.jpeg" alt="car" />
        </div>
        <div className="mt-3">
          <b className="block mb-1">Note</b>
          <textarea {...register("note")} autoComplete="off"></textarea>
        </div>
        <div className="mt-3">
          <b className="block mb-1">Vehicle Body Report Comments</b>
          <textarea
            {...register("vehicle_body_report")}
            autoComplete="off"
            className="p-5"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default VehicleReportSection;