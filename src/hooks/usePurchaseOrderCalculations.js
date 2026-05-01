// hooks/usePurchaseOrderCalculations.js

import { useEffect, useState } from "react";

export const usePurchaseOrderCalculations = (productFields, shippingCost) => {
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        const newTotalAmount = productFields.reduce(
            (acc, item) => acc + (item.unit_price || 0) * (item.product_quantity || 0),
            0
        );

        const newTotalDiscount = productFields.reduce(
            (acc, item) => acc + (item.discount),
            0
        );

        const newTotalTax = productFields.reduce(
            (acc, item) =>
                acc + (((item.unit_price || 0) * (item.tax || 0)) / 100) * (item.product_quantity || 0),
            0
        );

        // Calculate total shipping from products
        const totalProductShipping = productFields.reduce(
            (acc, item) => acc + (item.shipping || 0),
            0
        );

        // Total shipping is product shipping plus additional shipping cost
        const totalShippingAmount = totalProductShipping + (shippingCost || 0);

        setTotalShipping(totalShippingAmount);
        setTotalAmount(newTotalAmount);
        setTotalDiscount(newTotalDiscount);
        setTotalTax(newTotalTax);
        setGrandTotal(
            newTotalAmount + newTotalTax + totalShippingAmount - newTotalDiscount
        );
    }, [productFields, shippingCost]);

    return {
        totalAmount,
        totalDiscount,
        totalTax,
        totalShipping,
        grandTotal,
    };
};