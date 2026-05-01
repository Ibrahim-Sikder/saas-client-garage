/* eslint-disable react/prop-types */
import { Grid, TextField } from "@mui/material";
import PhoneInput from "../../../components/form/PhoneInput";
import '../AddJobCard/AddJobCard.css'
const CompanyForm = ({ singleCard, register, setValue }) => {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Company Information</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            {...register("company_name")}
            label="Company Name (T)"
            focused={singleCard?.company?.company_name || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Vehicle User Name (T)"
            {...register("vehicle_username")}
            focused={singleCard?.company?.vehicle_username || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Address (T)"
            {...register("company_address")}
            focused={singleCard?.company?.company_address || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="company_contact"
            label="Company Contact Number"
            countryCode={singleCard?.company?.company_country_code}
            phone={singleCard?.company?.company_contact}
            setValue={setValue}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Email Address"
            {...register("company_email")}
            type="email"
            focused={singleCard?.company?.company_email || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Owner Name (T)"
            {...register("companyOwnerName")}
            focused={singleCard?.company?.companyOwnerName || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="companyOwnerPhone"
            label="Company Owner Phone Number"
            countryCode={singleCard?.company?.companyOwnerCountryCode}
            phone={singleCard?.company?.companyOwnerPhone}
            setValue={setValue}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CompanyForm;