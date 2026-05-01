/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { backBtnStyle } from "../../utils/customStyle";
import InvoiceTable from "../Invoice/InvoiceTable";

const CompletedProject = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };
  const status = 'completed'
  return (
    <div className="mt-5 overflow-x-auto">
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
          <span>Complete Projects </span>
        </div>
      </div>

      <InvoiceTable status={status} title="Completed Projects" />
    </div>
  );
};

export default CompletedProject;
