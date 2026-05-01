import { useEffect, useState } from "react";

export const useQuotationCalculations = (
  items,
  serviceItems,
  specificQuotation,
  isEditMode,
  discount,
  vat,
  tax
) => {
  const [grandTotal, setGrandTotal] = useState(0);
  const [partsTotal, setPartsTotal] = useState(0);
  const [serviceTotal, setServiceTotal] = useState(0);

  useEffect(() => {
    if (isEditMode) {
      const existingPartsTotal =
        specificQuotation?.input_data?.reduce(
          (sum, item) => sum + (Number.parseFloat(item.total) || 0),
          0
        ) || 0;

      const newPartsTotal = items.reduce(
        (sum, item) => sum + (Number.parseFloat(item.total) || 0),
        0
      );

      const existingServiceTotal =
        specificQuotation?.service_input_data?.reduce(
          (sum, item) => sum + (Number.parseFloat(item.total) || 0),
          0
        ) || 0;

      const newServiceTotal = serviceItems.reduce(
        (sum, item) => sum + (Number.parseFloat(item.total) || 0),
        0
      );

      const totalPartsAmount = existingPartsTotal + newPartsTotal;
      const totalServiceAmount = existingServiceTotal + newServiceTotal;
      const grandTotalAmount = totalPartsAmount + totalServiceAmount;

      setPartsTotal(totalPartsAmount);
      setServiceTotal(totalServiceAmount);
      setGrandTotal(grandTotalAmount);
    } else {
      const totalSum = items.reduce((sum, item) => sum + Number(item.total), 0);
      const serviceTotalSum = serviceItems.reduce(
        (sum, item) => sum + Number(item.total),
        0
      );
      const roundedTotalSum = Number.parseFloat(
        totalSum + serviceTotalSum
      ).toFixed(2);
      setPartsTotal(Number(totalSum));
      setServiceTotal(Number(serviceTotalSum));
      setGrandTotal(Number(roundedTotalSum));
    }
  }, [
    items,
    serviceItems,
    specificQuotation?.input_data,
    specificQuotation?.service_input_data,
    isEditMode,
  ]);

  const calculateFinalTotal = () => {
    if (isEditMode) {
      let currentPartsTotal = partsTotal;
      let currentServiceTotal = serviceTotal;

      if (currentPartsTotal === 0 && specificQuotation?.parts_total) {
        currentPartsTotal = Number(specificQuotation.parts_total);
      }
      if (currentServiceTotal === 0 && specificQuotation?.service_total) {
        currentServiceTotal = Number(specificQuotation.service_total);
      }

      const currentGrandTotal = currentPartsTotal + currentServiceTotal;

      let effectiveDiscount = 0;
      if (discount === 0 || discount > 0) {
        effectiveDiscount = discount;
      } else if (discount === "") {
        effectiveDiscount = Number(specificQuotation?.discount) || 0;
      }

      let totalAfterDiscount = currentGrandTotal - effectiveDiscount;
      totalAfterDiscount = totalAfterDiscount < 0 ? 0 : totalAfterDiscount;

      let effectiveVat = 0;
      if (vat === 0 || vat > 0) {
        effectiveVat = vat;
      } else if (vat === "") {
        effectiveVat = Number(specificQuotation?.vat) || 0;
      }

      const vatAmount = totalAfterDiscount * (effectiveVat / 100);
      const totalAfterVat = totalAfterDiscount + vatAmount;

      let effectiveTax = 0;
      if (tax === 0 || tax > 0) {
        effectiveTax = tax;
      } else if (tax === "") {
        effectiveTax = Number(specificQuotation?.tax) || 0;
      }

      const taxAmount = totalAfterVat * (effectiveTax / 100);
      const finalTotal = totalAfterVat + taxAmount;

      return Number.parseFloat(finalTotal).toFixed(2);
    } else {
      const discountAsPercentage = discount;
      const totalAfterDiscount = grandTotal - discountAsPercentage;
      const vatAsPercentage = vat / 100;
      const totalAfterVat =
        totalAfterDiscount + totalAfterDiscount * vatAsPercentage;
      const taxAsPercentage = tax / 100;
      let finalTotal = totalAfterVat + totalAfterVat * taxAsPercentage;
      finalTotal = Number.parseFloat(finalTotal).toFixed(2);
      return finalTotal;
    }
  };

  return {
    grandTotal,
    partsTotal,
    serviceTotal,
    calculateFinalTotal,
  };
};
