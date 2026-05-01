/* eslint-disable react/prop-types */
import { Grid, TextField } from "@mui/material";
import PhoneInput from "../../../components/form/PhoneInput";
import '../AddJobCard/AddJobCard.css'
const CustomerForm = ({ singleCard, register, setValue }) => {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Customer Information</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Name (T)"
            {...register("customer_name")}
            focused={singleCard?.customer?.customer_name || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Email Address (T)"
            {...register("customer_email")}
            type="email"
            focused={singleCard?.customer?.customer_email || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Address (T)"
            {...register("customer_address")}
            focused={singleCard?.customer?.customer_address || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            {...register("company_name")}
            label="Company Name (T)"
            focused={singleCard?.customer?.company_name || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Address (T)"
            {...register("company_address")}
            focused={singleCard?.customer?.company_address || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Vehicle User Name (T)"
            {...register("vehicle_username")}
            focused={singleCard?.customer?.vehicle_username || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="customer_contact"
            label="Customer Contact Number"
            countryCode={singleCard?.customer?.customer_country_code}
            phone={singleCard?.customer?.customer_contact}
            setValue={setValue}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Customer Owner Name (T)"
            {...register("customerOwnerName")}
            focused={singleCard?.customer?.customerOwnerName || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="customerOwnerPhone"
            label="Customer Owner Phone Number"
            countryCode={singleCard?.customer?.customerOwnerCountryCode}
            phone={singleCard?.customer?.customerOwnerPhone}
            setValue={setValue}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Reference Name (T)"
            {...register("reference_name")}
            focused={singleCard?.customer?.reference_name || ""}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerForm;