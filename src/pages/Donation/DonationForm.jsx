/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  Container,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Favorite,
  Person,
  Payment,
  VolunteerActivism,
} from "@mui/icons-material";
import {
  useCreateDonationMutation,
  useGetSingleDonationQuery,
  useUpdateDonationMutation,
} from "../../redux/api/donationApi";
import FormInput from "../../components/form/Input";
import TASSelect from "../../components/form/Select";
import { expenseInputStyle } from "../../utils/customStyle";
import TASTextarea from "../../components/form/Textarea";
import { paymentMethods } from "../../constant";
import { useNavigate } from "react-router-dom";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";

export default function DonationForm({ id }) {
  const [createDonation, { isLoading }] = useCreateDonationMutation();
  const [updateDonation] = useUpdateDonationMutation();
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const navigate = useNavigate();

  const { data: singleDonation, isLoading: donationLoading } =
    useGetSingleDonationQuery({ id, tenantDomain }, { skip: !id });

  const methods = useForm({
    defaultValues: {
      name: "",
      mobile_number: "",
      email: "",
      donation_country: "",
      address: "",
      donation_purpose: "",
      donation_amount: "",
      payment_method: "",
      bank_account_no: "",
      check_no: "",
      card_number: "",
      card_holder_name: "",
      card_transaction_no: "",
      card_type: "",
      month_first: "",
      month_second: "",
      year: "",
      security_code: "",
      transaction_no: "",
      transactionId: "",
      description: "",
    },
  });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    if (singleDonation?.data) {
      reset({
        name: singleDonation.data.name || "",
        mobile_number: singleDonation.data.mobile_number || "",
        email: singleDonation.data.email || "",
        donation_country: singleDonation.data.donation_country || "",
        address: singleDonation.data.address || "",
        donation_purpose: singleDonation.data.donation_purpose || "",
        donation_amount: singleDonation.data.donation_amount || "",
        payment_method: singleDonation.data.payment_method || "",
        bank_account_no: singleDonation.data.bank_account_no || "",
        check_no: singleDonation.data.check_no || "",
        card_number: singleDonation.data.card_number || "",
        card_holder_name: singleDonation.data.card_holder_name || "",
        card_transaction_no: singleDonation.data.card_transaction_no || "",
        card_type: singleDonation.data.card_type || "",
        month_first: singleDonation.data.month_first || "",
        month_second: singleDonation.data.month_second || "",
        year: singleDonation.data.year || "",
        security_code: singleDonation.data.security_code || "",
        transaction_no: singleDonation.data.transaction_no || "",
        transactionId: singleDonation.data.transactionId || "",
        description: singleDonation.data.description || "",
      });
    }
  }, [singleDonation, reset]);

  const handleFormSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/create-donation",
      id ? "edit" : "create",
      async () => {
        const toastId = toast.loading(
          id ? "Updating donation..." : "Creating donation..."
        );

        const submitData = {
          ...data,
          donation_amount: Number(data.donation_amount),
        };

        try {
          let res;

          if (id) {
            res = await updateDonation({
              id,
              tenantDomain,
              ...submitData,
            }).unwrap();
          } else {
            res = await createDonation({
              tenantDomain,
              ...submitData,
            }).unwrap();
          }

          if (res.success) {
            toast.update(toastId, {
              render: id
                ? "Donation updated successfully!"
                : "Donation created successfully!",
              type: "success",
              isLoading: false,
              autoClose: 3000,
            });

            methods.reset();
            navigate("/dashboard/donation-list");
          }
        } catch (error) {
          toast.update(toastId, {
            render: error?.data?.message || "Something went wrong",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      }, `You don't have permission to ${id ? "edit" : "create"} donation`)
  }
  // Show loading state while fetching donation data
  if (id && donationLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: { xs: 1.5, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Paper elevation={8} sx={{ borderRadius: 4, overflow: "hidden" }}>
              <Box sx={{ p: 1, bgcolor: "primary.main", textAlign: "center" }}>
                <Typography
                  variant="h6"
                  color="white"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VolunteerActivism sx={{ mr: 1 }} /> Donation Information
                </Typography>
              </Box>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                  <Box sx={{ p: { xs: 1.5, md: 4 } }}>
                    {/* Personal Information Section */}
                    <Box sx={{ mb: 5 }}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Person sx={{ mr: 1, color: "primary.main" }} />{" "}
                        Personal Information
                      </Typography>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FormInput
                            fullWidth
                            label="Full Name *"
                            name="name"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormInput
                            fullWidth
                            label="Mobile Number *"
                            name="mobile_number"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormInput
                            fullWidth
                            label="Email Address *"
                            type="email"
                            name="email"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormInput
                            fullWidth
                            label="Country *"
                            name="donation_country"
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormInput
                            fullWidth
                            label="Address *"
                            multiline
                            rows={2}
                            name="address"
                            required
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Donation Details Section */}
                    <Box sx={{ mb: 5 }}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        ৳
                        Donation Details
                      </Typography>
                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <FormInput
                            fullWidth
                            label="Donation Purpose *"
                            name="donation_purpose"
                            multiline
                            rows={3}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormInput
                            fullWidth
                            label="Donation Amount *"
                            type="number"
                            name="donation_amount"
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Payment Information Section */}
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
                            mb={3}
                          >
                            <Payment sx={{ color: "#8b5cf6", fontSize: 24 }} />
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              color="#1e293b"
                            >
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
                                    <FormInput
                                      fullWidth
                                      name="transaction_no"
                                      label="Account Number"
                                      sx={expenseInputStyle}
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={3}>
                                    <FormInput
                                      fullWidth
                                      name="transactionId"
                                      label="Transaction ID"
                                      sx={expenseInputStyle}
                                    />
                                  </Grid>
                                </>
                              )}

                            {["Cash"].includes(
                              methods.watch("payment_method")
                            ) && (
                                <>
                                  <Grid item xs={12} md={3}>
                                    <FormInput
                                      fullWidth
                                      name="referenceNo"
                                      label="Referance Number"
                                      sx={expenseInputStyle}
                                    />
                                  </Grid>
                                </>
                              )}

                            <Grid item xs={12}>
                              <TASTextarea
                                fullWidth
                                name="description"
                                minRows={4}
                                placeholder="Add any additional notes about this income..."
                                sx={expenseInputStyle}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Submit Button */}
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                      <Can page='/dashboard/create-donation' action={id ? 'edit' : 'create'}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={isLoading}
                          endIcon={
                            isLoading ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Favorite />
                            )
                          }
                          sx={{ px: 6, py: 1.5 }}
                        >
                          {isLoading ? "Processing..." : "Donate Now"}
                        </Button>
                      </Can>
                    </Box>
                  </Box>
                </form>
              </FormProvider>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
