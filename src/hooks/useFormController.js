// src/hooks/useFormController.js
import { useTheme } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useFormController() {
    const navigate = useNavigate();

    // 🧭 Form-related states
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [productStatus, setProductStatus] = useState("active");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [expiryDateType, setExpiryDateType] = useState("fixed");
    const theme = useTheme();
    const [elevation, setElevation] = useState(1);

    // 📦 Table / List / UI control states
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sortDirection, setSortDirection] = useState("desc");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // 🧱 Modal open/close states
    const [unitOpen, setUnitOpen] = useState(false);
    const [brandOpen, setBrandOpen] = useState(false);
    const [supplierOpen, setSupplierOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [warehouseOpen, setWarehouseOpen] = useState(false);
    const [productTypeOpen, setproductTypeOpen] = useState(false);
    const [warrantyOpen, setWarrantyOpen] = useState(false);

    // 🧩 Modal handlers
    const handleWarrantyOpen = () => setWarrantyOpen(true);
    const handleWarrantyClose = () => setWarrantyOpen(false);

    const handleCategoryOpen = () => setCategoryOpen(true);
    const handleCategoryClose = () => setCategoryOpen(false);

    const handleBrandOpen = () => setBrandOpen(true);
    const handleBrandClose = () => setBrandOpen(false);

    const handleWarehouseOpen = () => setWarehouseOpen(true);
    const handleWarehouseClose = () => setWarehouseOpen(false);

    const handleProductTypeOpen = () => setproductTypeOpen(true);
    const handleProductTypeClose = () => setproductTypeOpen(false);

    const handleSupplierOpen = () => setSupplierOpen(true);
    const handleSupplierClose = () => setSupplierOpen(false);

    const handleUnitOpen = () => setUnitOpen(true);
    const handleUnitClose = () => setUnitOpen(false);

    return {
        // 🔹 Navigation
        navigate,

        // 🔹 Form States
        activeStep,
        setActiveStep,
        errors,
        setErrors,
        previewImage,
        setPreviewImage,
        selectedTags,
        setSelectedTags,
        productStatus,
        setProductStatus,
        submitting,
        setSubmitting,
        success,
        setSuccess,
        expiryDateType,
        setExpiryDateType,
        theme,
        elevation,
        setElevation,

        // 🔹 UI Control States (for List / Table)
        currentPage,
        setCurrentPage,
        search,
        setSearch,

        sortDirection,
        setSortDirection,
        filterCategory,
        setFilterCategory,
        filterStatus,
        setFilterStatus,


        // 🔹 Modal States
        unitOpen,
        brandOpen,
        supplierOpen,
        categoryOpen,
        warehouseOpen,
        productTypeOpen,
        warrantyOpen,

        // 🔹 Modal Handlers
        handleWarrantyOpen,
        handleWarrantyClose,
        handleCategoryOpen,
        handleCategoryClose,
        handleBrandOpen,
        handleBrandClose,
        handleWarehouseOpen,
        handleWarehouseClose,
        handleProductTypeOpen,
        handleProductTypeClose,
        handleSupplierOpen,
        handleSupplierClose,
        handleUnitOpen,
        handleUnitClose,
    };
}
