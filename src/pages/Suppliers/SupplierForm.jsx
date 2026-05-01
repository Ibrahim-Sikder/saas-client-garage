/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  CardContent,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  AlertTitle,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaMoneyBillWave,
  FaUserTie,
} from "react-icons/fa";
import {
  MdBusiness,
  MdPayment,
  MdVerified,
  MdOutlineWarning,
} from "react-icons/md";
import { useFormContext } from "react-hook-form";
import { Save, Help } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  useGetSingleSupplierQuery,
} from "../../redux/api/supplier";
import { countries } from "../../constant/Vehicle.constant";
import TASInput from "../../components/form/Input";
import FormSelect from "../../components/form/FormSelect";
import FormTextArea from "../../components/form/FormTextArea";
import GarageForm from "../../components/form/Form";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import Can from "../../components/Can";
import { useAppOptions } from "../../hooks/useAppOptions";
import CountryCodeAutocomplete from "../../components/form/CountryAutoCompleted";

const FormSection = ({ children }) => (
  <div className="mb-6 p-2 lg:p-4 border rounded-lg shadow-sm">{children}</div>
);

const SupplierForm = ({ id }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [countryCode] = useState(countries[0]);
  const [setPhoneNumber] = useState("");
  const [showHelpTips, setShowHelpTips] = useState(true);
  const isEditing = !!id;
  const {
    createSupplier,
    updateSupplier,
    performActionWithPermission,
    createLoading,
    updateSupplierLoading
  } = useAppOptions();
  const { tenantDomain } = useTenantDomain();
  const { data: singleSupplier, isLoading: isSingleSupplierLoading } =
    useGetSingleSupplierQuery({
      tenantDomain: tenantDomain,
      id: id || "",
    });

  const defaultSupplierValues = {
    full_name: singleSupplier?.data?.full_name || "",
    contact_person_name: singleSupplier?.data?.contact_person_name || "",
    phone_number: singleSupplier?.data?.phone_number || "",
    country_code:
      singleSupplier?.data?.country_code ||
      (countries[0] ? countries[0].code : ""),
    email: singleSupplier?.data?.email || "",

    tax_id: singleSupplier?.data?.tax_id || "",
    street_address: singleSupplier?.data?.street_address || "",
    country: singleSupplier?.data?.country || "",
    state: singleSupplier?.data?.state || "",
    city: singleSupplier?.data?.city || "",
    postal_code: singleSupplier?.data?.postal_code || "",
    bank_name: singleSupplier?.data?.bank_name || "",
    account_number: singleSupplier?.data?.account_number || "",
    swift_code: singleSupplier?.data?.swift_code || "",
    supplier_status: singleSupplier?.data?.supplier_status || "active",
    notes: singleSupplier?.data?.notes || "",
  };

  const methods = useForm({
    defaultValues: defaultSupplierValues,
    mode: "onChange",
  });
  const { setValue } = methods;

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (/^\d*$/.test(newPhoneNumber) && newPhoneNumber.length <= 11) {
      setPhoneNumber(newPhoneNumber);
      setValue("phone_number", newPhoneNumber, { shouldValidate: true });
    }
  };

  const handleSubmit = async (data) => {
    performActionWithPermission('/dashboard/add-supplier', 'create',
      async () => {
        const values = {
          ...data,
          country_code: countryCode.code,
        };

        try {
          let response;

          response = await createSupplier({
            ...values,
            tenantDomain,
          });

          if (response?.data?.success) {
            toast.success(response?.data?.message || `Supplier created successfully!`);
            navigate("/dashboard/supplier-list");
          }
        } catch (error) {
          toast.error(
            error.message ||
            `Failed to ${isEditing ? "update" : "create"} supplier.`
          );
        }
      }, "You don't have permission to create supplier"
    )
  };
  const handleUpdate = async (data) => {
    performActionWithPermission('/dashboard/update-supplier', 'edit',
      async () => {
        const values = {
          ...data,
          country_code: countryCode.code,
        };

        try {
          let response;
          response = await updateSupplier({
            id: id,
            data: { ...values, tenantDomain },
          });
          if (response?.data?.success) {
            toast.success(
              response?.data?.message ||
              `Supplier update successfully!`
            );
            navigate("/dashboard/supplier-list");
          }
        } catch (error) {
          toast.error(
            error.message ||
            `Failed to ${isEditing ? "update" : "create"} supplier.`
          );
        }
      }
    )
  };

  return (
    <>
      {isSingleSupplierLoading ? (
        <h2>Loading</h2>
      ) : (
        <section className="md:py-0" style={{ minHeight: "100vh" }}>
          <div className="max-w-6xl mx-auto p-2 lg:px-4 lg:mt-10 ">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="md:text-3xl font-[600] text-[#2980b9] block">
                {isEditing ? "Edit Supplier" : "Add New Supplier"}
              </h2>
              <Tooltip title="Toggle help tips">
                <IconButton
                  onClick={() => setShowHelpTips(!showHelpTips)}
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    "&:hover": { bgcolor: alpha(theme.palette.info.main, 0.2) },
                  }}
                >
                  <Help />
                </IconButton>
              </Tooltip>
            </div>

            <Collapse in={showHelpTips}>
              <Alert
                severity="info"
                variant="filled"
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setShowHelpTips(false)}
                  >
                    <MdOutlineWarning />
                  </IconButton>
                }
              >
                <AlertTitle>Form Completion Tips</AlertTitle>
                Only <strong>Supplier Name</strong>,{" "}
                <strong>Contact Person Name</strong> and{" "}
              </Alert>
            </Collapse>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <CardContent sx={{ p: { xs: 0, lg: 3 } }}>
                <GarageForm
                  onSubmit={id ? handleUpdate : handleSubmit}
                  defaultValues={defaultSupplierValues}
                >
                  <FormSection>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaUserTie className="mr-2" />
                      Basic Information
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TASInput
                          name="full_name"
                          label={
                            <>
                              Supplier Name
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                {" "}
                                *
                              </span>
                            </>
                          }
                          icon={FaBuilding}
                          iconPosition="start"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TASInput
                          name="contact_person_name"
                          label={
                            <>
                              Contact Person Name
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                {" "}
                                *
                              </span>
                            </>
                          }
                          icon={FaUserTie}
                          iconPosition="start"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <div className="md:flex items-center content-center justify-center gap-2">
                          <Grid item xs={12} sm={3} md={3} lg={3}>
                            <CountryCodeAutocomplete
                              name="country_code"
                              label="Code"
                              options={countries}
                              defaultValue={countryCode}
                            />
                          </Grid>
                          <Grid item xs={12} >
                            <TASInput
                              name="phone_number"
                              label="Phone Number"
                              icon={FaPhone}
                              iconPosition="start"
                              onChange={handlePhoneNumberChange}
                            />
                          </Grid>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TASInput
                          name="email"
                          label="Email Address"
                          type="email"
                          icon={FaEnvelope}
                          iconPosition="start"
                        />
                      </Grid>
                    </Grid>
                  </FormSection>

                  {/* Business & Address Information */}
                  <FormSection>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <MdBusiness className="mr-2" />
                      Business & Address Information
                    </h3>
                    <Grid container spacing={2}>

                      <Grid item xs={12} md={6}>
                        <TASInput
                          name="tax_id"
                          label="VAT / TIN Number"
                          icon={FaIdCard}
                          iconPosition="start"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormTextArea
                          name="street_address"
                          label="Full Address"
                          placeholder="Street address..."
                          minRows={3}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TASInput name="country" label="Country" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TASInput name="state" label="State/Province" />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TASInput name="city" label="City / District" />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TASInput name="postal_code" label="Postal/ZIP Code" />
                      </Grid>
                    </Grid>
                  </FormSection>

                  <FormSection>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <MdPayment className="mr-2" />
                      Financial & Other Details
                    </h3>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TASInput
                          name="bank_name"
                          label="Bank Name"
                          icon={FaMoneyBillWave}
                          iconPosition="start"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TASInput
                          name="account_number"
                          label="Account Number"
                          icon={FaMoneyBillWave}
                          iconPosition="start"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TASInput
                          name="swift_code"
                          label="SWIFT/BIC Code"
                          icon={FaMoneyBillWave}
                          iconPosition="start"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormSelect
                          name="supplier_status"
                          label="Status"
                          options={["active", "inactive"]}
                          icon={MdVerified}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormTextArea
                          name="notes"
                          label="Notes / Remarks"
                          placeholder="Additional comments..."
                          minRows={3}
                        />
                      </Grid>
                    </Grid>
                  </FormSection>

                  {/* Form Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 4,
                      gap: 2,
                    }}
                  >
                    {
                      id ? <Can page='/dashboard/update-supplier' action='edit'>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={
                            createLoading || updateSupplierLoading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <Save />
                            )
                          }
                          sx={{ minWidth: 150 }}
                        >
                          {updateSupplierLoading
                            ? "Processing..."
                            : `${isEditing ? "Update" : "Create"}`}
                        </Button>
                      </Can> : <Can page='/dashboard/add-supplier' action='create'>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={
                            createLoading || updateSupplierLoading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <Save />
                            )
                          }
                          sx={{ minWidth: 150 }}
                        >
                          {createLoading
                            ? "Processing..."
                            : `${isEditing ? "Update" : "Create"}`}
                        </Button>
                      </Can>
                    }
                  </Box>
                </GarageForm>
              </CardContent>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default SupplierForm;
