/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Grid, TextField } from "@mui/material";
import PhoneInput from "../../../components/form/PhoneInput";
import '../AddJobCard/AddJobCard.css'
const ShowroomForm = ({ singleCard, register, errors, setValue }) => {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Show Room Information</h3>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Show Room Name (T)"
            {...register("showRoom_name")}
            focused={singleCard?.showRoom?.showRoom_name || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Vehicle User Name (T)"
            {...register("vehicle_username")}
            focused={singleCard?.showRoom?.vehicle_username || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Show Room Address (T)"
            {...register("showRoom_address")}
            focused={singleCard?.showRoom?.showRoom_address || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            {...register("company_name")}
            label="Company Name (T)"
            focused={singleCard?.showRoom?.company_name || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Address (T)"
            {...register("company_address")}
            focused={singleCard?.showRoom?.company_address || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <PhoneInput
            register={register}
            name="company_contact"
            label="Company Contact Number"
            countryCode={singleCard?.showRoom?.company_country_code}
            phone={singleCard?.showRoom?.company_contact}
            setValue={setValue}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Company Email Address"
            {...register("company_email")}
            type="email"
            focused={singleCard?.showRoom?.company_email || ""}
          />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <TextField
            fullWidth
            label="Reference Name (T)"
            {...register("reference_name")}
            focused={singleCard?.showRoom?.reference_name || ""}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ShowroomForm;