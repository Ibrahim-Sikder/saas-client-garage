/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  Collapse,
  Switch,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import {
  FaFileInvoice,
  FaUserTie,
  FaMoneyBillWave,
  FaFileAlt,
  FaCheckCircle,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaHandshake,
  FaCalendarAlt,
  FaPercentage,
  FaTag,
  FaRegClock,
} from "react-icons/fa";
import {
  CloudUpload,
  Close as CloseIcon,
  Category as CategoryIcon,
  Payment as PaymentIcon,
  Verified as VerifiedIcon,
  AccessTime as AccessTimeIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  History as HistoryIcon,
  Search as FaSearch,
} from "@mui/icons-material";
import { toast } from "react-toastify";

import { useGetAllSuppliersQuery } from "../../redux/api/supplier";
import dayjs from "dayjs";
import TASInput from "../../components/form/Input";
import FormSelect from "../../components/form/FormSelect";
import {
  PaymentMethodsOption,
  PaymentStatusOptions,
  VendorCategoriesOption,
} from "../../options";
import TASDatepicker from "../../components/form/Datepicker";
import FormTextArea from "../../components/form/FormTextArea";
import TASFileupload from "../../components/form/Fileupload";
import {
  ColorlibConnector,
  ColorlibStepIconRoot,
  InfoCard,
  SectionTitle,
  steps,
  StyledButton,
  StyledCard,
} from "../../utils/customStyle";
import {
  useCreateBillPayMutation,
  useGetSingleBillPayQuery,
  useUpdateBillPayMutation,
} from "../../redux/api/bill-pay";

function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <FaUserTie />,
    2: <FaFileAlt />,
    3: <FaMoneyBillWave />,
    4: <FaCheckCircle />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

