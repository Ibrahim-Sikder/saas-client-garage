/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { useState } from "react";
import { useGetAllSalaryQuery } from "../../redux/api/salary";
import EmployeeSalaryForm from "./EmployeeSalaryForm";
import EmployeeSalaryListTable from "./EmployeeSalaryListTable";
import { allMonths } from "../../utils/month";
import { useAppOptions } from "../../hooks/useAppOptions";
const years = [{ value: "Select Year", label: "Select Year" }];
for (let year = 2024; year <= 2030; year++) {
  years.push({ value: String(year), label: String(year) });
}

const initialSelectedOption = allMonths[new Date().getMonth()];

const SalaryList = () => {
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [filterType, setFilterType] = useState(initialSelectedOption);

  const { data: getAllSalary } = useGetAllSalaryQuery({
    searchTerm: filterType,
  });
  return (
    <>
      <EmployeeSalaryListTable
        performActionWithPermission={performActionWithPermission}
        tenantDomain={tenantDomain}
        filterType={filterType}
        setFilterType={setFilterType}
        getAllSalary={getAllSalary}
      />
    </>
  );
};

export default SalaryList;
