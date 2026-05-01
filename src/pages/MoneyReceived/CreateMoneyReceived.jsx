"use client";

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */

import "./MoneyReceived.css";
import { ArrowBack, Email, WhatsApp } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { FaGlobe } from "react-icons/fa";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FaLocationDot } from "react-icons/fa6";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { usePermissions } from "../../context/PermissionContext";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import { useCreateMoneyReceiptMutation } from "../../redux/api/money-receipt";
import { useGetSingleJobCardWithJobNoQuery } from "../../redux/api/jobCard";
import MoneyReceiptTable from "./MoneyReceiptTable";
import Can from "../../components/Can";

const formatBangladeshiNumber = (num) => {
  if (!num) return "";

  // Convert to string and handle potential commas already in the input
  const numStr = num.toString().replace(/,/g, "");

  // Split the number into integer and decimal parts
  const parts = numStr.split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? "." + parts[1] : "";

  // Format the integer part with commas
  let formattedInteger = "";

  // Handle the first group (rightmost 3 digits)
  if (integerPart.length > 3) {
    formattedInteger = "," + integerPart.substring(integerPart.length - 3);
    integerPart = integerPart.substring(0, integerPart.length - 3);
  } else {
    formattedInteger = integerPart;
    integerPart = "";
  }

  // Handle the remaining groups (2 digits each)
  while (integerPart.length > 0) {
    const groupSize = Math.min(2, integerPart.length);
    const group = integerPart.substring(integerPart.length - groupSize);
    formattedInteger = "," + group + formattedInteger;
    integerPart = integerPart.substring(0, integerPart.length - groupSize);
  }

  // Remove leading comma if present
  if (formattedInteger.startsWith(",")) {
    formattedInteger = formattedInteger.substring(1);
  }

  return formattedInteger + decimalPart;
};

// Function to parse formatted number back to numeric value
const parseFormattedNumber = (formattedNum) => {
  if (!formattedNum) return 0;
  return Number.parseFloat(formattedNum.toString().replace(/,/g, ""));
};

