import IncomeForm from "./IncomeForm";

const UpdateIncome = () => {
  const id = new URLSearchParams(location.search).get("id");

  return <IncomeForm id={id}/>;
};

export default UpdateIncome;
