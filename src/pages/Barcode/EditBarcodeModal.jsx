/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import TASRightSideModal from "../../../components/Share/Modal/Modal";
import { useForm } from "react-hook-form";
import TASForm from "../../../components/form/Form";
import { Box, Button, Grid, Typography } from "@mui/material";
import TAFileupload from "../../../components/form/Fileupload";
import TASInput from "../../../components/form/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  "sub-category": z.string().min(1, "Subcategory is required"),
  category: z.string().min(1, "Main Category is required"),
  image: z
    .any()
    .refine((val) => val !== null, { message: "Category image is required" }),
});

const defaultValues = {
  name: "",
  "sub-category": "",
  category: "",
  image: null,
};

const EditBarcodeModal = ({ open, setOpen, id }) => {
  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      "sub-category": "",
      category: "",
      image: null,
    },
  });

  const handleSubmitForm = (data) => {

  };

  return (
    <TASRightSideModal
      open={open}
      setOpen={setOpen}
      title="Edit Brand"
      width="500px"
      sx={{ paddingTop: "10px" }}
    >
      <Box padding="30px" marginTop="20px">
        <TASForm
          onSubmit={handleSubmit(handleSubmitForm)}
          resolver={zodResolver(schema)}
          defaultValues={defaultValues}
        >
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TAFileupload
                name="image"
                label="Update Brand Image"
                setImageUrls={undefined}
              />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography fontWeight="semi-bold" mb={1}>
                Brand Name
              </Typography>
              <TASInput
                size="medium"
                fullWidth
                name="brand"
                label="Brand Name "
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Button sx={{color:'white'}} type="submit">Edit Brand</Button>
            </Grid>
          </Grid>
        </TASForm>
      </Box>
    </TASRightSideModal>
  );
};

export default EditBarcodeModal;
