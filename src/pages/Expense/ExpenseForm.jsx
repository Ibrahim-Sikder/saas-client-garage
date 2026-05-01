/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  Chip,
} from "@mui/material";
import {
  Receipt,
  Description,
  Add,
  Delete,
  Payment,
  DateRange,
  BusinessCenter,
} from "@mui/icons-material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import {
  useCreateExpenseMutation,
  useGetSingleExpenseQuery,
  useUpdateExpenseMutation,
} from "../../redux/api/expense";
import TASDatepicker from "../../components/form/Datepicker";
import TASInput from "../../components/form/Input";
import TASTextarea from "../../components/form/Textarea";
import ExpenseAutoComplete from "./ExpenseAutoComplete";
import Loading from "../../components/Loading/Loading";
import TASSelect from "../../components/form/Select";
import { paymentMethods } from "../../constant";
import { expenseInputStyle, purchaseBtn } from "../../utils/customStyle";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";

const ExpenseForm = ({ id }) => {
  const navigate = useNavigate();
  const { tenantDomain, performActionWithPermission, invoiceOption } =
    useAppOptions();

  const { data: singleExpense, isLoading } = useGetSingleExpenseQuery({
    tenantDomain,
    id,
  });

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();

  const defaultValues = useMemo(() => {
    if (id && singleExpense?.data) {
      let selectedInvoiceId = null;
      if (singleExpense.data.invoice_id) {
        selectedInvoiceId =
          typeof singleExpense.data.invoice_id === "object"
            ? singleExpense.data.invoice_id._id
            : singleExpense.data.invoice_id;
      }

      return {
        date: singleExpense.data.date,
        invoice_id: selectedInvoiceId,
        invoiceCost: singleExpense.data.invoiceCost ?? 0,
        payment_method: singleExpense.data.payment_method || "Bkash",
        accountNumber: singleExpense.data.accountNumber || "",
        transactionNumber: singleExpense.data.transactionNumber || "",
        note: singleExpense.data.note || "",
        items: singleExpense.data.expense_items.map((expenseItem) => ({
          name: expenseItem.name || "",
          amount: expenseItem.amount?.toString() || "0",
        })),
      };
    }

    return {
      date: new Date(),
      invoice_id: null,
      invoiceCost: 0,
      payment_method: "Bkash",
      accountNumber: "",
      transactionNumber: "",
      note: "",
      items: [{ name: "", amount: "0" }],
    };
  }, [id, singleExpense?.data, invoiceOption]);

  const methods = useForm({
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const totalExpenseAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [items]);

  useEffect(() => {
    if (Object.keys(defaultValues).length > 0 && !isDirty) {
      reset(defaultValues);
    }
  }, [defaultValues, reset, isDirty]);

  const handleFormSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/add-expense",
      id ? "edit" : "create",
      async () => {
        const cleanedExpenseItems = data.items.map((item) => ({
          name: item.name,
          amount: Number(item.amount),
        }));

        const formattedDate =
          data.date instanceof Date
            ? data.date.toISOString().split("T")[0]
            : data.date;

        const expenseData = {
          date: formattedDate,
          invoice_id: data.invoice_id || "",
          invoiceCost: Number(data.invoiceCost) || 0,
          expense_items: cleanedExpenseItems,
          payment_method: data.payment_method,
          accountNumber: data.accountNumber || "",
          transactionNumber: data.transactionNumber || "",
          note: data.note || "",
        };
        const toastId = toast.loading(
          id ? "Updating Expense..." : "Creating Expense...",
        );

        try {
          let res;
          if (id) {
            res = await updateExpense({
              tenantDomain,
              id,
              ...expenseData,
            }).unwrap();
          } else {
            res = await createExpense({
              tenantDomain,
              expenseInfo: expenseData,
            }).unwrap();
          }

          toast.update(toastId, {
            render:
              res.message ||
              `Expense ${id ? "updated" : "created"} successfully!`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          navigate("/dashboard/expense-list");
        } catch (error) {
          toast.update(toastId, {
            render:
              error?.data?.message || error?.message || "Something went wrong!",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      },
      `You don't have permission to ${id ? "edit" : "create"} an expense.`,
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",

        paddingY: { xs: 1, md: 5 },
        backgroundColor: "#f8fafc",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, md: 4 },
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
              {id ? "Edit Expense" : "Create New Expense"}
            </Typography>
            <Typography variant="body1" color="#64748b">
              {id
                ? "Update expense details"
                : "Add a new expense to your records"}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "white",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, md: 4 } }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                    <DateRange sx={{ color: "#3b82f6", fontSize: 24 }} />
                    <Typography variant="h6" fontWeight="600" color="#1e293b">
                      Invoice & Date Information
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <ExpenseAutoComplete
                        label="Select Invoice"
                        name="invoice_id"
                        options={invoiceOption}
                        size="normal"
                        multiple={false}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TASDatepicker
                        size="medium"
                        fullWidth
                        name="date"
                        label="Date"
                        sx={expenseInputStyle}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TASInput
                        fullWidth
                        name="invoiceCost"
                        label="Invoice Cost"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">৳</InputAdornment>
                          ),
                        }}
                        sx={expenseInputStyle}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Expense Items Section */}
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "white",
                }}
              >
                <CardContent sx={{ p: { xs: 1.5, md: 4 } }}>
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
                        Expense Items
                      </Typography>
                    </Stack>
                    <Chip
                      label={`Total: $${totalExpenseAmount.toFixed(2)}`}
                      sx={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        fontWeight: "600",
                      }}
                    />
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                  <Stack spacing={3}>
                    {fields.map((item, index) => (
                      <Paper
                        key={item.id}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs={12} md={5}>
                            <TASInput
                              fullWidth
                              name={`items[${index}].name`}
                              label={`Expense Item Name`}
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
                              name={`items[${index}].amount`}
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
                                sx={expenseInputStyle}
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
                      sx={expenseInputStyle}
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
                <CardContent sx={{ p: { xs: 1.5, md: 4 } }}>
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
                            name="referenceNo"
                            label="Reference Number"
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
            <Can page="/dashboard/add-expense" action={id ? "edit" : "create"}>
              <Button
                variant="contained"
                type="submit"
                size="large"
                sx={purchaseBtn}
              >
                {id ? "Update Expense" : "Create Expense"}
              </Button>
            </Can>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
};

export default ExpenseForm;
