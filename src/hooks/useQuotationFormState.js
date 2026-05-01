/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { countries } from "../constant";

export const useQuotationFormState = (mode) => {
  const isEditMode = mode === "edit";
  const location = useLocation();
  const job_no = new URLSearchParams(location.search).get("order_no");
  const id = new URLSearchParams(location.search).get("id");

  const [getDataWithChassisNo, setGetDataWithChassisNo] = useState({});
  const [orderNumber, setOrderNumber] = useState(job_no);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);

  const [items, setItems] = useState([createEmptyItem()]);
  const [serviceItems, setServiceItems] = useState([createEmptyItem()]);

  const [filterType, setFilterType] = useState("");
  const [goOtherButton, setGoOtherButton] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [activeInputType, setActiveInputType] = useState(null);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [addButton, setAddButton] = useState(false);
  const [serviceAddButton, setServiceAddButton] = useState(false);

  const partsDiscountRef = useRef(null);
  const netTotalAmountRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue: setFormValue,
    formState: { errors },
  } = useForm();

  return {
    isEditMode,
    id,
    job_no,
    orderNumber,
    getDataWithChassisNo,
    setGetDataWithChassisNo,
    selectedDate,
    setSelectedDate,
    countryCode,
    setCountryCode,
    phoneNumber,
    setPhoneNumber,
    currentMileage,
    setCurrentMileage,
    mileageChanged,
    setMileageChanged,
    items,
    setItems,
    serviceItems,
    setServiceItems,
    filterType,
    setFilterType,
    goOtherButton,
    setGoOtherButton,
    productSuggestions,
    setProductSuggestions,
    showSuggestions,
    setShowSuggestions,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    activeInputType,
    setActiveInputType,
    activeInputIndex,
    setActiveInputIndex,
    addButton,
    setAddButton,
    serviceAddButton,
    setServiceAddButton,

    register,
    handleSubmit,
    reset,
    setFormValue,
    errors,

    partsDiscountRef,
    netTotalAmountRef,
  };
};

function createEmptyItem() {
  return {
    description: "",
    unit: "",
    quantity: "",
    rate: "",
    rateDisplay: "",
    total: "",
  };
}
