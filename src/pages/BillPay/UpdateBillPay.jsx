/* eslint-disable react/prop-types */
import PaybillForm from "./PaybillForm";

const UpdateBillPay = () => {
  const id = new URLSearchParams(location.search).get("id");

  return <PaybillForm id={id} />;
};

export default UpdateBillPay;
