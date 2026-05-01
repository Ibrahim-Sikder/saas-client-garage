/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import GarageModal from "../../../components/Share/Modal/GarageModal";
import PurchaseOrderForm from "./PurchaseOrderForm";

const PurchaseOrderModal = ({ tenantDomain, open, onClose, onSave }) => {
  const title = "Purchase Order"
  return (
    <GarageModal
      open={open}
      setOpen={onClose}
      title={title}
      maxWidth="xl"
    >
      <PurchaseOrderForm tenantDomain={tenantDomain} onClose={onClose} />
    </GarageModal>
  );
};

export default PurchaseOrderModal;
