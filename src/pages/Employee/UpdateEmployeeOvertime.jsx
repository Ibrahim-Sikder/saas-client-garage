import OvertimeForm from "./OvertimeForm";

const UpdateEmployeeOvertime = () => {
    const overtimeId = new URLSearchParams(location.search).get("overtimeId");

  return <OvertimeForm overtimeId={overtimeId}/>;
};

export default UpdateEmployeeOvertime;
