// hooks/usePurchaseOrderProducts.js

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { TOAST_MESSAGES } from "../constant/purchaseOrderConstant";

export const usePurchaseOrderProducts = (initialProducts = [], setSearchTerm) => {
    const [productFields, setProductFields] = useState(initialProducts);
    const productSearchRef = useRef(null);

    const handleProductSearch = (value) => {
        setSearchTerm(value);
    };

    const handleAddProduct = (product) => {
        if (!product) return;

        const existingProductIndex = productFields.findIndex(
            (field) => field.productId === product.product._id
        );

        if (existingProductIndex !== -1) {
            const updatedFields = [...productFields];
            updatedFields[existingProductIndex].product_quantity += 1;
            updatedFields[existingProductIndex].subtotal =
                updatedFields[existingProductIndex].unit_price *
                updatedFields[existingProductIndex].product_quantity;
            setProductFields(updatedFields);
            toast.info(TOAST_MESSAGES.quantityUpdated, {
                position: "top-right",
                autoClose: 2000,
            });
        } else {
            const productPrice = Number(product.product.purchasePrice) || 0;
            const subTotal = productPrice * Number(product.product.product_quantity);
            const newProduct = {
                productId: product.product._id,
                productName: product.product.product_name,
                productUnit: product.product?.unit?.unit || "Pcs",
                productPrice: productPrice,
                unit_price: productPrice,
                tax: Number(product.product.product_tax) || 0,
                discount: Number(product.product.discount) || 0,
                shipping: Number(product.product.shipping) || 0,
                product_quantity: product.product.product_quantity,
                quantity: 1,
                subtotal: subTotal,
            };

            setProductFields([...productFields, newProduct]);
            toast.success(TOAST_MESSAGES.productAdded, {
                position: "top-right",
                autoClose: 2000,
            });
        }

        setSearchTerm("");
        if (productSearchRef.current) {
            productSearchRef.current.value = "";
        }
    };

    const handleRemoveProduct = (index) => {
        const newFields = [...productFields];
        newFields.splice(index, 1);
        setProductFields(newFields);
        toast.info(TOAST_MESSAGES.productRemoved, {
            position: "top-right",
            autoClose: 2000,
        });
    };

    const handleQuantityChange = (index, change) => {
        const updatedFields = [...productFields];
        const newQuantity = Math.max(
            1,
            updatedFields[index].product_quantity + change
        );
        updatedFields[index].product_quantity = newQuantity;
        updatedFields[index].subtotal =
            updatedFields[index].unit_price * newQuantity;
        setProductFields(updatedFields);
    };

    const handlePriceChange = (index, value) => {
        const updatedFields = [...productFields];
        const newPrice = Number(value) || 0;
        updatedFields[index].productPrice = newPrice;
        updatedFields[index].unit_price = newPrice;
        updatedFields[index].subtotal = newPrice * updatedFields[index].product_quantity;
        setProductFields(updatedFields);
    };

    const handleUnitPriceChange = (index, value) => {
        const updatedFields = [...productFields];
        const newUnitPrice = Number(value) || 0;
        updatedFields[index].unit_price = newUnitPrice;
        updatedFields[index].productPrice = newUnitPrice;
        updatedFields[index].subtotal =
            newUnitPrice * updatedFields[index].product_quantity;
        setProductFields(updatedFields);
    };

    const handleTaxChange = (index, value) => {
        const updatedFields = [...productFields];
        updatedFields[index].tax = Number(value) || 0;
        setProductFields(updatedFields);
    };

    const handleDiscountChange = (index, value) => {
        const updatedFields = [...productFields];
        updatedFields[index].discount = Number(value) || 0;
        setProductFields(updatedFields);
    };

    return {
        productFields,
        setProductFields,
        productSearchRef,
        handleProductSearch,
        handleAddProduct,
        handleRemoveProduct,
        handleQuantityChange,
        handlePriceChange,
        handleUnitPriceChange,
        handleTaxChange,
        handleDiscountChange,
    };
};