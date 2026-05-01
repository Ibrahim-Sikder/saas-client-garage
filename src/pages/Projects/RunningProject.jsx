/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { backBtnStyle } from "../../utils/customStyle";
import QuotationTable from "../Quotation/QuotationTable";
const QuotationList = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const status = "running";

  return (
    <div>
      <div className="overflow-x-auto mt-5">
        <div className="flex items-center justify-center flex-wrap gap-3  md:justify-between my-3 ">
          <div className="flex flex-wrap items-center justify-center">
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={backBtnStyle}
            >
              Back
            </Button>
          </div>
          <div className="productHome">
            <span>Dashboard / </span>
            <span>Projects / </span>
            <span>Running Projects </span>
          </div>
        </div>
        <QuotationTable status={status} title="Running Project" />
      </div>
    </div>
  );
};

export default QuotationList;
