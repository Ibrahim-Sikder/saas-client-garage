/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useGetCompanyProfileQuery } from "@/redux/api/companyProfile";
import { useTenantDomain } from "@/useTenantDomain";
import { usePermissions } from "@/context/PermissionContext";

export const useQuotationForm = (mode = 'create') => {
    const [currentMileage, setCurrentMileage] = useState("");
    const [mileageChanged, setMileageChanged] = useState(false);
    const [countryCode, setCountryCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [goOtherButton, setGoOtherButton] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { tenantDomain } = useTenantDomain();
    const { performActionWithPermission } = usePermissions();

    const {
        register,
        handleSubmit,
        reset,
        setValue: setFormValue,
        formState: { errors },
    } = useForm();

    const { data: CompanyInfoData } = useGetCompanyProfileQuery({ tenantDomain });

    const companyProfileData = {
        companyName: CompanyInfoData?.data?.companyName,
        address: CompanyInfoData?.data?.address,
        website: CompanyInfoData?.data?.website,
        phone: CompanyInfoData?.data?.phone,
        email: CompanyInfoData?.data?.email,
        logo: CompanyInfoData?.data?.logo[0],
        companyNameBN: CompanyInfoData?.data?.companyNameBN,
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handlePhoneNumberChange = (e) => {
        const newPhoneNumber = e.target.value;
        if (
            /^\d*$/.test(newPhoneNumber) &&
            newPhoneNumber.length <= 10 &&
            (newPhoneNumber === "" ||
                !newPhoneNumber.startsWith("0") ||
                newPhoneNumber.length > 1)
        ) {
            setPhoneNumber(newPhoneNumber);
        }
    };

    const handleMileageChange = (e, existingMileageHistory = []) => {
        const newMileage = e.target.value;
        setCurrentMileage(newMileage);
        const lastMileage = existingMileageHistory?.slice(-1)[0]?.mileage;
        if (lastMileage && Number(newMileage) !== lastMileage) {
            setMileageChanged(true);
        } else if (!lastMileage && newMileage) {
            setMileageChanged(true);
        } else {
            setMileageChanged(false);
        }
    };

    const updateMileageHistory = (existingHistory, newMileageValue) => {
        const updatedHistory = [...(existingHistory || [])];

        if (mileageChanged && !isNaN(newMileageValue) && newMileageValue > 0) {
            const mileageExists = updatedHistory.some(
                (entry) => entry.mileage === newMileageValue
            );
            if (!mileageExists) {
                updatedHistory.push({
                    mileage: newMileageValue,
                    date: new Date().toISOString(),
                });
            }
        }
        return updatedHistory;
    };

    return {
        // State
        currentMileage,
        setCurrentMileage,
        mileageChanged,
        setMileageChanged,
        countryCode,
        setCountryCode,
        phoneNumber,
        setPhoneNumber,
        selectedDate,
        setSelectedDate,
        goOtherButton,
        setGoOtherButton,

        // Navigation
        navigate,
        location,
        tenantDomain,

        // Form
        register,
        handleSubmit,
        reset,
        setFormValue,
        errors,

        // Company Data
        companyProfileData,
        CompanyInfoData,

        // Permission
        performActionWithPermission,

        // Helper Functions
        formatDate,
        handlePhoneNumberChange,
        handleMileageChange,
        updateMileageHistory,
    };
};