/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-no-undef */

import TextField from "@mui/material/TextField";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { countries } from "../../constant";
import { useCreateEmployeeMutation } from "../../redux/api/employee";
import uploadFile from "../../helper/uploadFile";
import { ArrowBack } from "@mui/icons-material";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppOptions } from "../../hooks/useAppOptions";
import Can from "../../components/Can";
const AddEmployee = () => {
  const { tenantDomain, performActionWithPermission } = useAppOptions();
  const [url, setUrl] = useState("");
  const [imageLoading] = useState(false);
  const [setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(countries[0]);
  const [guardianCountryCode, setGuardianCountryCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const [createEmployee, { isLoading: createLoading, error: createError }] =
    useCreateEmployeeMutation();

  const handleImageUpload = async (event) => {
    setLoading(true);
    const file = event.target.files?.[0];

    if (file) {
      const uploadPhoto = await uploadFile(file);
      setUrl(uploadPhoto?.secure_url);
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    performActionWithPermission('/dashboard/add-employee', 'create',
      async () => {
        const toastId = toast.loading("Creating Employee...");
        data.country_code = countryCode.code;
        data.guardian_country_code = guardianCountryCode.code;
        data.image = url;
        data.nid_number = Number(data.nid_number);

        try {
          const res = await createEmployee({ tenantDomain, ...data }).unwrap();

          if (res.success) {
            toast.success(res.message);
            navigate("/dashboard/employee-list");
          }
        } catch (err) {
          if (err.data && err.data.errorSources) {
            err.data.errorSources.forEach((error) => {
              toast.error(`${error.path}: ${error.message}`);
            });
          } else {
            toast.error(err.data?.message || "Failed to creating the employee.");
          }
        } finally {
          toast.dismiss(toastId);
        }
      }
    );
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
  const handleGuardianPhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    if (
      /^\d*$/.test(newPhoneNumber) &&
      newPhoneNumber.length <= 10 &&
      (newPhoneNumber === "" ||
        !newPhoneNumber.startsWith("0") ||
        newPhoneNumber.length > 1)
    ) {
      setGuardianPhoneNumber(newPhoneNumber);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section>
      <div className=" addProductWraps mt-10 ">
        <div className="productHeadWrap gap-3 ">
          <div className="flex flex-wrap ">
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
              <h3 className="text-2xl font-bold"> New Employee </h3>
            </div>
          </div>
          <div className="productHome">
            <span>Home / </span>
            <span>Employee / </span>
            <span>New Employee </span>
          </div>
        </div>

        <div className="addProductWrap mb-10 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="addEmployeeFieldWraps space-y-3">
              <div>
                <Box>
                  <h3 className="text-xl font-bold mb-5 text-center ">
                    Personal Information
                  </h3>
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            Full Name
                            <span
                              style={{
                                color: "red",
                                fontSize: "25px",
                              }}
                            >
                              *
                            </span>
                          </>
                        }
                        id="Full Name "
                        {...register("full_name")}
                      />
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={
                            <>
                              Date Of Birth
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                *
                              </span>
                            </>
                          }
                          defaultValue={dayjs("2022-04-17")}
                          {...register("date_of_birth", {
                            required: "Date of birth is required",
                          })}
                          slotProps={{
                            textField: {
                              fullWidth: true,
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
                          defaultValue=""
                          {...register("blood_group")}
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
                        label="Religion"
                        {...register("religion")}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={3} xs={12}>
                          <Autocomplete
                            sx={{ marginRight: "2px" }}
                            fullWidth
                            freeSolo
                            options={countries}
                            getOptionLabel={(option) => option.code}
                            value={countryCode}
                            onChange={(event, newValue) => {
                              setCountryCode(newValue);
                              // setPhoneNumber("");
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
                            {...register("phone_number", {
                              required: "Phone number is required!",
                            })}
                            fullWidth
                            label={
                              <>
                                Phone No
                                <span
                                  style={{
                                    color: "red",
                                    fontSize: "25px",
                                  }}
                                >
                                  *
                                </span>
                              </>
                            }
                            variant="outlined"
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            error={!!errors.phone_number}
                            helperText={errors.phone_number?.message}
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
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="grouped-native-select">
                          Select Gender
                        </InputLabel>
                        <Select
                          id="grouped-native-select"
                          label={
                            <>
                              Select Gender
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                *
                              </span>
                            </>
                          }
                          {...register("gender", {
                            required: "Gender is required!",
                          })}
                          error={!!errors.gender}
                          helperText={errors.gender?.message}
                        >
                          <MenuItem value="Male">Male</MenuItem>

                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ marginTop: "30px" }}>
                  <h3 className="text-xl font-bold mb-5 text-center ">
                    Employee Information
                  </h3>
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={
                            <>
                              Join Date
                              <span
                                style={{
                                  color: "red",
                                  fontSize: "25px",
                                }}
                              >
                                *
                              </span>
                            </>
                          }
                          defaultValue={dayjs("2022-04-17")}
                          {...register("join_date", {
                            required: "Join date is required!",
                          })}
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
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="grouped-native-select">
                          Select Employee Status
                        </InputLabel>
                        <Select
                          id="grouped-native-select"
                          label="Select Employee Status"
                          {...register("status")}

                        >
                          <MenuItem value="Active">Active</MenuItem>
                          <MenuItem value="Inactive">Inactive</MenuItem>
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

                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Mother Name "
                        {...register("mother_name")}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Guardian Name"
                        {...register("guardian_name")}
                      />
                    </Grid>

                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <Grid container spacing={2}>
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
                              // setGuardianPhoneNumber("");
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
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Nationality"
                        {...register("nationality")}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ marginTop: "30px" }}>
                  <h3 className="text-xl font-bold mb-5 text-center ">
                    Address
                  </h3>
                  <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Present Address "
                        {...register("present_address")}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        label="Permanent Address "
                        {...register("permanent_address")}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <div className="productField">
                        <input
                          onChange={handleImageUpload}
                          type="file"
                          id="files"
                          className="hidden"
                        />
                        <label
                          for="files"
                          className="flex items-center justify-center cursor-pointer bg-[#42A1DA] text-white py-2 rounded-md "
                        >
                          <span>
                            <FaCloudUploadAlt size={30} className="mr-2" />
                          </span>
                          {imageLoading ? (
                            <span>Uploading...</span>
                          ) : (
                            <>
                              {url ? (
                                <span>Uploaded</span>
                              ) : (
                                <span> Upload Image</span>
                              )}
                            </>
                          )}
                        </label>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </div>

            <div className="flex justify-center mt-10 ">
              <Can page="/dashboard/add-employee" action="create">
                <Button
                  sx={{ color: "white" }}
                  type="submit"
                  disabled={createLoading}
                >
                  Add Employee
                </Button>
              </Can>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddEmployee;