const PaybillForm = ({ id }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [showTaxOptions, setShowTaxOptions] = useState(false);
  const [showDiscountOptions, setShowDiscountOptions] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [billTotal, setBillTotal] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [createBillPay, { isLoading: createLoading, error: createError }] =
    useCreateBillPayMutation();
  const navigate = useNavigate();
  const [updateBillPay, { isLoading: updateLoading, error: updateError }] =
    useUpdateBillPayMutation();

  const { data: singleBillPay, isLoading: billPayLoading } =
    useGetSingleBillPayQuery(id);
  const theme = useTheme();

  const methods = useForm({
    defaultValues: {
      supplierId: id ? singleBillPay?.data?.supplierId || "" : "",
      name: id ? singleBillPay?.data?.name || "" : "",
      mobile_number: id ? singleBillPay?.data?.mobile_number || "" : "",
      email: id ? singleBillPay?.data?.email || "" : "",
      address: id ? singleBillPay?.data?.address || "" : "",
      shop_name: id ? singleBillPay?.data?.shop_name || "" : "",
      category: id ? singleBillPay?.data?.category || "" : "",
      against_bill: id ? singleBillPay?.data?.against_bill || "" : "",
      bill_date: id ? dayjs(singleBillPay?.data?.bill_date) : dayjs(),
      due_date: id
        ? dayjs(singleBillPay?.data?.due_date)
        : dayjs().add(30, "day"),
      amount: id ? singleBillPay?.data?.amount || "" : "",
      description: id ? singleBillPay?.data?.description || "" : "",
      payment_method: id ? singleBillPay?.data?.payment_method || "" : "",
      payment_date: id ? dayjs(singleBillPay?.data?.payment_date) : dayjs(),
      payment_note: id ? singleBillPay?.data?.payment_note || "" : "",
      bill_category: id ? singleBillPay?.data?.bill_category || "" : "",
      is_recurring: id ? singleBillPay?.data?.is_recurring || false : false,
      recurring_frequency: id
        ? singleBillPay?.data?.recurring_frequency || ""
        : "",
      recurring_end_date:
        id && singleBillPay?.data?.recurring_end_date
          ? dayjs(singleBillPay?.data?.recurring_end_date)
          : null,
      apply_tax: id ? singleBillPay?.data?.apply_tax || false : false,
      tax_rate: id ? singleBillPay?.data?.tax_rate || "" : "",
      tax_amount: id ? singleBillPay?.data?.tax_amount || "0.00" : "0.00",
      apply_discount: id ? singleBillPay?.data?.apply_discount || false : false,
      discount_type: id
        ? singleBillPay?.data?.discount_type || "percentage"
        : "percentage",
      discount_value: id ? singleBillPay?.data?.discount_value || "" : "",
      discount_amount: id
        ? singleBillPay?.data?.discount_amount || "0.00"
        : "0.00",
      payment_status: id
        ? singleBillPay?.data?.payment_status || "pending"
        : "pending",
      payment_reference: id ? singleBillPay?.data?.payment_reference || "" : "",
      payment_terms: id ? singleBillPay?.data?.payment_terms || "" : "",
      partial_payment: id
        ? singleBillPay?.data?.partial_payment || false
        : false,
      partial_amount: id ? singleBillPay?.data?.partial_amount || "" : "",
      // Check related fields
      check_number: id ? singleBillPay?.data?.check_number || "" : "",
      bank_name: id ? singleBillPay?.data?.bank_name || "" : "",
      check_date: id ? singleBillPay?.data?.check_date || "" : "",
      payee_name: id ? singleBillPay?.data?.payee_name || "" : "",
      // bKash related fields
      bkash_number: id ? singleBillPay?.data?.bkash_number || "" : "",
      // Nagad related fields
      nagad_number: id ? singleBillPay?.data?.nagad_number || "" : "",
      // Credit Card related fields
      card_number: id ? singleBillPay?.data?.card_number || "" : "",
      card_holder_name: id ? singleBillPay?.data?.card_holder_name || "" : "",
      expiration_date: id ? singleBillPay?.data?.expiration_date || "" : "",
      cvv: id ? singleBillPay?.data?.cvv || "" : "",
      // Bank Transfer related fields
      account_number: id ? singleBillPay?.data?.account_number || "" : "",
      // Mobile Payment related fields
      mobile_payment_provider: id
        ? singleBillPay?.data?.mobile_payment_provider || ""
        : "",
      transaction_id: id ? singleBillPay?.data?.transaction_id || "" : "",
      // Other payment method fields
      payment_method_name: id
        ? singleBillPay?.data?.payment_method_name || ""
        : "",
      payment_details: id ? singleBillPay?.data?.payment_details || "" : "",
    },
    mode: "onChange",
  });

  const {
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isValid },
  } = methods;

  const [search, SetSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filterCategory, setFilterCategory] = useState("all");
  const limit = 15;

  const { data: suppliers, isLoading: suppliersLoading } =
    useGetAllSuppliersQuery({
      limit,
      page: currentPage,
      searchTerm: search,
      category: filterCategory !== "all" ? filterCategory : undefined,
    });

  const paymentMethod = watch("payment_method");
  const amount = watch("amount");
  const taxRate = watch("tax_rate");
  const applyTax = watch("apply_tax");
  const applyDiscount = watch("apply_discount");
  const discountType = watch("discount_type");
  const discountValue = watch("discount_value");
  const isRecurring = watch("is_recurring");
  const partialPayment = watch("partial_payment");

  useEffect(() => {
    if (!amount) return;

    const baseAmount = Number.parseFloat(amount) || 0;
    let calculatedTaxAmount = 0;
    let calculatedDiscountAmount = 0;
    let calculatedTotal = baseAmount;

    // Calculate discount first
    if (applyDiscount && discountValue) {
      if (discountType === "percentage") {
        calculatedDiscountAmount =
          (baseAmount * Number.parseFloat(discountValue)) / 100;
      } else {
        calculatedDiscountAmount = Number.parseFloat(discountValue);
      }
      // Ensure discount doesn't exceed the base amount
      calculatedDiscountAmount = Math.min(calculatedDiscountAmount, baseAmount);
      calculatedTotal = baseAmount - calculatedDiscountAmount;
    }

    // Then calculate tax on the amount after discount
    if (applyTax && taxRate) {
      calculatedTaxAmount =
        (calculatedTotal * Number.parseFloat(taxRate)) / 100;
      calculatedTotal += calculatedTaxAmount;
    }

    // Update form values with properly formatted numbers
    setValue("tax_amount", calculatedTaxAmount.toFixed(2));
    setValue("discount_amount", calculatedDiscountAmount.toFixed(2));
    setBillTotal(calculatedTotal);
  }, [
    amount,
    applyTax,
    taxRate,
    applyDiscount,
    discountType,
    discountValue,
    setValue,
  ]);

  // Toggle recurring options visibility
  useEffect(() => {
    setShowRecurringOptions(isRecurring);
  }, [isRecurring]);

  // Toggle tax options visibility
  useEffect(() => {
    setShowTaxOptions(applyTax);
  }, [applyTax]);

  // Toggle discount options visibility
  useEffect(() => {
    setShowDiscountOptions(applyDiscount);
  }, [applyDiscount]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    reset();
    setUrl("");

    setShowRecurringOptions(false);
    setShowTaxOptions(false);
    setShowDiscountOptions(false);
    setPreviewMode(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setValue("supplierId", supplier.supplierId);
    setValue("name", supplier.full_name);
    setValue("mobile_number", supplier.phone_number);
    setValue("email", supplier.email);
    setValue("address", supplier.street_address);
    setValue("shop_name", supplier.shop_name);
    setValue("category", supplier.vendor);
    setValue("payment_terms", supplier.payment_terms);
    handleCloseDialog();
  };

  const handleFormSubmit = async (data) => {
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    // Calculate final amounts
    const finalData = {
      ...data,
      amount: Number(data.amount),
      bill_total: billTotal,
      partial_amount: Number(data.partial_amount),

      tax_amount: applyTax ? Number.parseFloat(data.tax_amount) : 0,

      tax_rate: applyTax ? Number.parseFloat(data.tax_rate) : 0,
      discount_amount: applyDiscount
        ? Number.parseFloat(data.discount_amount)
        : 0,
      bill_date: data.bill_date.format("YYYY-MM-DD"),
      due_date: data.due_date.format("YYYY-MM-DD"),
      payment_date: data.payment_date.format("YYYY-MM-DD"),
      recurring_end_date: data.recurring_end_date
        ? data.recurring_end_date.format("YYYY-MM-DD")
        : null,
      bill_attachments:
        data.bill_attachments && data.bill_attachments.length > 0
          ? data.bill_attachments[0]
          : "",
    };

    try {
      const response = await createBillPay(finalData).unwrap();

      if (response.success) {
        toast.success("Bill payment submitted successfully");
        handleNext();
        reset()
      }
    } catch (error) {
      toast.error("Failed to submit bill payment");
      console.error("Submission error:", error);
    }
  };
  const onSubmit = async (data) => {
    if (activeStep !== steps.length - 1) {
      handleNext();
      return;
    }

    // Calculate final amounts
    const finalData = {
      ...data,
      amount: Number(data.amount),
      bill_total: billTotal,
      partial_amount: Number(data.partial_amount),

      tax_amount: applyTax ? Number.parseFloat(data.tax_amount) : 0,

      tax_rate: applyTax ? Number.parseFloat(data.tax_rate) : 0,
      discount_amount: applyDiscount
        ? Number.parseFloat(data.discount_amount)
        : 0,
      bill_date: data.bill_date.format("YYYY-MM-DD"),
      due_date: data.due_date.format("YYYY-MM-DD"),
      payment_date: data.payment_date.format("YYYY-MM-DD"),
      recurring_end_date: data.recurring_end_date
        ? data.recurring_end_date.format("YYYY-MM-DD")
        : null,
      bill_attachments:
        data.bill_attachments && data.bill_attachments.length > 0
          ? data.bill_attachments[0]
          : "",
    };

    try {
      const response = await updateBillPay({ id, ...finalData }).unwrap();

      
      if (response.success) {
        toast.success("Bill payment update successfully");
        handleNext();
        navigate("/dashboard/paybill");
      }
    } catch (error) {
      toast.error("Failed to update bill payment");
      console.error("Submission error:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const populateForm = (supplierData) => {
    if (!supplierData) return;

    const data = supplierData?.data;
    if (!data) return;

    // Set supplier-related form values
    setValue("supplierId", data.supplierId || "");
    setValue("name", data.full_name || "");
    setValue("mobile_number", data.phone_number || "");
    setValue("email", data.email || "");
    setValue("address", data.street_address || "");
    setValue("shop_name", data.shop_name || "");
    setValue("category", data.vendor || "");
    setValue("payment_terms", data.payment_terms || "");

    // Set selected supplier
    setSelectedSupplier(data);
  };

  useEffect(() => {
    if (id && singleBillPay?.data && !billPayLoading) {
      const data = singleBillPay.data;

      // Set form values from loaded data
      Object.keys(data).forEach((key) => {
        if (
          key === "bill_date" ||
          key === "due_date" ||
          key === "payment_date"
        ) {
          setValue(key, dayjs(data[key]));
        } else if (key === "recurring_end_date" && data[key]) {
          setValue(key, dayjs(data[key]));
        } else if (methods.getValues(key) !== undefined) {
          setValue(key, data[key]);
        }
      });

      // Explicitly set the amount field
      if (data.amount !== undefined) {
        setValue("amount", data.amount?.toString());
      }

      // Set UI state based on loaded data
      setShowRecurringOptions(data.is_recurring || false);
      setShowTaxOptions(data.apply_tax || false);
      setShowDiscountOptions(data.apply_discount || false);

      // Calculate bill total
      if (data.amount) {
        const baseAmount = Number.parseFloat(data.amount) || 0;
        let calculatedTotal = baseAmount;

        if (data.apply_discount && data.discount_amount) {
          calculatedTotal -= Number.parseFloat(data.discount_amount);
        }

        if (data.apply_tax && data.tax_amount) {
          calculatedTotal += Number.parseFloat(data.tax_amount);
        }

        setBillTotal(calculatedTotal);
      }
    }
  }, [id, singleBillPay, billPayLoading, setValue]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    SetSearch(value);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(id ? onSubmit : handleFormSubmit)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <SectionTitle>
                    <FaUserTie
                      className="mr-2"
                      style={{ marginRight: "8px" }}
                    />
                    Supplier Information
                  </SectionTitle>
                </Grid>

                <Grid item xs={12}>
                  <InfoCard>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <InfoIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Quick Tip
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Select an existing supplier from our database or enter new
                      supplier details manually. All fields marked with * are
                      required.
                    </Typography>
                  </InfoCard>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <StyledButton
                      variant="contained"
                      onClick={handleOpenDialog}
                      startIcon={<FaUserTie />}
                    >
                      Select Existing Supplier
                    </StyledButton>

                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => navigate("/dashboard/add-supplier")}
                    >
                      Add New Supplier
                    </Button>
                  </Box>
                </Grid>

                {selectedSupplier && (
                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderLeft: "4px solid #42A1DA",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {selectedSupplier.company_logo ? (
                        <Avatar
                          src={selectedSupplier.company_logo}
                          sx={{
                            width: 56,
                            height: 56,
                          }}
                          alt={selectedSupplier.full_name}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            bgcolor: "#42A1DA",
                            width: 56,
                            height: 56,
                          }}
                        >
                          {selectedSupplier.full_name.charAt(0)}
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="h6">
                          {selectedSupplier.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {selectedSupplier.supplierId} |{" "}
                          {selectedSupplier.email}
                        </Typography>
                        <Chip
                          label={selectedSupplier.supplier_status}
                          size="small"
                          color={
                            selectedSupplier.supplier_status === "active"
                              ? "success"
                              : "default"
                          }
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TASInput
                    name="supplierId"
                    label="Supplier ID *"
                    icon={FaIdCard}
                    iconPosition="start"
                    error={!!errors.supplierId}
                    helperText={errors.supplierId?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TASInput
                    name="name"
                    label="Name *"
                    icon={FaUserTie}
                    iconPosition="start"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TASInput
                    name="mobile_number"
                    label="Mobile *"
                    icon={FaPhone}
                    iconPosition="start"
                    error={!!errors.mobile_number}
                    helperText={errors.mobile_number?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TASInput
                    name="email"
                    label="Email *"
                    icon={FaEnvelope}
                    iconPosition="start"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TASInput
                    name="address"
                    label="Address *"
                    icon={FaIdCard}
                    iconPosition="start"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TASInput
                    name="shop_name"
                    label="Shop/Company Name *"
                    icon={FaBuilding}
                    iconPosition="start"
                    error={!!errors.shop_name}
                    helperText={errors.shop_name?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormSelect
                    name="category"
                    label="Vendor Categories *"
                    options={VendorCategoriesOption}
                    icon={CategoryIcon}
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TASInput
                    name="payment_terms"
                    label="Payment Terms"
                    icon={FaHandshake}
                    placeholder="e.g., Net 30, Due on Receipt"
                    iconPosition="start"
                    error={!!errors.payment_terms}
                    helperText={errors.payment_terms?.message}
                  />
                </Grid>

                {selectedSupplier && paymentHistory.length > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Payment History
                    </Typography>
                    <Box sx={{ maxHeight: "200px", overflow: "auto", mb: 2 }}>
                      {paymentHistory.map((payment, index) => (
                        <Paper
                          key={index}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {payment.date} - {formatCurrency(payment.amount)}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {payment.method} • Ref: {payment.reference}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            label={payment.status}
                            color={
                              payment.status === "completed"
                                ? "success"
                                : "warning"
                            }
                          />
                        </Paper>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </form>
          </FormProvider>
        );
      case 1:
        return (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(id ? onSubmit : handleFormSubmit)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <SectionTitle>
                    <FaFileAlt
                      className="mr-2"
                      style={{ marginRight: "8px" }}
                    />
                    Bill Details
                  </SectionTitle>
                </Grid>

                <Grid item xs={12}>
                  <InfoCard>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <InfoIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Bill Information
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Enter the bill details including bill number, dates,
                      amount, and category. You can also upload a copy of the
                      bill for your records.
                    </Typography>
                  </InfoCard>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TASInput
                    name="against_bill"
                    label="Bill Number *"
                    icon={FaFileInvoice}
                    iconPosition="start"
                    error={!!errors.against_bill}
                    helperText={errors.against_bill?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormSelect
                    name="bill_category"
                    label="Bill Category *"
                    options={[
                      "Electricity",
                      "Water",
                      "Internet",
                      "Rent",
                      "Raw Materials",
                      "Equipment",
                      "Services",
                      "Others",
                    ]}
                    icon={CategoryIcon}
                    error={!!errors.bill_category}
                    helperText={errors.bill_category?.message}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TASDatepicker
                    name="bill_date"
                    label="Bill Date *"
                    iconPosition="start"
                    error={!!errors.bill_date}
                    helperText={errors.bill_date?.message}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TASDatepicker
                    name="due_date"
                    label="Due Date *"
                    iconPosition="start"
                    error={!!errors.due_date}
                    helperText={errors.due_date?.message}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TASInput
                    name="amount"
                    label="Amount *"
                    icon={FaMoneyBillWave}
                    iconPosition="start"
                    type="number"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    value={watch("amount")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaRegClock style={{ marginRight: "8px" }} />
                    <Typography>Recurring Bill</Typography>
                  </Box>
                  <Controller
                    name="is_recurring"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="This is a recurring bill"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Collapse in={showRecurringOptions}>
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "background.default" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Recurring Bill Options
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormSelect
                            name="recurring_frequency"
                            label="Frequency *"
                            options={[
                              "Weekly",
                              "Bi-weekly",
                              "Monthly",
                              "Quarterly",
                              "Semi-annually",
                              "Annually",
                            ]}
                            icon={FaCalendarAlt}
                            error={!!errors.recurring_frequency}
                            helperText={errors.recurring_frequency?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TASDatepicker
                            name="recurring_end_date"
                            label="End Date (Optional)"
                            iconPosition="start"
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Collapse>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaPercentage style={{ marginRight: "8px" }} />
                    <Typography>Tax Options</Typography>
                  </Box>
                  <Controller
                    name="apply_tax"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Apply Tax"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Collapse in={showTaxOptions}>
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "background.default" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Tax Options
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TASInput
                            name="tax_rate"
                            icon={FaPercentage}
                            iconPosition="start"
                            fullWidth
                            label="Tax Rate (%)"
                            type="number"
                            error={!!errors.tax_rate}
                            helperText={errors.tax_rate?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TASInput
                            name="tax_amount"
                            icon={FaMoneyBillWave}
                            iconPosition="start"
                            fullWidth
                            label="Tax Amount"
                            disabled
                            value={watch("tax_amount") || "0.00"}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Collapse>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaTag style={{ marginRight: "8px" }} />
                    <Typography>Discount Options</Typography>
                  </Box>
                  <Controller
                    name="apply_discount"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Apply Discount"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Collapse in={showDiscountOptions}>
                    <Paper sx={{ p: 2, mb: 2, bgcolor: "background.default" }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Discount Options
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <FormSelect
                            name="discount_type"
                            label="Discount Type"
                            options={["percentage", "fixed"]}
                            icon={CategoryIcon}
                            error={!!errors.discount_type}
                            helperText={errors.discount_type?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TASInput
                            name="discount_value"
                            fullWidth
                            label={
                              discountType === "percentage"
                                ? "Discount (%)"
                                : "Discount Amount"
                            }
                            type="number"
                            icon={
                              discountType === "percentage"
                                ? FaPercentage
                                : FaPercentage
                            }
                            iconPosition="start"
                            error={!!errors.discount_value}
                            helperText={errors.discount_value?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TASInput
                            name="discount_amount"
                            fullWidth
                            label="Calculated Discount"
                            disabled
                            value={watch("discount_amount") || "0.00"}
                           
                            iconPosition="start"
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Collapse>
                </Grid>

                <Grid item xs={12}>
                  <FormTextArea
                    name="description"
                    fullWidth
                    label="Description"
                    placeholder="Enter bill description or notes"
                    minRows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>

                <Grid item md={6} xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Attachments
                  </Typography>
                  <TASFileupload
                    uploadBoxStyles={{ width: "100%", height: "120px" }}
                    name="bill_attachments"
                    label="Upload Bill Documents"
                    icon={
                      <CloudUpload
                        sx={{
                          fontSize: 40,
                          color: theme.palette.primary.main,
                          mb: 1,
                        }}
                      />
                    }
                    helperText="Drag and drop files here or click to browse"
                  />
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        );
      case 2:
        return (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(id ? onSubmit : handleFormSubmit)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <SectionTitle>
                    <FaMoneyBillWave
                      className="mr-2"
                      style={{ marginRight: "8px" }}
                    />
                    Payment Information
                  </SectionTitle>
                </Grid>

                <Grid item xs={12}>
                  <InfoCard>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <InfoIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Payment Details
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Specify how you'll pay this bill, including payment method
                      and date. Additional fields will appear based on your
                      selected payment method.
                    </Typography>
                  </InfoCard>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormSelect
                    name="payment_method"
                    label="Payment Method *"
                    options={PaymentMethodsOption}
                    icon={PaymentIcon}
                    error={!!errors.payment_method}
                    helperText={errors.payment_method?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TASDatepicker
                    name="payment_date"
                    label="Payment Date *"
                    iconPosition="start"
                    error={!!errors.payment_date}
                    helperText={errors.payment_date?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  {paymentMethod && (
                    <Paper sx={{ p: 2, mt: 2, bgcolor: "background.default" }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Required Fields for {paymentMethod}
                      </Typography>
                      <Grid container spacing={2}>
                        {paymentMethod === "check" && (
                          <>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="check_number"
                                fullWidth
                                label="Check Number *"
                                error={!!errors.check_number}
                                helperText={errors.check_number?.message}
                                icon={FaFileInvoiceDollar}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="bank_name"
                                fullWidth
                                label="Bank Name *"
                                error={!!errors.bank_name}
                                helperText={errors.bank_name?.message}
                                icon={AccountBalanceIcon}
                                iconPosition="start"
                              />
                            </Grid>
                          </>
                        )}

                        {paymentMethod === "bkash" && (
                          <>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="bkash_number"
                                fullWidth
                                label="bKash Number *"
                                error={!!errors.bkash_number}
                                helperText={errors.bkash_number?.message}
                                icon={FaPhone}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="transaction_id"
                                fullWidth
                                label="Transaction ID *"
                                error={!!errors.transaction_id}
                                helperText={errors.transaction_id?.message}
                                icon={FaFileInvoiceDollar}
                                iconPosition="start"
                              />
                            </Grid>
                          </>
                        )}

                        {paymentMethod === "banktransfer" && (
                          <>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="bank_name"
                                fullWidth
                                label="Bank Name *"
                                error={!!errors.bank_name}
                                helperText={errors.bank_name?.message}
                                icon={AccountBalanceIcon}
                                iconPosition="start"
                                value={
                                  watch("bank_name") ||
                                  selectedSupplier?.bank_name ||
                                  ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="account_number"
                                fullWidth
                                label="Account Number *"
                                error={!!errors.account_number}
                                helperText={errors.account_number?.message}
                                icon={FaFileInvoiceDollar}
                                iconPosition="start"
                                value={
                                  watch("account_number") ||
                                  selectedSupplier?.account_number ||
                                  ""
                                }
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="transaction_id"
                                fullWidth
                                label="Transaction ID *"
                                error={!!errors.transaction_id}
                                helperText={errors.transaction_id?.message}
                                icon={FaFileInvoiceDollar}
                                iconPosition="start"
                              />
                            </Grid>
                          </>
                        )}

                        {paymentMethod === "creditcard" && (
                          <>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="card_number"
                                fullWidth
                                label="Card Number *"
                                error={!!errors.card_number}
                                helperText={errors.card_number?.message}
                                icon={FaCreditCard}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="card_holder_name"
                                fullWidth
                                label="Card Holder Name *"
                                error={!!errors.card_holder_name}
                                helperText={errors.card_holder_name?.message}
                                icon={FaUserTie}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="expiration_date"
                                fullWidth
                                label="Expiration Date (MM/YY) *"
                                error={!!errors.expiration_date}
                                helperText={errors.expiration_date?.message}
                                icon={AccessTimeIcon}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="cvv"
                                fullWidth
                                label="CVV *"
                                type="password"
                                error={!!errors.cvv}
                                helperText={errors.cvv?.message}
                                icon={VerifiedIcon}
                                iconPosition="start"
                              />
                            </Grid>
                          </>
                        )}

                        {paymentMethod === "nagad" && (
                          <>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="nagad_number"
                                fullWidth
                                label="Nagad Number *"
                                error={!!errors.nagad_number}
                                helperText={errors.nagad_number?.message}
                                icon={FaPhone}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="transaction_id"
                                fullWidth
                                label="Transaction ID *"
                                error={!!errors.transaction_id}
                                helperText={errors.transaction_id?.message}
                                icon={FaFileInvoiceDollar}
                                iconPosition="start"
                              />
                            </Grid>
                          </>
                        )}

                        {paymentMethod === "mobilepayment" && (
                          <>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="mobile_payment_provider"
                                fullWidth
                                label="Mobile Payment Provider *"
                                error={!!errors.mobile_payment_provider}
                                helperText={
                                  errors.mobile_payment_provider?.message
                                }
                                icon={FaPhone}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="transaction_id"
                                fullWidth
                                label="Transaction ID *"
                                error={!!errors.transaction_id}
                                helperText={errors.transaction_id?.message}
                                icon={FaFileInvoiceDollar}
                                iconPosition="start"
                              />
                            </Grid>
                          </>
                        )}

                        {(paymentMethod === "Digital Wallet" ||
                          paymentMethod === "Cryptocurrency") && (
                          <Grid item xs={12} md={6}>
                            <TASInput
                              name="transaction_id"
                              fullWidth
                              label="Transaction ID/Hash *"
                              error={!!errors.transaction_id}
                              helperText={errors.transaction_id?.message}
                              icon={FaFileInvoiceDollar}
                              iconPosition="start"
                            />
                          </Grid>
                        )}

                        {paymentMethod === "other" && (
                          <>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="payment_method_name"
                                fullWidth
                                label="Payment Method Name *"
                                error={!!errors.payment_method_name}
                                helperText={errors.payment_method_name?.message}
                                icon={PaymentIcon}
                                iconPosition="start"
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TASInput
                                name="transaction_id"
                                fullWidth
                                label="Reference/Transaction ID *"
                                error={!!errors.transaction_id}
                                helperText={errors.transaction_id?.message}
                                icon={FaFileInvoiceDollar}
                                iconPosition="start"
                              />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Paper>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormSelect
                    name="payment_status"
                    label="Payment Status *"
                    options={PaymentStatusOptions}
                    icon={PaymentIcon}
                    error={!!errors.payment_status}
                    helperText={errors.payment_status?.message}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TASInput
                    name="payment_reference"
                    fullWidth
                    label="Payment Reference"
                    icon={FaFileInvoiceDollar}
                    iconPosition="start"
                    placeholder="e.g., Transaction ID, Check Number"
                    error={!!errors.payment_reference}
                    helperText={errors.payment_reference?.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="partial_payment"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        }
                        label="Make partial payment"
                      />
                    )}
                  />
                </Grid>

                {partialPayment && (
                  <Grid item xs={12} md={6}>
                    <TASInput
                      name="partial_amount"
                      rules={{
                        required: partialPayment
                          ? "Partial amount is required"
                          : false,
                        min: {
                          value: 0.01,
                          message: "Amount must be greater than 0",
                        },
                        max: {
                          value: Number.parseFloat(amount || 0),
                          message: "Cannot exceed bill amount",
                        },
                      }}
                      fullWidth
                      label="Partial Payment Amount *"
                      type="number"
                      error={!!errors.partial_amount}
                      helperText={errors.partial_amount?.message}
                      icon={AttachMoneyIcon}
                      iconPosition="start"
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormTextArea
                    name="payment_note"
                    fullWidth
                    label="Payment Note"
                    minRows={3}
                    icon={FaFileAlt}
                    iconPosition="start"
                    error={!!errors.payment_note}
                    helperText={errors.payment_note?.message}
                  />
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        );
      case 3:
        return (
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(id ? onSubmit : handleFormSubmit)}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <SectionTitle>
                    <FaCheckCircle
                      className="mr-2"
                      style={{ marginRight: "8px" }}
                    />
                    Review & Submit
                  </SectionTitle>
                </Grid>

                <Grid item xs={12}>
                  <InfoCard>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <InfoIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Final Review
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Please review all the information below before submitting
                      your bill payment. You can go back to previous steps to
                      make changes if needed.
                    </Typography>
                  </InfoCard>
                </Grid>

                <Grid item xs={12}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: "12px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "6px",
                        height: "100%",
                        background:
                          "linear-gradient(to bottom, #42A1DA, #2980b9)",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        Bill Payment Summary
                      </Typography>
                      <Box>
                        <Button
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => setPreviewMode(!previewMode)}
                        >
                          {previewMode ? "Edit Mode" : "Print Preview"}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<EmailIcon />}
                          size="small"
                        >
                          Email Receipt
                        </Button>
                      </Box>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Supplier Information
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body1">
                            {watch("name")}
                          </Typography>
                          <Typography variant="body2">
                            {watch("shop_name")}
                          </Typography>
                          <Typography variant="body2">
                            {watch("email")}
                          </Typography>
                          <Typography variant="body2">
                            {watch("mobile_number")}
                          </Typography>
                          <Typography variant="body2">
                            {watch("address")}
                          </Typography>
                        </Box>

                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Bill Details
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>Bill Number:</strong>{" "}
                            {watch("against_bill")}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Category:</strong> {watch("bill_category")}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Bill Date:</strong>{" "}
                            {watch("bill_date")?.format("YYYY-MM-DD")}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Due Date:</strong>{" "}
                            {watch("due_date")?.format("YYYY-MM-DD")}
                          </Typography>
                          {isRecurring && (
                            <Typography variant="body2">
                              <strong>Recurring:</strong>{" "}
                              {watch("recurring_frequency")}
                              {watch("recurring_end_date") &&
                                ` until ${watch("recurring_end_date").format(
                                  "YYYY-MM-DD"
                                )}`}
                            </Typography>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Payment Information
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2">
                            <strong>Payment Method:</strong>{" "}
                            {watch("payment_method")}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Payment Date:</strong>{" "}
                            {watch("payment_date")?.format("YYYY-MM-DD")}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Payment Status:</strong>{" "}
                            {watch("payment_status")}
                          </Typography>
                          {watch("payment_reference") && (
                            <Typography variant="body2">
                              <strong>Reference:</strong>{" "}
                              {watch("payment_reference")}
                            </Typography>
                          )}
                          {watch("payment_note") && (
                            <Typography variant="body2">
                              <strong>Note:</strong> {watch("payment_note")}
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Attachments
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 2 }}>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography variant="body2">Bill Amount:</Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: "right" }}>
                          <Typography variant="body2">
                            {formatCurrency(Number.parseFloat(amount || 0))}
                          </Typography>
                        </Grid>

                        {applyDiscount && (
                          <>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                Discount{" "}
                                {discountType === "percentage"
                                  ? `(${watch("discount_value")}%)`
                                  : ""}
                                :
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: "right" }}>
                              <Typography variant="body2" color="error">
                                -
                                {formatCurrency(
                                  Number.parseFloat(
                                    watch("discount_amount") || 0
                                  )
                                )}
                              </Typography>
                            </Grid>
                          </>
                        )}

                        {applyTax && (
                          <>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                Tax ({watch("tax_rate")}%):
                              </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: "right" }}>
                              <Typography variant="body2">
                                {formatCurrency(
                                  Number.parseFloat(watch("tax_amount") || 0)
                                )}
                              </Typography>
                            </Grid>
                          </>
                        )}

                        <Grid item xs={6} sx={{ mt: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Total:
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: "right", mt: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {formatCurrency(billTotal)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    {partialPayment && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Partial Payment:</strong>{" "}
                          {formatCurrency(
                            Number.parseFloat(watch("partial_amount") || 0)
                          )}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Remaining Balance:</strong>{" "}
                          {formatCurrency(
                            billTotal -
                              Number.parseFloat(watch("partial_amount") || 0)
                          )}
                        </Typography>
                      </Alert>
                    )}

                    {watch("description") && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Description
                        </Typography>
                        <Typography variant="body2">
                          {watch("description")}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="warning">
                    <Typography variant="body2">
                      By submitting this form, you confirm that all the
                      information provided is accurate and complete.
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(id ? onSubmit : handleFormSubmit)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 3,
                mb: 4,
                p: 2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #42A1DA 0%, #2980b9 100%)",
                color: "white",
                gap: 2,
              }}
            >
              <FaFileInvoice size={40} color="#fff" />
              <div>
                <Typography variant="h4" fontWeight="bold">
                  Bill Payment
                </Typography>
                <Typography variant="body1">
                  Pay your supplier bills efficiently and securely
                </Typography>
              </div>
            </Box>
          </Box>
          <StyledCard>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorlibConnector />}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Box sx={{ mt: 4 }}>
              {activeStep === steps.length ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CheckCircleIcon
                    sx={{
                      fontSize: 80,
                      color: "success.main",
                      mb: 2,
                    }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Bill Payment Submitted Successfully
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Your bill payment has been processed. Thank you for your
                    prompt payment.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    A confirmation email has been sent to your registered email
                    address.
                  </Typography>
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                    }}
                  >
                    <StyledButton
                      onClick={handleReset}
                      startIcon={<FaHandshake />}
                    >
                      Submit Another Bill Payment
                    </StyledButton>
                    <Button
                      variant="outlined"
                      startIcon={<HistoryIcon />}
                      onClick={() => navigate("/dashboard/paybill-view")}
                    >
                      View Payment History
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  {getStepContent(activeStep)}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 3,
                    }}
                  >
                    {activeStep !== 0 && (
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                    )}
                    <StyledButton
                      type="submit"
                      disabled={
                        createLoading ||
                        (activeStep === steps.length - 1 && !isValid)
                      }
                      startIcon={
                        activeStep === steps.length - 1 ? <FaHandshake /> : null
                      }
                      endIcon={
                        createLoading && (
                          <CircularProgress size={20} color="inherit" />
                        )
                      }
                    >
                      {activeStep === steps.length - 1
                        ? id
                          ? "Update Payment"
                          : "Submit Payment"
                        : "Next"}
                    </StyledButton>
                  </Box>
                </>
              )}
            </Box>
          </StyledCard>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(id ? onSubmit : handleFormSubmit)}
            >
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>
                  Select Supplier
                  <IconButton
                    aria-label="close"
                    onClick={handleCloseDialog}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                  {suppliersLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 3 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <form>
                      <TextField
                        name="supplier"
                        fullWidth
                        label="Search Suppliers"
                        placeholder="Search by name, ID, or email"
                        variant="outlined"
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <Box
                              sx={{ color: "action.active", mr: 1, my: 0.5 }}
                            >
                              <FaSearch />
                            </Box>
                          ),
                        }}
                        onChange={handleSearch}
                        value={searchTerm}
                      />
                      <Grid
                        container
                        spacing={2}
                        sx={{ maxHeight: "400px", overflow: "auto" }}
                      >
                        {suppliers?.data?.suppliers?.map((supplier) => (
                          <Grid item xs={12} key={supplier._id}>
                            <Paper
                              sx={{
                                p: 2,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                  boxShadow: 3,
                                  bgcolor: "background.paper",
                                },
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                              onClick={() => handleSelectSupplier(supplier)}
                            >
                              {supplier.company_logo ? (
                                <Avatar
                                  src={supplier.company_logo}
                                  alt={supplier.full_name}
                                />
                              ) : (
                                <Avatar sx={{ bgcolor: "#42A1DA" }}>
                                  {supplier.full_name?.charAt(0)}
                                </Avatar>
                              )}
                              <Box>
                                <Typography variant="subtitle1">
                                  {supplier.full_name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {supplier.shop_name} • {supplier.email}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={supplier.supplier_status || "active"}
                                  color={
                                    supplier.supplier_status === "active"
                                      ? "success"
                                      : "default"
                                  }
                                  sx={{ mt: 0.5 }}
                                />
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </form>
          </FormProvider>
        </div>
      </form>
    </FormProvider>
  );
};

export default PaybillForm;
