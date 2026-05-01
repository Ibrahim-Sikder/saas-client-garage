/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Avatar,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Receipt,
  Description,
  Add,
  Delete,
  Payment,
  BusinessCenter,
} from "@mui/icons-material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  useCreateIncomeMutation,
  useGetSingleIncomeQuery,
  useUpdateIncomeMutation,
} from "../../redux/api/income";
import TASInput from "../../components/form/Input";
import TASTextarea from "../../components/form/Textarea";
import Loading from "../../components/Loading/Loading";
import TASSelect from "../../components/form/Select";
import { paymentMethods } from "../../constant";
import { expenseInputStyle } from "../../utils/customStyle";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";
import { useNavigate } from "react-router-dom";

const ExpenseForm = ({ id }) => {
  const { tenantDomain, performActionWithPermission, allInvoices } = useAppOptions()
  const navigate = useNavigate()

  const { data: singleIncome, isLoading } = useGetSingleIncomeQuery({
    tenantDomain,
    id,
  });

  const [createIncome] = useCreateIncomeMutation();
  const [updateIncome] = useUpdateIncomeMutation();



  const defaultValues = useMemo(() => {
    if (id && singleIncome?.data) {
      let selectedInvoiceId = null;
      if (singleIncome.data.invoice_id) {
        selectedInvoiceId =
          typeof singleIncome.data.invoice_id === "object"
            ? singleIncome.data.invoice_id._id
            : singleIncome.data.invoice_id;
      }

      return {
        date: singleIncome.data.date,
        invoice_id: selectedInvoiceId,
        serviceIncomeAmount: singleIncome.data.serviceIncomeAmount ?? 0,
        partsIncomeAmount: singleIncome.data.partsIncomeAmount ?? 0,
        payment_method: singleIncome.data.payment_method || "Bkash",
        accountNumber: singleIncome.data.accountNumber || "",
        transactionNumber: singleIncome.data.transactionNumber || "",
        note: singleIncome.data.note || "",
        income_items: singleIncome?.data?.income_items?.map((item) => ({
          name: item.name || "",
          amount: item.amount?.toString() || "0",
        })) || [{ name: "", amount: "0" }],
      };
    }

    return {
      date: new Date(),
      invoice_id: null,
      serviceIncomeAmount: 0,
      partsIncomeAmount: 0,
      payment_method: "Bkash",
      accountNumber: "",
      transactionNumber: "",
      note: "",
      income_items: [{ name: "", amount: "0" }],
    };
  }, [id, singleIncome?.data]);

  const methods = useForm({
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "income_items",
  });
  const selectedInvoiceId = watch("invoice_id");
  const parseAmount = (amountString) => {
    if (!amountString) return 0;
    const cleanAmount = amountString.toString().replace(/,/g, "");
    return Number(cleanAmount) || 0;
  };
  useEffect(() => {
    if (selectedInvoiceId && allInvoices?.data?.invoices) {
      const selectedInvoice = allInvoices.data.invoices.find(
        (invoice) => invoice._id === selectedInvoiceId
      );

      if (selectedInvoice) {
        const serviceAmount = parseAmount(selectedInvoice.service_total);
        const partsAmount = parseAmount(selectedInvoice.parts_total);

        setValue("serviceIncomeAmount", serviceAmount);
        setValue("partsIncomeAmount", partsAmount);
      }
    }
  }, [selectedInvoiceId, allInvoices?.data?.invoices, setValue]);

  useEffect(() => {
    if (Object.keys(defaultValues).length > 0 && !isDirty) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, isDirty]);

  const handleFormSubmit = async (data) => {
    performActionWithPermission('/dashboard/add-income',
      id ? 'edit' : 'create',
      async () => {
        const cleanedIncomeItems = data.income_items.map((item) => ({
          name: item.name,
          amount: Number(item.amount),
        }));
        const formattedDate =
          data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : data.date;
        const incomeData = {
          date: formattedDate,
          invoice_id: data.invoice_id || "",
          serviceIncomeAmount: Number(data.serviceIncomeAmount) || 0,
          partsIncomeAmount: Number(data.partsIncomeAmount) || 0,
          income_items: cleanedIncomeItems,
          payment_method: data.payment_method,
          accountNumber: data.accountNumber || "",
          transactionNumber: data.transactionNumber || "",
          note: data.note || "",
        };
        const toastId = toast.loading(
          id ? "Updating Income..." : "Creating Income..."
        );
        try {
          let res;
          if (id) {
            res = await updateIncome({
              tenantDomain,
              id,
              ...incomeData,
            }).unwrap();
          } else {
            res = await createIncome({
              tenantDomain,
              incomeInfo: incomeData,
            }).unwrap();
          }

          toast.update(toastId, {
            render:
              res.message || `Income ${id ? "updated" : "created"} successfully!`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          navigate("/dashboard/income-list");
        } catch (error) {
          toast.update(toastId, {
            render:
              `Error ${id ? "updating" : "creating"} income: ` +
              (error?.data?.message || error?.message || "Something went wrong!"),
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      }, `You don't have  permission to ${id ? 'edit' : 'create'} income`
    )
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        p: { xs: 1, md: 4 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, md: 4 },
          mb: 4,
          borderRadius: 3,
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
          },
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              backgroundColor: "#3b82f6",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
          >
            <Receipt sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography
              variant="h4"
              fontWeight="700"
              color="#1e293b"
              sx={{ mb: 1 }}
            >
              {id ? "Edit Income" : "Create New Income"}
            </Typography>
            <Typography variant="body1" color="#64748b">
              {id
                ? "Update income details"
                : "Add a new income to your records"}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={4}>


            {/* Income Items Section */}
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "white",
                }}
              >
                <CardContent sx={{ p: { xs: 1, sm: 4 } }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    mb={3}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <BusinessCenter sx={{ color: "#8b5cf6", fontSize: 24 }} />
                      <Typography variant="h6" fontWeight="600" color="#1e293b">
                        Income Source
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={3}>
                    {fields.map((item, index) => (
                      <Paper
                        key={item.id}
                        sx={{
                          p: { xs: 1, sm: 3 },
                          borderRadius: 2,
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} md={5}>
                            <TASInput
                              fullWidth
                              // FIXED: Changed field name
                              name={`income_items[${index}].name`}
                              label="Source of income"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Description sx={{ color: "#6b7280" }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={expenseInputStyle}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TASInput
                              fullWidth
                              label="Amount"
                              // FIXED: Changed field name
                              name={`income_items[${index}].amount`}
                              type="number"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    ৳
                                  </InputAdornment>
                                ),
                              }}
                              sx={expenseInputStyle}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="center"
                            >
                              <IconButton
                                color="error"
                                onClick={() => remove(index)}
                                disabled={fields.length === 1}
                                sx={{
                                  ...expenseInputStyle,
                                  "&:hover": {
                                    backgroundColor: "#fee2e2",
                                  },
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={() => append({ name: "", amount: "0" })}
                      sx={{
                        ...expenseInputStyle,
                        borderColor: "#3b82f6",
                        color: "#3b82f6",
                        "&:hover": {
                          backgroundColor: "#eff6ff",
                          borderColor: "#2563eb",
                        },
                      }}
                    >
                      Add New Item
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Payment & Details Section */}
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "white",
                }}
              >
                <CardContent sx={{ p: { xs: 1, sm: 4 } }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <Payment sx={{ color: "#8b5cf6", fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="600" color="#1e293b">
                      Payment Information
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TASSelect
                        size="normal"
                        name="payment_method"
                        label="Payment Method"
                        items={paymentMethods}
                      />
                    </Grid>

                    {[
                      "Bkash",
                      "Nagad",
                      "Rocket",
                      "Other",
                      "Bank Transfer",
                    ].includes(methods.watch("payment_method")) && (
                        <>
                          <Grid item xs={12} md={3}>
                            <TASInput
                              fullWidth
                              name="accountNumber"
                              label="Account Number"
                              sx={expenseInputStyle}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TASInput
                              fullWidth
                              name="transactionNumber"
                              label="Transaction ID"
                              sx={expenseInputStyle}
                            />
                          </Grid>
                        </>
                      )}

                    {["Cash"].includes(methods.watch("payment_method")) && (
                      <>
                        <Grid item xs={12} md={3}>
                          <TASInput
                            fullWidth
                            name="referanceNo"
                            label="Referance Number"
                            sx={expenseInputStyle}
                          />
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12}>
                      <TASTextarea
                        fullWidth
                        name="note"
                        minRows={4}
                        placeholder="Add any additional notes about this income..."
                        sx={expenseInputStyle}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Can action={id ? 'edit' : 'create'}
              page="/dashboard/add-income">
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  ...expenseInputStyle,
                  backgroundColor: "#3b82f6",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                {id ? "Update Income" : "Create Income"}
              </Button>
            </Can>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default ExpenseForm;
