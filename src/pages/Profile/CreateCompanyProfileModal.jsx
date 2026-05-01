/* eslint-disable react/prop-types */
"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Language as WebsiteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import {
  useCreateCompanyProfileMutation,
  useUpdateCompanyProfileMutation,
} from "../../redux/api/companyProfile";
import GarageForm from "../../components/form/Form";
import TASInput from "../../components/form/Input";
import ImageUpload from "../../components/form/ImageUpload";
import { toast } from "react-toastify";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import TASTimePicker from "../../components/form/TimePicker";

export default function CompanyProfileModal({ profileData, open, onClose }) {
  const { tenantDomain } = useTenantDomain();

  const [createCompanyProfile] = useCreateCompanyProfileMutation();
  const [updateCompanyProfile] = useUpdateCompanyProfileMutation();

  const isUpdateMode = Boolean(profileData?._id);

  const handleSave = async (formData) => {
    try {
      const finalLogo =
        Array.isArray(formData.logo) && Array.isArray(formData.logo[0])
          ? formData.logo[0]
          : formData.logo;

      const payload = {
        ...formData,
        logo: finalLogo,
      };

      if (isUpdateMode) {
        const res = await updateCompanyProfile({
          tenantDomain,
          id: profileData._id,
          data: payload,
        }).unwrap();

        if (res.success) {
          toast.success("Company profile updated successfully!");
          onClose();
        }
      } else {
        const res = await createCompanyProfile({
          tenantDomain,
          data: payload,
        }).unwrap();

        if (res.success) {
          toast.success("Company profile created successfully!");
          onClose();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        isUpdateMode ? "Failed to update profile" : "Failed to create profile"
      );
    }
  };

  const handleClose = () => onClose();

  const defaultValues = {
    address: profileData?.address || "",
    companyName: profileData?.companyName || "",
    companyNameBN: profileData?.companyNameBN || "",
    description: profileData?.description || "",
    email: profileData?.email || "",
    logo: profileData?.logo || [],
    phone: profileData?.phone || "",
    website: profileData?.website || "",
    whatsapp: profileData?.whatsapp || "",
    officeTime: profileData?.officeTime || 10.0,
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1.5, pt: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" color="primary" fontWeight={600}>
              {isUpdateMode
                ? "Update Company Profile"
                : "Create Company Profile"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              This information will appear on all your documents
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <GarageForm onSubmit={handleSave} defaultValues={defaultValues}>
        <DialogContent dividers sx={{ pt: 3, pb: 3 }}>
          <Alert
            severity="info"
            sx={{ mb: 3, borderRadius: 2, bgcolor: "info.light" }}
          >
            <Typography variant="body2">
              <strong>Heads Up:</strong> Set up your company information to
              appear on all documents and communications.
            </Typography>
          </Alert>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={2}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <ImageUpload
                  name="logo"
                  label="Upload Company Logo"
                  defaultImage={profileData?.logo || []}
                  defaultValues={profileData?.logo || []}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  Recommended: 200x200px (PNG/JPG)
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TASInput
                    name="companyNameBN"
                    label="Company Name Bangla"
                    icon={BusinessIcon}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TASInput
                    name="companyName"
                    label="Company Name"
                    icon={BusinessIcon}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TASInput
                    name="email"
                    label="Email Address"
                    type="email"
                    icon={EmailIcon}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TASInput
                    name="phone"
                    label="Phone Number"
                    icon={PhoneIcon}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TASInput
                    name="whatsapp"
                    label="WhatsApp Number"
                    icon={WhatsAppIcon}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TASInput
                    name="website"
                    label="Website URL"
                    icon={WebsiteIcon}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TASTimePicker
                    name="officeTime"
                    label="Start Time"
                    icon={WebsiteIcon}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TASInput
                    name="address"
                    label="Address"
                    icon={LocationIcon}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TASInput
                    name="description"
                    label="Company Description"
                    icon={BusinessIcon}
                    multiline
                    rows={3}
                    placeholder="Tell us about your company and what services you provide..."
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ color: "#fff" }}
            variant="contained"
            startIcon={<SaveIcon />}
            type="submit"
          >
            {isUpdateMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </GarageForm>
    </Dialog>
  );
}
