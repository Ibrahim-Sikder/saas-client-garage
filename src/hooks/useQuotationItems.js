/* eslint-disable no-unused-vars */
import { useState, } from "react";
import { useGetAllStocksQuery } from "../redux/api/stocksApi";
import { unitOptions } from "../utils/options";

export const useQuotationItems = (tenantDomain, filterType = "") => {
    const [items, setItems] = useState([
        {
            description: "",
            unit: "",
            quantity: "",
            rate: "",
            rateDisplay: "",
            total: "",
        },
    ]);

    const [serviceItems, setServiceItems] = useState([
        {
            description: "",
            unit: "",
            quantity: "",
            rate: "",
            rateDisplay: "",
            total: "",
        },
    ]);

    const [currentPage] = useState(1);
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const [activeInputType, setActiveInputType] = useState(null);
    const [activeInputIndex, setActiveInputIndex] = useState(null);

    const queryParams = {
        tenantDomain,
        page: currentPage,
        searchTerm: filterType,
        isRecycled: false,
    };

    const { data: stockData } = useGetAllStocksQuery(queryParams);

    // Item Management
    const handleAddItem = (type = "parts") => {
        const newItem = {
            description: "",
            unit: "",
            quantity: "",
            rate: "",
            rateDisplay: "",
            total: "",
        };

        if (type === "service") {
            setServiceItems(prev => [...prev, newItem]);
        } else {
            setItems(prev => [...prev, newItem]);
        }
    };

    const handleRemoveItem = (index, type = "parts") => {
        if (type === "service") {
            if (index === 0 && serviceItems.length === 1) {
                setServiceItems([{ description: "", unit: "", quantity: "", rate: "", rateDisplay: "", total: "" }]);
            } else {
                setServiceItems(prev => prev.filter((_, i) => i !== index));
            }
        } else {
            if (index === 0 && items.length === 1) {
                setItems([{ description: "", unit: "", quantity: "", rate: "", rateDisplay: "", total: "" }]);
            } else {
                setItems(prev => prev.filter((_, i) => i !== index));
            }
        }
    };

    // Field Change Handlers
    const handleFieldChange = (index, field, value, type = "parts") => {
        const setter = type === "service" ? setServiceItems : setItems;
        const itemsArray = type === "service" ? serviceItems : items;

        setter(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], [field]: value };

            // Recalculate total if quantity or rate changes
            if (field === "quantity" || field === "rate") {
                const quantity = field === "quantity" ?
                    (Number.parseFloat(value.replace(/[^0-9.]/g, "")) || 0) :
                    (Number.parseFloat(newItems[index].quantity) || 0);

                const rate = field === "rate" ?
                    (Number.parseFloat(value.replace(/[^0-9.]/g, "")) || 0) :
                    (Number.parseFloat(newItems[index].rate) || 0);

                newItems[index].total = Number.parseFloat((quantity * rate).toFixed(2));
            }

            return newItems;
        });
    };

    // Product Suggestions
    const filterProductSuggestions = (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2 || !stockData?.data) {
            setProductSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filteredProducts = stockData.data.filter((stock) =>
            stock.product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setProductSuggestions(filteredProducts);
        setShowSuggestions(filteredProducts.length > 0);
        setActiveSuggestionIndex(0);
    };

    const findMatchingUnit = (productUnit) => {
        if (!productUnit) return "Pcs";
        const unitValue = typeof productUnit === "object" ? productUnit.unit : productUnit;
        const shortName = typeof productUnit === "object" ? productUnit.short_name : null;

        const exactMatch = unitOptions.find(
            (option) =>
                option.value === unitValue ||
                option.label === unitValue ||
                (shortName && (option.value === shortName || option.label === shortName))
        );

        if (exactMatch) return exactMatch.value;

        const caseInsensitiveMatch = unitOptions.find(
            (option) =>
                option.value.toLowerCase() === unitValue?.toLowerCase() ||
                option.label.toLowerCase() === unitValue?.toLowerCase() ||
                (shortName && (option.value.toLowerCase() === shortName.toLowerCase() ||
                    option.label.toLowerCase() === shortName.toLowerCase()))
        );

        return caseInsensitiveMatch ? caseInsensitiveMatch.value : "Pcs";
    };

    const handleSelectSuggestion = (product, index, type = "parts") => {
        const productName = product.product?.product_name || "";
        const productPrice = Number(product.product?.sellingPrice) || 0;
        const productQuantity = product.stock || 1;
        const productUnit = findMatchingUnit(product.product?.unit);
        const total = productQuantity * productPrice;

        if (type === "service") {
            setServiceItems(prev => {
                const newItems = [...prev];
                newItems[index] = {
                    ...newItems[index],
                    description: productName,
                    unit: productUnit,
                    rate: productPrice,
                    rateDisplay: productPrice.toString(),
                    quantity: productQuantity.toString(),
                    total: total,
                    product: product.product._id,
                    warehouse: product.warehouse,
                    product_name: productName,
                    sellingPrice: productPrice,
                    batchNumber: product.batchNumber || "",
                };
                return newItems;
            });
        } else {
            setItems(prev => {
                const newItems = [...prev];
                newItems[index] = {
                    ...newItems[index],
                    description: productName,
                    unit: productUnit,
                    rate: productPrice,
                    rateDisplay: productPrice.toString(),
                    quantity: productQuantity.toString(),
                    total: total,
                    product: product.product._id,
                    warehouse: product.warehouse,
                    product_name: productName,
                    sellingPrice: productPrice,
                    batchNumber: product.batchNumber || "",
                };
                return newItems;
            });
        }
        setShowSuggestions(false);
    };

    const prepareItemsForSubmission = (itemsArray) => {
        return itemsArray.map((item) => {
            if (item.product && item.warehouse) {
                return item;
            } else {
                const { product, warehouse, product_name, sellingPrice, batchNumber, ...rest } = item;
                return rest;
            }
        });
    };

    return {
        // State
        items,
        setItems,
        serviceItems,
        setServiceItems,
        productSuggestions,
        showSuggestions,
        activeSuggestionIndex,
        activeInputType,
        activeInputIndex,

        // Setters
        setShowSuggestions,
        setActiveSuggestionIndex,
        setActiveInputType,
        setActiveInputIndex,

        // Functions
        handleAddItem,
        handleRemoveItem,
        handleFieldChange,
        filterProductSuggestions,
        handleSelectSuggestion,
        prepareItemsForSubmission,
    };
};