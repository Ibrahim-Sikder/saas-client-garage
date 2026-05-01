/* eslint-disable no-self-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import "./MoneyReceived.css";
import { ArrowBack, Email, WhatsApp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FaGlobe } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import { HiOutlineUserGroup } from "react-icons/hi";
import { usePermissions } from "../../context/PermissionContext";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { useGetSingleMoneyReceiptQuery, useUpdateMoneyReceiptMutation } from "../../redux/api/money-receipt";
import { useGetCompanyProfileQuery } from "../../redux/api/companyProfile";
import Can from "../../components/Can";


const UpdateMoneyReceipt = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain } = useTenantDomain();
  const { performActionWithPermission } = usePermissions();

  const userTypeFromProfile = new URLSearchParams(location.search).get(
    "user_type"
  );
  const userFromProfile = new URLSearchParams(location.search).get("user");
  const { origin } = location.state || {};
  const { data: singleMoneyReceipt, refetch } = useGetSingleMoneyReceiptQuery({
    tenantDomain,
    id,
  });

  const [updateMoneyReceipt, { isLoading: updateLoading, error: updateError }] =
    useUpdateMoneyReceiptMutation();

  const [advance, setAdvance] = useState(singleMoneyReceipt?.data?.advance);
  const [remaining, setRemaining] = useState(
    singleMoneyReceipt?.data?.remaining
  );
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [billNo, setBillNo] = useState("Final Payment against bill no");

  const [totalAmount, setTotalAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

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
  const navigate = useNavigate();

  const bill = watch("against_bill_no_method");
  const payment_method = watch("payment_method");

  useEffect(() => {
    if (singleMoneyReceipt?.data?.default_date) {
      setSelectedDate(singleMoneyReceipt?.data?.default_date);
    }
  }, [singleMoneyReceipt?.data?.default_date]);

  const formatDateForInput = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const defaultDateOne = formatDateForInput(
    singleMoneyReceipt?.data?.date || ""
  );
  const defaultDateTwo = formatDateForInput(
    singleMoneyReceipt?.data?.payment_date || ""
  );
  const defaultCheckDate = formatDateForInput(
    singleMoneyReceipt?.data?.check_date || ""
  );

  useEffect(() => {
    reset({
      Id: singleMoneyReceipt?.data?.Id,
      job_no: singleMoneyReceipt?.data?.job_no,
      default_date: selectedDate || singleMoneyReceipt?.data?.default_date,

      advance_select: singleMoneyReceipt?.data?.advance_select,
      final_payment: singleMoneyReceipt?.data?.final_payment,

      thanks_from: singleMoneyReceipt?.data?.thanks_from,
      against_bill_no_method: singleMoneyReceipt?.data?.against_bill_no_method,
      vehicle_no: singleMoneyReceipt?.data?.vehicle?.fullRegNum,

      payment_method: singleMoneyReceipt?.data?.payment_method,
      account_number: singleMoneyReceipt?.data?.account_number,
      transaction_id: singleMoneyReceipt?.data?.transaction_id,

      check_number: singleMoneyReceipt?.data?.check_number,
      bank_name: singleMoneyReceipt?.data?.bank_name,
      date: defaultDateOne,
      check_date: defaultCheckDate,
      payment_date: defaultDateTwo,
      total_amount: singleMoneyReceipt?.data?.total_amount,
      advance: singleMoneyReceipt?.data?.advance,
      remaining: singleMoneyReceipt?.data?.remaining,
      taka_in_word: singleMoneyReceipt?.data?.taka_in_word,
    });
  }, [
    defaultCheckDate,
    defaultDateOne,
    defaultDateTwo,
    reset,
    selectedDate,
    singleMoneyReceipt?.data?.Id,
    singleMoneyReceipt?.data?.account_number,
    singleMoneyReceipt?.data?.advance,
    singleMoneyReceipt?.data?.advance_select,
    singleMoneyReceipt?.data?.against_bill_no_method,
    singleMoneyReceipt?.data?.bank_name,
    singleMoneyReceipt?.data?.check_number,
    singleMoneyReceipt?.data?.default_date,
    singleMoneyReceipt?.data?.final_payment,
    singleMoneyReceipt?.data?.job_no,
    singleMoneyReceipt?.data?.payment_method,
    singleMoneyReceipt?.data?.remaining,
    singleMoneyReceipt?.data?.taka_in_word,
    singleMoneyReceipt?.data?.thanks_from,
    singleMoneyReceipt?.data?.total_amount,
    singleMoneyReceipt?.data?.transaction_id,
    singleMoneyReceipt?.data?.vehicle?.fullRegNum,
  ]);

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

    const takaInWords = convert(amount);
    return `${takaInWords} only`;
  };

  const totalAmountInWords = amountInWords(advance ? advance : remaining);


  useEffect(() => {
    if (typeof totalAmount === "string") {
      const cleanedValue = totalAmount.replace(/,/g, "");
      setTotalAmount(cleanedValue);
      setRemaining(cleanedValue);
    }
  }, [totalAmount]);

  const getRemaining = () => {
    if (!isNaN(totalAmount) && totalAmount && !isNaN(advance) && advance) {
      const remaining = totalAmount - advance;
      return remaining;
    }

    if (totalAmount === "" && advance) {
      if (typeof singleMoneyReceipt?.data?.total_amount === "string") {
        const cleanedValue = singleMoneyReceipt?.data?.total_amount.replace(
          /,/g,
          ""
        );
        const remaining = cleanedValue - advance;
        return remaining;
      }
    }
    if (totalAmount && advance === "") {
      const remaining = totalAmount - singleMoneyReceipt?.data?.advance;
      return remaining;
    }
  };

  const onSubmit = async (data) => {
    performActionWithPermission('/dashboard/', 'edit',
      async () => {
        const toastId = toast.loading("Updating Money Reciept...");
        if (typeof data.total_amount === "string") {
          const cleanedValue = data.total_amount.replace(/,/g, "");
          data.total_amount = Number(cleanedValue);
        }
        if (typeof data.remaining === "string") {
          const cleanedValue = data.remaining.replace(/,/g, "");
          data.remaining = Number(cleanedValue);
        }

        const dateOne = formatDate(data.date);
        const dateTwo = formatDate(data.payment_date);
        const checkDate = formatDate(data.check_date);

        data.default_date = selectedDate || singleMoneyReceipt?.data?.default_date;
        data.payment_method = data.payment_method;

        data.date = dateOne;
        data.check_date = checkDate;
        data.payment_date = dateTwo;

        data.advance = Number(data.advance);
        data.remaining = remaining || getRemaining();

        data.taka_in_word =
          totalAmountInWords || singleMoneyReceipt?.data?.taka_in_word;

        try {
          const values = {
            tenantDomain,
            id,
            data,
          };
          const res = await updateMoneyReceipt(values).unwrap();
        } catch (error) {
          toast.error(error.message);
        } finally {
          toast.dismiss(toastId);
        }
      }, "You don't have permission to edit money receive !"
    )
  };

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleTotalAmount = (value) => {
    setTotalAmount(value);
    setRemaining(value);
  };

  const handleChange2 = (event) => {
    setBillNo(event.target.value);
  };
  const buttonStyle = {
    color: "white",
    borderRadius: "20px",
  };

  const handleOnSubmit = () => {
    handleSubmit(onSubmit)();
    refetch();

    if (!userTypeFromProfile) {
      navigate("/dashboard/money-receipt-list");
    }
    if (userTypeFromProfile === "company") {
      navigate(`/dashboard/company-profile?id=${userFromProfile}`);
    }
    if (userTypeFromProfile === "customer") {
      navigate(`/dashboard/customer-profile?id=${userFromProfile}`);
    }
    if (userTypeFromProfile === "showRoom") {
      navigate(`/dashboard/show-room-profile?id=${userFromProfile}`);
    }

    toast.success("Money receipt update successful");
  };

  const handlePreview = () => {
    handleSubmit(onSubmit)();
    refetch();
    navigate(`/dashboard/money-receipt-view?id=${id}`);
  };

  const [formattedDate, setFormattedDate] = useState("");
  const [formattedDate2, setFormattedDate2] = useState("");

  useEffect(() => {
    if (singleMoneyReceipt?.data?.default_date) {
      setFormattedDate(formatDate(singleMoneyReceipt?.data?.default_date));
    }
  }, [singleMoneyReceipt]);
  useEffect(() => {
    if (singleMoneyReceipt?.data?.date) {
      setFormattedDate2(formatDat2(singleMoneyReceipt?.data?.date));
    }
  }, [singleMoneyReceipt]);

  function formatDate(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  function formatDat2(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="flex flex-wrap items-center mt-5 ">
        <Button
          onClick={handleBack}
          startIcon={<ArrowBack />}
          sx={{ mr: 2, color: "#fff" }}
        >
          Back
        </Button>
        <HiOutlineUserGroup className="invoicIcon" />
      </div>
      <div className="moneyReceptWrap ">
        <div className="flex items-center justify-between flex-col lg:flex-row gap-3 ">
          <div className="logoWrap ">
            <img className="" src={CompanyInfoData?.data?.logo} alt="logo" />
          </div>
          <div className="moneyHead ">
            <div className="flex-1 text-center">
              <h2 className="text-3xl">
                {CompanyInfoData?.data?.companyNameBN}
              </h2>
              <h3 className="text-lg md:text-xl english-font mt-1 text-[#4671A1] font-bold">
                ({CompanyInfoData?.data?.companyName})
              </h3>
            </div>
            <small className="block mt-2">
              It's trusted computerized Organization for all kinds of vehicle
              check up & maintenance such as computerized Engine Analysis,
              Engine tune up, Denting, Painting, Engine, AC, Electrical Works &
              Car Wash.{" "}
            </small>
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
              <small className="ml-1">{CompanyInfoData?.data?.phone}</small>
            </div>
          </div>
        </div>
        <div className="receivedBtn">
          <Button>Receipt</Button>
        </div>
        <div className="flex justify-end mt-5 md:mt-0">
          <b className="flex gap-x-2">
            <input
              {...register("default_date", { required: true })}
              className="border p-2 rounded-sm"
              type="date"
              defaultValue={singleMoneyReceipt?.data?.default_date}
            />
          </b>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mt-3 receivedField">
            <label className="receivedMoneyText">
              Received with thanks from
            </label>
            <div>
              <input
                {...register("thanks_from", { required: true })}
                className="moneyViewInputField receiptInput"
                type="text"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="mt-5 lg:flex-row  flex flex-col gap-4 ">
            <div className="flex f ">
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
                  defaultValue={bill}
                  value={bill}
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
                  // type="number"
                  // onChange={(e) => setJob_no(e.target.value)}
                  autoComplete="off"
                  readOnly
                />
              </div>
            </div>
            <div>
              <div className="flex mt-12 md:mt-6 receivedField lg:mt-0">
                <label className="vehicleText">Vehicle No: </label>
                <input
                  {...register("vehicle_no", { required: true })}
                  className=" moneyViewInputField advanceInput"
                  type="text"
                  autoComplete="off"
                  readOnly
                />
                <br />
              </div>
            </div>
          </div>
          <div className="mt-5 payAdvance lg:flex-row flex flex-col gap-4">
            <div className="flex lg:flex-row flex-col ">
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
                  label="Payment Method"
                  onChange={handleChange}
                  {...register("payment_method", { required: true })}
                >
                  <MenuItem value="Bkash">Bkash</MenuItem>
                  <MenuItem value="Nagad">Nagad</MenuItem>
                  <MenuItem value="Nagad">Rocket</MenuItem>
                  <MenuItem value="Check">Check</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {payment_method === "Bkash" ||
                payment_method === "Nagad" ||
                payment_method === "Rocket" ? (
                <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-0 mt-3 md:mt-0 items-center ">
                  <div>
                    <input
                      {...register("account_number", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Account Number"
                    />
                  </div>
                  <div>
                    <input
                      {...register("transaction_id", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Transaction Id "
                    />
                  </div>
                  <div className="flex mt-6 receivedField md:mt-0">
                    <b className="mr-2 date2">Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        value={formattedDate2}
                        onChange={(e) => setFormattedDate2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : payment_method === "Check" ? (
                <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-0 items-center ">
                  <div>
                    <input
                      {...register("check_number", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Check Number"
                    />
                  </div>
                  <div>
                    <input
                      {...register("bank_name", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Bank Name"
                    />
                  </div>
                </div>
              ) : payment_method === "Bank Transfer" ? (
                <div className="flex mt-3 md:mt-0 flex-wrap md:flex-nowrap gap-2 md:gap-0 items-center ">
                  <div>
                    <input
                      {...register("account_number", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Account Number"
                    />
                  </div>
                  <div>
                    <input
                      {...register("transaction_id", { required: true })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Transaction ID"
                    />
                  </div>
                  <div className="flex mt-6 receivedField md:mt-0">
                    <b className="mr-2 date2">Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        value={formattedDate2}
                        onChange={(e) => setFormattedDate2(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : payment_method === "Cash" ? (
                <div className="flex mt-3 md:mt-0 flex-wrap md:flex-nowrap gap-2 md:gap-0 items-center">
                  <div>
                    <input
                      {...register("cash_by", { required: "This is required" })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Cash By"
                      defaultValue={singleMoneyReceipt?.data?.cash_by}
                    />
                  </div>

                  <div className="flex mt-6 receivedField md:mt-0">
                    <b className="mr-2 date2">Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        defaultValue={singleMoneyReceipt?.data?.date}
                      />
                    </div>
                  </div>
                </div>
              ) : payment_method === "Other" ? (
                <div className="flex mt-3 md:mt-0 flex-wrap md:flex-nowrap gap-2 md:gap-0 items-center ">
                  <div>
                    <input
                      {...register("other", { required: "This is required" })}
                      className="cashInput moneyViewInputField"
                      type="text"
                      autoComplete="off"
                      placeholder="Other "
                      defaultValue={singleMoneyReceipt?.data?.other}
                    />
                  </div>

                  <div className="flex mt-6 receivedField md:mt-0">
                    <b className="mr-2 date2">Date: </b>
                    <div>
                      <input
                        {...register("date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        defaultValue={singleMoneyReceipt?.data?.date}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-5 payAdvance lg:flex-row sm:flex flex-col gap-4">
            {payment_method === "Check" ? (
              <div className="flex items-center ">
                <div className="flex receivedField">
                  <label className="">Check Date:</label>
                  <div>
                    <input
                      {...register("check_date", { required: true })}
                      className=" moneyViewInputField bankInput"
                      type="date"
                      autoComplete="off"
                    />
                    {errors.check_date && (
                      <span className="text-sm text-red-400">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex receivedField">
                  <label className=" ">Payment Date:</label>
                  <div>
                    {singleMoneyReceipt?.data?.default_date && (
                      <input
                        {...register("payment_date", { required: true })}
                        className="cashInput moneyViewInputField cursor-pointer"
                        type="date"
                        onChange={(e) => setFormattedDate(e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-5 amount2 lg:flex-row sm:flex flex-col gap-4">
            <div className="flex items-center">
              <div className="flex lg:flex-row  flex-col">
                <label className="totalAmountText2">Total Amount Tk:</label>
                <div>
                  <input
                    {...register("total_amount", { required: true })}
                    className="moneyViewInputField totalAmountInput"
                    type="text"
                    onChange={(e) => handleTotalAmount(e.target.value)}
                  />
                  {errors.total_amount && totalAmount === null && (
                    <span className="text-sm text-red-400">
                      This field is required
                    </span>
                  )}
                </div>
              </div>
              {bill === "Final payment against bill no" ? (
                <div className="flex lg:flex-row  flex-col ">
                  <label>Payable Amount :</label>
                  <input
                    {...register("remaining")}
                    className="moneyViewInputField totalAmountInput"
                    type="text"
                    value={remaining}
                    readOnly
                  />
                </div>
              ) : null}
            </div>
            {bill === "Advance against bill no" ? (
              <>
                <div className="flex lg:flex-row  flex-col">
                  <label>Advance:</label>
                  <div>
                    <input
                      {...register("advance", { required: true })}
                      className="moneyViewInputField totalAmountInput"
                      type="number"
                      onChange={(e) => setAdvance(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex lg:flex-row  flex-col ">
                  <label>Remaining:</label>
                  <input
                    {...register("remaining")}
                    className="moneyViewInputField totalAmountInput"
                    type="text"
                    value={getRemaining()}
                    readOnly
                  />
                </div>
              </>
            ) : null}
          </div>
          <div className="mt-5 wordTaka">
            <label>in word (taka) </label>
            {advance
              ? totalAmountInWords
              : singleMoneyReceipt?.data?.taka_in_word}
          </div>

          <div className="my-5 receivedBtn">
            <Can page='/dashboard/money-receipt-update' action='edit'>
              <Button
                onClick={handleOnSubmit}
                type="submit"
                disabled={updateLoading}
              >
                Update
              </Button>
            </Can>
          </div>
        </form>

        <div className="">
          <small className="signature">Authorized Signature</small>
        </div>
        <div className="flex gap-2">
          <Button sx={buttonStyle} onClick={handlePreview}>
            Preview
          </Button>

          {singleMoneyReceipt?.data?._id && (
            <a
              className="bg-[#42A0D9] text-white px-3 py-3 text-[12px] rounded-full mr-2"
              href={`${import.meta.env.VITE_API_URL}/money-receipts/money/${singleMoneyReceipt.data._id
                }`}
              target="_blank"
              rel="noreferrer"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default UpdateMoneyReceipt;
