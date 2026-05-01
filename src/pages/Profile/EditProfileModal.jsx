/* eslint-disable react/prop-types */
import {

  Button,
  Grid,
  CircularProgress,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import GarageModal from "../../components/Share/Modal/GarageModal";
import { purchaseBtn } from "../../utils/customStyle";
const EditProfileModal = ({
  open,
  userData,
  tenantInfo,
  onUpdate,
  isLoading = false,
  setOpen,

}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        confirmPassword: ""
      });
    }
    setErrors({});
  }, [userData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const updateData = {};

    if (formData.name !== userData.name) {
      updateData.name = formData.name;
    }

    if (formData.email !== userData.email) {
      updateData.email = formData.email;
    }

    if (formData.password) {
      updateData.password = formData.password;
    }

    // If no changes were made
    if (Object.keys(updateData).length === 0) {
      toast.error("No changes made");
      return;
    }

    onUpdate(updateData);
  };


  const title = 'Edit Profile Information'

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Update your personal information. Leave password fields blank to keep current password.
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || "Leave blank to keep current password"}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Tenant Information (Read-only) */}
            <Grid item xs={12}>
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                <strong>Organization:</strong> {tenantInfo?.name || "N/A"}<br />
                <strong>Domain:</strong> {tenantInfo?.domain || "N/A"}<br />
                <strong>Business Type:</strong> {tenantInfo?.businessType || "N/A"}
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={purchaseBtn}
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} sx={{ color: "white", mr: 1 }} />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </DialogActions>
      </form>
    </GarageModal>
  );
};

export default EditProfileModal;