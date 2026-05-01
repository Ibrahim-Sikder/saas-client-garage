import { useAppOptions } from "../../hooks/useAppOptions";
import EmployeeSalaryForm from "./EmployeeSalaryForm";

const UpdateEmployeeSalary = () => {
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  return (
    <EmployeeSalaryForm
      id={id}
      tenantDomain={tenantDomain}
      performActionWithPermission={performActionWithPermission}
    />
  );
};

export default UpdateEmployeeSalary;
