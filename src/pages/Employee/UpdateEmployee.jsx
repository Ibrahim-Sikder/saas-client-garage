/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-no-undef */

import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { countries } from "../../constant";
import {
  useGetSingleEmployeeQuery,
  useUpdateEmployeeMutation,
} from "../../redux/api/employee";
import ImageUploader from "../../helper/uploadImage";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ArrowBack } from "@mui/icons-material";
import Loading from "../../components/Loading/Loading";
import Can from "../../components/Can";
import { useAppOptions } from "../../hooks/useAppOptions";

const UpdateEmployee = () => {
  const [url, setUrl] = useState("");
  const [loading] = useState(false);
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [guardianCountryCode, setGuardianCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [joinDate, setJoinDate] = useState(null);
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    data: singleEmployee,
    isLoading: employeeLoading,
    error: employeeError,
  } = useGetSingleEmployeeQuery(
    { tenantDomain, id },
    { skip: !tenantDomain || !id }
  );

  const [updateEmployee, { isLoading: updateLoading, error: updateError }] =
    useUpdateEmployeeMutation();

  useEffect(() => {
    if (singleEmployee?.data) {
      // Set date values
      const dob = singleEmployee.data.date_of_birth
        ? dayjs(singleEmployee.data.date_of_birth)
        : null;
      const join = singleEmployee.data.join_date
        ? dayjs(singleEmployee.data.join_date)
        : null;

      setDateOfBirth(dob);
      setJoinDate(join);

      reset({
        employeeId: singleEmployee.data.employeeId,
        full_name: singleEmployee?.data?.full_name,
        date_of_birth: singleEmployee?.data?.date_of_birth,
        nid_number: singleEmployee?.data?.nid_number,
        blood_group: singleEmployee?.data?.blood_group,
        country_code: singleEmployee?.data?.country_code,
        phone_number: singleEmployee?.data?.phone_number,
        email: singleEmployee?.data?.email,
        gender: singleEmployee?.data?.gender,
        join_date: singleEmployee?.data?.join_date,
        designation: singleEmployee?.data?.designation,
        status: singleEmployee?.data?.status,
        password: singleEmployee?.data?.password,
        confirm_password: singleEmployee?.data?.confirm_password,
        father_name: singleEmployee?.data?.father_name,
        mother_name: singleEmployee?.data?.mother_name,

        guardian_name: singleEmployee?.data?.guardian_name,
        guardian_country_code: singleEmployee?.data?.guardian_country_code,
        guardian_contact: singleEmployee?.data?.guardian_contact,
        relationship: singleEmployee?.data?.relationship,

        nationality: singleEmployee?.data?.nationality,
        religion: singleEmployee?.data?.religion,

        country: singleEmployee?.data?.country,
        city: singleEmployee?.data?.city,
        present_address: singleEmployee?.data?.present_address,
        permanent_address: singleEmployee?.data?.permanent_address,
      });

      // Set phone numbers
      setPhoneNumber(singleEmployee?.data?.phone_number || "");
      setGuardianPhoneNumber(singleEmployee?.data?.guardian_contact || "");

      // Set country codes
      if (singleEmployee?.data?.country_code) {
        const foundCountry = countries.find(
          (country) => country.code === singleEmployee.data.country_code
        );
        if (foundCountry) setCountryCode(foundCountry);
      }
      if (singleEmployee?.data?.guardian_country_code) {
        const foundGuardianCountry = countries.find(
          (country) =>
            country.code === singleEmployee.data.guardian_country_code
        );
        if (foundGuardianCountry) setGuardianCountryCode(foundGuardianCountry);
      }
    }
  }, [reset, singleEmployee?.data]);

  const onSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/update-employee",
      "edit",
      async () => {
        data.country_code = countryCode.code;
        data.guardian_country_code = guardianCountryCode.code;
        data.image = url;
        data.nid_number = Number(data.nid_number);

        // Format dates properly before sending
        if (dateOfBirth) {
          data.date_of_birth = dateOfBirth.format("YYYY-MM-DD");
        }
        if (joinDate) {
          data.join_date = joinDate.format("YYYY-MM-DD");
        }

        const res = await updateEmployee({
          id: singleEmployee.data._id,
          data: {
            tenantDomain,
            ...data,
          },
        }).unwrap();

        if (res.success) {
          toast.success(res.message);
          navigate("/dashboard/employee-list");
        }
      },
      "You don't have permission to update employee."
    );
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 11 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setPhoneNumber(newPhoneNumber);
      setValue("phone_number", newPhoneNumber);
    }
  };

  const handleGuardianPhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 11 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setGuardianPhoneNumber(newPhoneNumber);
      setValue("guardian_contact", newPhoneNumber);
    }
  };

  const handleDateOfBirthChange = (newValue) => {
    setDateOfBirth(newValue);
    if (newValue) {
      setValue("date_of_birth", newValue.format("YYYY-MM-DD"));
    } else {
      setValue("date_of_birth", "");
    }
  };

  const handleJoinDateChange = (newValue) => {
    setJoinDate(newValue);
    if (newValue) {
      setValue("join_date", newValue.format("YYYY-MM-DD"));
    } else {
      setValue("join_date", "");
    }
  };

  if (employeeLoading) {
    return <Loading />;
  }
  if (employeeError) {
    toast.error(employeeError.data.message);
  }
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section>
      <div className=" addProductWraps my-8 ">
        <div className="productHeadWrap gap-3 ">
          <div className="flex flex-wrap">
            <Button
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ mr: 2, color: "#fff" }}
            >
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center ">
            <div>
              <h3 className="text-2xl font-bold"> Update Employee </h3>
            </div>
          </div>
          <div className="productHome">
            <span>Home / </span>
            <span>Employee / </span>
            <span>Update Employee </span>
          </div>
        </div>

        <div className="addProductWrap">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" space-y-3">
              <Box>
                <h3 className="text-xl font-bold mb-5 text-center ">
                  Personal Information{" "}
                </h3>

                <Grid container spacing={2}>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <div className=" ">
                      <ImageUploader
                        className="w-full h-full object-cover"
                        uploadedFile={url}
                        setUploadedFile={setUrl}
                        upload_file={singleEmployee?.data?.image}
                      />
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name "
                      id="Full Name "
                      {...register("full_name")}
                      focused={singleEmployee?.data?.full_name || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date Of Birth "
                        value={dateOfBirth}
                        onChange={handleDateOfBirthChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.date_of_birth,
                            helperText: errors.date_of_birth?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="NID Number"
                      {...register("nid_number")}
                      focused={singleEmployee?.data?.nid_number || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormControl fullWidth error={!!errors.blood_group}>
                      <InputLabel id="blood-group-select-label">
                        Blood Group
                      </InputLabel>
                      <Select
                        labelId="blood-group-select-label"
                        label="Blood Group"
                        focused={singleEmployee?.data?.blood_group || ""}
                        {...register("blood_group")}
                        defaultValue={singleEmployee?.data?.blood_group}
                      >
                        <MenuItem value="" disabled>
                          Select Blood Group
                        </MenuItem>
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="Unknown">Unknown</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Nationality"
                      {...register("nationality")}
                      focused={singleEmployee?.data?.nationality || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      className="productField"
                      fullWidth
                      label="Religion"
                      {...register("religion")}
                      focused={singleEmployee?.data?.religion || ""}
                    />
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Grid container spacing={2}>
                      <Grid item lg={4} md={6} sm={3} xs={12}>
                        <Autocomplete
                          sx={{ marginRight: "2px", marginLeft: "5px" }}
                          fullWidth
                          freeSolo
                          options={countries}
                          getOptionLabel={(option) => option.code}
                          value={countryCode}
                          onChange={(event, newValue) => {
                            setCountryCode(newValue);
                            setPhoneNumber("");
                            if (newValue) {
                              setValue("country_code", newValue.code);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country Code"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={8} md={6} sm={9} xs={12}>
                        <TextField
                          {...register("phone_number")}
                          className="productField2"
                          label="Phone No"
                          variant="outlined"
                          fullWidth
                          type="tel"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address "
                      id="Email Address "
                      {...register("email")}
                      focused={singleEmployee?.data?.email || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="grouped-native-select">
                        Gender
                      </InputLabel>
                      <Select
                        fullWidth
                        native
                        id="grouped-native-select"
                        label="Gender"
                        {...register("gender")}
                        defaultValue={singleEmployee?.data?.gender || ""}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ marginTop: "30px" }}>
                <h3 className="text-xl font-bold mb-5 text-center ">
                  Employee Information{" "}
                </h3>
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Join Date"
                        value={joinDate}
                        onChange={handleJoinDateChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.join_date,
                            helperText: errors.join_date?.message,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Designation  "
                      id="Designation  "
                      {...register("designation")}
                      focused={singleEmployee?.data?.designation || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="grouped-native-select">
                        Select Status
                      </InputLabel>
                      <Select
                        fullWidth
                        native
                        id="grouped-native-select"
                        label="Select Status "
                        {...register("status")}
                        defaultValue={singleEmployee?.data?.status || ""}
                      >
                        <option value="">Select</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ marginTop: "30px" }}>
                <h3 className="text-xl font-bold mb-5 text-center ">
                  Guardian Information
                </h3>
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Father Name "
                      {...register("father_name")}
                      focused={singleEmployee?.data?.father_name || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Mother Name "
                      {...register("mother_name")}
                      focused={singleEmployee?.data?.mother_name || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Guardian Name"
                      {...register("guardian_name")}
                      focused={singleEmployee?.data?.guardian_name || ""}
                    />
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Grid container spacing={1}>
                      <Grid item lg={4} md={6} sm={3} xs={12}>
                        <Autocomplete
                          sx={{ marginRight: "2px", marginLeft: "5px" }}
                          className="jobCardSelect2"
                          freeSolo
                          options={countries}
                          getOptionLabel={(option) => option.code}
                          value={guardianCountryCode}
                          onChange={(event, newValue) => {
                            setGuardianCountryCode(newValue);
                            setGuardianPhoneNumber("");
                            if (newValue) {
                              setValue("guardian_country_code", newValue.code);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Country Code"
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item lg={8} md={6} sm={9} xs={12}>
                        <TextField
                          {...register("guardian_contact")}
                          className="productField2"
                          label="Guardian Phone No"
                          variant="outlined"
                          fullWidth
                          type="tel"
                          value={guardianPhoneNumber}
                          onChange={handleGuardianPhoneNumberChange}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Relationship"
                      {...register("relationship")}
                      focused={singleEmployee?.data?.relationship || ""}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ marginTop: "30px" }}>
                <h3 className="text-xl font-bold mb-5 text-center ">Address</h3>
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Present Address "
                      {...register("present_address")}
                      focused={singleEmployee?.data?.present_address || ""}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      label="Permanent Address "
                      {...register("permanent_address")}
                      focused={singleEmployee?.data?.permanent_address || ""}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>

            <div className="flex justify-center mt-5 ">
              <Can page="/dashboard/update-employee" action="edit">
                <Button
                  sx={{ color: "white" }}
                  disabled={updateLoading || loading}
                  type="submit"
                >
                  Update Employee
                </Button>
              </Can>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UpdateEmployee;
