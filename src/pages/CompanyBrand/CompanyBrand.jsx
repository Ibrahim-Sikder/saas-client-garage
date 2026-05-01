import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Grid,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import {
  useCreateCompanyBrandMutation,
  useGetAllCompanyBrandsQuery,
  useDeleteCompanyBrandMutation,
} from "../../redux/api/companyBrandApi";
import swal from "sweetalert";
import uploadFile from "../../helper/uploadFile";
import { useTenantDomain } from "../../hooks/useTenantDomain";

const CompanyBrand = () => {
  const [preview, setPreview] = useState(null);

  const { tenantDomain } = useTenantDomain();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();
  const { data, isLoading } = useGetAllCompanyBrandsQuery({});

  const [createCompanyBrand] = useCreateCompanyBrandMutation();
  const [deleteCompanyBrand] = useDeleteCompanyBrandMutation();

  const handleFilePreview = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const file = formData.logo?.[0];
      if (!file) {
        swal("Error", "Please select a logo!", "error");
        return;
      }
      const uploaded = await uploadFile(file);
      if (!uploaded?.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      await createCompanyBrand({
        tenantDomain,
        logo: uploaded.secure_url,
      }).unwrap();
      swal("Success!", "Logo uploaded successfully", "success");
      reset();
      setPreview(null);
    } catch (error) {
      swal("Error", error?.message || "Failed to upload logo", "error");
    }
  };

  const handleDelete = async (id) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "This logo will be moved to recycle bin!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (!willDelete) return;

    try {
      await deleteCompanyBrand({ tenantDomain, id }).unwrap();
      swal("Deleted!", "Logo deleted successfully", "success");
    } catch (error) {
      console.error("Delete error:", error);
      swal("Error", "Failed to delete logo", "error");
    }
  };

  return (
    <Box p={4} sx={{ maxWidth: 700, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        sx={{ textAlign: "center", mb: 4, color: "primary.main" }}
      >
        Company Brand Logo Management
      </Typography>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          mb: 5,
          background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
        }}
      >
        {preview && (
          <Avatar
            src={preview}
            alt="Logo preview"
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 2,
              border: "3px solid #1976d2",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            sx={{
              mb: 1.5,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              borderRadius: 2,
            }}
          >
            Choose Logo
            <input
              type="file"
              hidden
              accept="image/*"
              {...register("logo", {
                required: "Please select a logo!",
                onChange: handleFilePreview,
              })}
            />
          </Button>
          {errors.logo?.message && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errors.logo.message}
            </Typography>
          )}

          <Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ fontWeight: 600, borderRadius: 2, px: 4, py: 1.5 }}
            >
              {isSubmitting ? "Uploading..." : "Upload Logo"}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Uploaded Logos List */}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
        Uploaded Logos
      </Typography>

      {isLoading ? (
        <Typography>Loading logos...</Typography>
      ) : !data?.data?.data?.length ? (
        <Typography color="text.secondary">No logos uploaded yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {data?.data?.data.map((brand) => (
            <Grid item xs={6} sm={4} md={3} key={brand._id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  position: "relative",
                }}
              >
                <Avatar
                  src={brand.logo}
                  alt="Brand Logo"
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 1,
                    border: "2px solid #1976d2",
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleDelete(brand._id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#ffe5e5" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CompanyBrand;