const CreateMoneyReceived = () => {
  const location = useLocation();
  const jobNo = new URLSearchParams(location.search).get("order_no");
  const net_total = new URLSearchParams(location.search).get("net_total");
  const { tenantDomain } = useTenantDomain();

  const parsedDate = new Date();
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = parsedDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  const { performActionWithPermission } = usePermissions();

  const [advance, setAdvance] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalAmount, setTotalAmount] = useState(net_total ? net_total : null);
  const [formattedTotalAmount, setFormattedTotalAmount] = useState("");
  const [formattedAdvance, setFormattedAdvance] = useState("");
  const [formattedRemaining, setFormattedRemaining] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [preview, setPreview] = useState("");

  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_method: "Bkash",
      against_bill_no_method: "Advance against bill no",
    },
  });

  const bill = watch("against_bill_no_method");
  const payment_method = watch("payment_method");

  const [job_no, setJob_no] = useState(jobNo);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [billNo, setBillNo] = useState("Final payment against bill no");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();
  // const limit = 10;

  const [createMoneyReceipt, { isLoading: createLoading }] =
    useCreateMoneyReceiptMutation();

  const { data: jobCard, isLoading } = useGetSingleJobCardWithJobNoQuery({
    tenantDomain,
    jobNo: job_no,
  });

  const amountInWords = (amount) => {
    const numberWords = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tensWords = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const convertLessThanOneThousand = (num) => {
      if (num === 0) {
        return "";
      }

      let result = "";

      if (num >= 100) {
        result += numberWords[Math.floor(num / 100)] + " Hundred ";
        num %= 100;
      }

      if (num >= 20) {
        result += tensWords[Math.floor(num / 10)] + " ";
        num %= 10;
      }

      if (num > 0) {
        result += numberWords[num] + " ";
      }

      return result;
    };

    const convert = (num) => {
      if (num === 0) {
        return "Zero";
      }

      let result = "";

      let integerPart = Math.floor(num);
      const decimalPart = Math.round((num - integerPart) * 100);

      if (integerPart >= 10000000) {
        result +=
          convertLessThanOneThousand(Math.floor(integerPart / 10000000)) +
          "Crore ";
        integerPart %= 10000000;
      }

      if (integerPart >= 100000) {
        result +=
          convertLessThanOneThousand(Math.floor(integerPart / 100000)) +
          "Lakh ";
        integerPart %= 100000;
      }

      if (integerPart >= 1000) {
        result +=
          convertLessThanOneThousand(Math.floor(integerPart / 1000)) +
          "Thousand ";
        integerPart %= 1000;
      }

      result += convertLessThanOneThousand(integerPart);

      if (decimalPart > 0) {
        result +=
          "Taka " +
          " " +
          "and" +
          " " +
          convertLessThanOneThousand(decimalPart) +
          "Paisa ";
      } else {
        result += "Taka";
      }

      return result;
    };

    const takaInWords = convert(parseFormattedNumber(amount));
    return `${takaInWords} only`;
  };

  const totalAmountInWords = amountInWords(advance ? advance : remaining);

  // Update formatted values whenever the numeric values change
  useEffect(() => {
    setFormattedAdvance(formatBangladeshiNumber(advance));
    setFormattedRemaining(formatBangladeshiNumber(remaining));
  }, [advance, remaining]);

  useEffect(() => {
    if (
      !isNaN(parseFormattedNumber(totalAmount)) &&
      !isNaN(parseFormattedNumber(advance))
    ) {
      const numTotalAmount = parseFormattedNumber(totalAmount);
      const numAdvance = parseFormattedNumber(advance);
      const newRemaining = numTotalAmount - numAdvance;
      setRemaining(newRemaining);
      setFormattedRemaining(formatBangladeshiNumber(newRemaining));
    }
  }, [totalAmount, advance]);

  useEffect(() => {
    if (typeof totalAmount === "string") {
      const numericValue = parseFormattedNumber(totalAmount);
      setRemaining(numericValue);
      setFormattedRemaining(formatBangladeshiNumber(numericValue));
    }
  }, [totalAmount]);

  // Format total amount when it's first loaded
  useEffect(() => {
    if (totalAmount) {
      setFormattedTotalAmount(formatBangladeshiNumber(totalAmount));
    }
  }, []);

  useEffect(() => {
    if (jobCard?.data?.date) {
      setSelectedDate(jobCard?.data?.date);
    } else {
      setSelectedDate(formattedDate);
    }
  }, [formattedDate, jobCard?.data?.date]);

  useEffect(() => {
    if (jobCard?.data && !isLoading) {
      reset({
        // default_date: jobCard?.data?.default_date,
        job_no: jobCard?.data?.job_no,
        vehicle_no: jobCard?.data?.vehicle?.fullRegNum,
      });
    }
  }, [isLoading, jobCard?.data, reset]);

  const formatDate = (dateString) => {
    const parsedDate = new Date(dateString);
    const day = parsedDate.getDate().toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const onSubmit = async (data) => {
    performActionWithPermission('/dashboard/money-receive-create', 'create',
      async () => {
        // Parse the formatted values back to numbers for submission
        const numTotalAmount = parseFormattedNumber(totalAmount);
        const numAdvance = parseFormattedNumber(advance);
        const numRemaining = parseFormattedNumber(remaining);

        if (numTotalAmount < 1) {
          toast.error(
            "The total payment amount exceeds the remaining balance. This money receipt cannot be created due to insufficient funds."
          );
          return;
        }
        const toastId = toast.loading("Creating Money Receipt...");
        const dateTwo = formatDate(data.payment_date);
        const checkDate = formatDate(data.check_date);

        // Use the numeric values for submission
        data.total_amount = numTotalAmount;
        data.advance = numAdvance;
        data.remaining = numRemaining;

        const values = {
          tenantDomain,
          Id: jobCard?.data?.Id,
          user_type: jobCard?.data?.user_type,
          job_no: job_no,
          default_date: data?.default_date,
          thanks_from: data.thanks_from,
          against_bill_no_method: data.against_bill_no_method,
          vehicle_no: data.vehicle_no,
          chassis_no: jobCard?.data?.vehicle?.chassis_no,
          cash_by: data.cash_by,
          payment_method: data.payment_method,
          account_number: data.account_number,
          transaction_id: data.transaction_id,
          check_number: data.check_number,
          bank_name: data.bank_name,
          date: data.date,
          check_date: checkDate,
          payment_date: dateTwo,
          total_amount: data.total_amount,
          advance:
            data.against_bill_no_method === "Final payment against bill no"
              ? Number(data.total_amount)
              : Number(data.advance),
          remaining:
            data.against_bill_no_method === "Advance against bill no"
              ? numRemaining
              : 0 || 0,
          taka_in_word: totalAmountInWords,
        };

        try {
          const response = await createMoneyReceipt(values).unwrap();
          if (response.success) {
            toast.success(response.message);
            if (preview === "preview") {
              navigate(`/dashboard/money-receipt-view?id=${response?.data?._id}`);
              setPreview("");
            } else {
              navigate("/dashboard/money-receipt-list");
              setPreview("");
            }
          }
        } catch (error) {
          toast.error(error?.message);
        } finally {
          toast.dismiss(toastId);
        }

      }, "Yout don't have permission to create money receive !"
    )
  };

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleChange2 = (event) => {
    setBillNo(event.target.value);
  };

  const handleTotalAmount = (value) => {
    // Store the raw value for calculations
    const numericValue = parseFormattedNumber(value);
    setTotalAmount(numericValue);

    // Format for display
    setFormattedTotalAmount(formatBangladeshiNumber(numericValue));

    // Update remaining
    setRemaining(numericValue);
    setFormattedRemaining(formatBangladeshiNumber(numericValue));
  };

  const handleAdvanceChange = (value) => {
    // Store the raw value for calculations
    const numericValue = parseFormattedNumber(value);
    setAdvance(numericValue);

    // Format for display
    setFormattedAdvance(formatBangladeshiNumber(numericValue));

    // Update remaining
    if (!isNaN(parseFormattedNumber(totalAmount))) {
      const newRemaining = parseFormattedNumber(totalAmount) - numericValue;
      setRemaining(newRemaining);
      setFormattedRemaining(formatBangladeshiNumber(newRemaining));
    }
  };

  const buttonStyle = {
    color: "white",
    borderRadius: "20px",
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-3 md:mt-5 ">
        <Button
          onClick={handleBack}
          startIcon={<ArrowBack />}
          sx={{ mr: 2, color: "#fff", borderRadius: 5 }}
        >
          Back
        </Button>
      </div>

      <div className="md:w-[1300px] p-2 md:p-5 border border-black rounded-[5px] m-[30px] mx-auto ">
        <div className="flex items-center justify-between flex-col lg:flex-row gap-3  ">
          <div className="w-[130px] md:w-[175px]">
            <img className="" src={CompanyInfoData?.data?.logo} alt="logo" />
          </div>
          <div className="md:w-[570px] text-center text-[#0950a1]  ">
            <div className="flex-1 text-center">
              <h2 className="text-3xl">
                {CompanyInfoData?.data?.companyNameBN}
              </h2>
              <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold">
                ({CompanyInfoData?.data?.companyName})
              </h3>
            </div>
            <span className="block mt-2">
              It's trusted computerized Organization for all kinds of vehicle
              cheque up & maintenance such as computerized Engine Analysis,
              Engine tune up, Denting, Painting, Engine, AC, Electrical Works &
              Car Wash.{" "}
            </span>
          </div>

          <div>
            <div className="flex items-center mt-1">
              <FaGlobe className="hotlineIcon" />
              <small className="ml-1">{CompanyInfoData?.data?.website}</small>
            </div>
            <div className="flex items-center mt-1">
              <Email className="hotlineIcon" />
              <small className="ml-1">{CompanyInfoData?.data?.email}</small>
            </div>
            <div className="flex  mt-1">
              <FaLocationDot className="hotlineIcon"> </FaLocationDot>
              <small className="ml-1">{CompanyInfoData?.data?.address}</small>
            </div>
            <div className="flex items-center mt-1">
              <WhatsApp className="hotlineIcon" />
              <small className="ml-1">+88 01710-700324</small>
            </div>
          </div>
        </div>

        <div className="receivedBtn md:mt-0 mt-5">
          <Button>Receipt</Button>
        </div>
        <div className="flex justify-center md:justify-end mt-5 md:mt-0 items-center lg:mt-0  mb-5">
          <input
            {...register("default_date", { required: true })}
            className="border p-2 rounded-md"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mt-3 receivedField">
            <label className="receivedMoneyText">
              Received with thanks from{" "}
            </label>
            <div>
              <input
                {...register("thanks_from", { required: true })}
                className="moneyViewInputField receiptInput"
                type="text"
                autoComplete="off"
                defaultValue={
                  jobCard?.data?.customer?.customer_name ||
                  jobCard?.data?.company?.company_name ||
                  jobCard?.data?.showRoom?.showRoom_name
                }
              />
              {errors.thanks_from && (
                <span className="text-sm text-red-400">
                  This field is required
                </span>
              )}
            </div>
          </div>
          <div className="mt-5 lg:flex-row  flex flex-col gap-4 ">
            <div className="flex flex-wrap xl:flex-nowrap gap-2 xl:gap-0 ">
              <FormControl
                sx={{
                  minWidth: 170,
                  minHeight: "30px",
                  marginRight: 0.5,
                  backgroundColor: "#D9D9D9",
                }}
                size="small"
              >
                <InputLabel id="demo-select-small-label">
                  Against bill no
                </InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="Against bill no"
                  onChange={handleChange2}
                  {...register("against_bill_no_method", { required: true })}
                >
                  <MenuItem value="Final payment against bill no">
                    Final payment against bill no
                  </MenuItem>
                  <MenuItem value="Advance against bill no">
                    Advance against bill no
                  </MenuItem>
                </Select>
              </FormControl>
              <div>
                <input
                  {...register("job_no", { required: true })}
                  className="moneyViewInputField advanceInput "
                  onChange={(e) => setJob_no(e.target.value)}
                  autoComplete="off"
                  placeholder="Job No"
                />
                {errors.against_bill_no && job_no === null && (
                  <span className="text-sm text-red-400">
                    This field is required
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="flex mt-1 md:mt-6 receivedField lg:mt-0">
                <label className="vehicleText">Vehicle No: </label>
                <input
                  {...register("vehicle_no", { required: true })}
                  className=" moneyViewInputField advanceInput"
                  type="text"
                  autoComplete="off"
                  defaultValue={jobCard?.data?.fullRegNum}
                />
                <br />
              </div>
              {errors.vehicle_no && (
                <span className="text-sm text-red-400 ml-24">
                  This field is required
                </span>
              )}
            </div>
          </div>
          <div className="md:mt-5 payAdvance flex-wrap lg:flex-row flex flex-col gap-4">
            <div className="flex flex-wrap xl:flex-row flex-col gap-2 xl:gap-0  ">
              <FormControl
                sx={{
                  minWidth: 170,
                  minHeight: "30px",
                  marginRight: 0.5,
                  backgroundColor: "#D9D9D9",
                }}
                size="small"
              >
                <InputLabel id="demo-select-small-label">
                  Payment Method
                </InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={payment_method}
                  label="Payment Method "
                  onChange={handleChange}
                  {...register("payment_method", { required: true })}
                >
                  <MenuItem value="Bkash">Bkash</MenuItem>
                  <MenuItem value="Nagad">Nagad</MenuItem>
                  <MenuItem value="Rocket">Rocket</MenuItem>
                  <MenuItem value="Check">Cheque</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
              {payment_method === "Bkash" ||
                payment_method === "Nagad" ||
                payment_method === "Rocket" ? (
                <div className="flex  gap-2 flex-wrap xl:flex-nowrap items-center ">
                  <div>
                    <input
                      {...register("account_number", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Account Number"
                    />
                    {errors.account_number && (
                      <span className="text-sm text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("transaction_id", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Transaction ID "
                    />
                    {errors.transaction_id && (
                      <span className="text-sm text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="flex  mt-6 receivedField md:mt-0">
                    <b className="md:mr-2 "> Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        autoComplete="off"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                      {errors.date && (
                        <span className="text-sm text-red-400">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : payment_method === "Check" ? (
                <div className=" ">
                  <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-0  items-center">
                    <div>
                      <input
                        {...register("check_number", { required: true })}
                        className="cashInput moneyViewInputField"
                        type="text"
                        autoComplete="off"
                        placeholder="Cheque Number"
                      />
                      {errors.check_number && (
                        <span className="text-sm text-red-400">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div>
                      <input
                        {...register("bank_name", { required: true })}
                        className="cashInput moneyViewInputField"
                        type="text"
                        autoComplete="off"
                        placeholder="Bank Name"
                      />
                      {errors.bank_name && (
                        <span className="text-sm text-red-400">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : payment_method === "Bank Transfer" ? (
                <div className="flex items-center  flex-wrap xl:flex-nowrap gap-2 xl:gap-0 ">
                  <div>
                    <input
                      {...register("account_number", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Account Number"
                    />
                    {errors.account_number && (
                      <span className="text-sm text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      {...register("transaction_id", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Transaction ID"
                    />
                    {errors.transaction_id && (
                      <span className="text-sm text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="flex mt-6 receivedField md:mt-0">
                    <b className="mr-2 date2">Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        autoComplete="off"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                      {errors.date && (
                        <span className="text-sm text-red-400">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : payment_method === "Cash" ? (
                <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-0 items-center ">
                  <div>
                    <input
                      {...register("cash_by", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Cash By"
                    />
                    {errors.transaction_id && (
                      <span className="text-sm text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="flex receivedField md:mt-0">
                    <b className="mr-2 date2"> Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                      {errors.date && (
                        <span className="text-sm text-red-400">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : payment_method === "Other" ? (
                <div className="flex flex-wrap xl:flex-nowrap gap-2 xl:gap-0 items-center ">
                  <div>
                    <input
                      {...register("other", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Other"
                    />
                    {errors.transaction_id && (
                      <span className="text-sm text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="flex receivedField ">
                    <b className="mr-2 date2"> Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                      {errors.date && (
                        <span className="text-sm text-red-400">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="md:mt-5 payAdvance  lg:flex-row sm:flex flex-col md:gap-4">
            {payment_method === "Check" ? (
              <div className="flex flex-wrap xl:flex-nowrap items-center gap-2 xl:gap-0 ">
                <div className="flex mt-2  receivedField md:mt-0">
                  <b className="mr-2 ">Cheque Date: </b>
                  <div>
                    <input
                      {...register("check_date")}
                      className="cashInput moneyViewInputField cursor-pointer"
                      type="date"
                      autoComplete="off"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                </div>
                <div className="flex receivedField">
                  <b className="addPaymentDate">Payment Date:</b>
                  <div>
                    <input
                      {...register("payment_date")}
                      className=" moneyViewInputField bankInput"
                      type="date"
                      autoComplete="off"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-5 amount2 xl:flex-row sm:flex flex-col gap-4">
            <div className="flex flex-wrap xl:flex-nowrap gap-2 md:gap-0  items-center">
              <div className="flex lg:flex-row  flex-col">
                <label className="totalAmountText2">Total Amount Tk:</label>
                <div>
                  <input
                    {...register("total_amount", { required: true })}
                    className="moneyViewInputField totalAmountInput"
                    type="text"
                    onChange={(e) => handleTotalAmount(e.target.value)}
                    value={formattedTotalAmount || ""}
                  />

                  {errors.total_amount && totalAmount === null && (
                    <span className="text-sm text-red-400">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
            </div>
            {bill === "Advance against bill no" ? (
              <>
                <div className="flex lg:flex-row  flex-col">
                  <label>Advance:</label>
                  <div>
                    <input
                      {...register("advance")}
                      className="moneyViewInputField totalAmountInput"
                      type="text"
                      value={formattedAdvance}
                      onChange={(e) => handleAdvanceChange(e.target.value)}
                    />

                  </div>
                </div>
                <div className="flex lg:flex-row  flex-col ">
                  <label>Remaining:</label>
                  <input
                    {...register("remaining")}
                    className="moneyViewInputField totalAmountInput"
                    type="text"
                    value={formattedRemaining}
                    readOnly
                  />
                </div>
              </>
            ) : null}
          </div>
          <div className="mt-5 wordTaka">
            <label>in word (taka) </label>
            {totalAmountInWords}
          </div>

          <div className="my-5 receivedBtn">

            <Can page='/dashboard/money-receive-create' action='create'>
              <Button type="submit" disabled={createLoading}>
                Submit
              </Button>
            </Can>
          </div>
          <div className="gap-2 hidden md:block ">
            <Button
              type="submit"
              sx={buttonStyle}
              onClick={() => setPreview("preview")}
            >
              Preview
            </Button>
          </div>
        </form>

        <div>
          <small className="signature">Authorized Signature</small>
        </div>
      </div>

      <MoneyReceiptTable />
    </>
  );
};

export default CreateMoneyReceived;
