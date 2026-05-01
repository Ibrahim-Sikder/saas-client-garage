/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { useAppOptions } from "../../hooks/useAppOptions";
import { allMonths } from "../../utils/month";
import EmployeeSalaryForm from "./EmployeeSalaryForm";
const years = [{ value: "Select Year", label: "Select Year" }];
for (let year = 2024; year <= 2030; year++) {
  years.push({ value: String(year), label: String(year) });
}

const initialSelectedOption = allMonths[new Date().getMonth()];

const EmployeeSalary = () => {
  const { tenantDomain, performActionWithPermission } = useAppOptions();

  return (
    <>
      <EmployeeSalaryForm
        performActionWithPermission={performActionWithPermission}
        tenantDomain={tenantDomain}
      />
    </>
  );
};

export default EmployeeSalary;
