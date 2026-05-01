/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
"use client";

import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Lock,
  ArrowDropDown,
} from "@mui/icons-material";
import { useState } from "react";
import { useCreateUserMutation } from "../../redux/api/userApi";
import { toast } from "react-toastify";
import GarageModal from "../../components/Share/Modal/GarageModal";
import FormInput from "../../components/form/Input";
import GarageForm from "../../components/form/Form";
import { usePermissionFormData } from "../../hooks/usePermissionFormData";
import FormAutoCompleted from "../../components/form/FormAutoCompleted";
import Can from "../../components/Can";

const AddUserModal = ({
  open,
  onClose,
  onSuccess,
  performActionWithPermission,
  tenantDomain,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { roleOptions } = usePermissionFormData();

  const handleSubmit = async (data, reset) => {
    performActionWithPermission(
      "/dashboard/all-user-list",
      "delete",
      async () => {
        try {
          if (data.password !== data.confirmPassword) {
            return toast.error("Passwords do not match");
          }
          const submitData = {
            name: data.name,
            createdBy: data.createdBy || "system",
            email: data.email,
            password: data.password,
            tenantDomain: tenantDomain,
            role: data.role?.[0]?.label || data.role?.label,
          };
          const result = await createUser(submitData).unwrap();

          if (result.success) {
            toast.success(result.message || "User created successfully");
            onSuccess?.();
            onClose();
            reset();
          }
        } catch (error) {
          console.error("Error details:", error);
          const message = error?.data?.message || "Failed to create user";
          toast.error(message);
        }
      },
      "You don't have permission to create a user !",
    );
  };

  return (
    <GarageModal
      open={open}
      setOpen={onClose}
      title="Create New User"
      maxWidth="md"
    >
      <GarageForm
        onSubmit={handleSubmit}
        defaultValues={{
          tenantDomain: tenantDomain,
        }}
      >
        <Grid container spacing={2} padding={1}>
          {/* Full Name Field */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="name"
              label="Full Name"
              placeholder="Enter user name"
              required
              icon={Person}
              iconPosition="start"
            />
          </Grid>

          {/* Email Field */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="email"
              label="Email"
              placeholder="Enter email address"
              required
              icon={Email}
              iconPosition="start"
            />
          </Grid>

          {/* Tenant Domain Field */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="tenantDomain"
              label="Tenant Domain"
              disabled
              required
              icon={ArrowDropDown}
              iconPosition="end"
            />
          </Grid>

          {/* Role Selection */}
          <Grid item xs={12} md={6}>
            <FormAutoCompleted
              name="role"
              label="Select Role"
              options={roleOptions}
              size="normal"
              icon={ArrowDropDown}
              iconPosition="end"
            />
          </Grid>

          {/* Password Field */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              icon={Lock}
              iconPosition="start"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
            />
          </Grid>

          {/* Confirm Password Field */}
          <Grid item xs={12} md={6}>
            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              required
              icon={Lock}
              iconPosition="start"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              rules={{
                required: "Please confirm your password",
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match",
              }}
            />
          </Grid>

          {/* Terms and Conditions */}
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox name="agreeTerms" color="primary" />}
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <a href="/terms" style={{ color: "#1976d2" }}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" style={{ color: "#1976d2" }}>
                    Privacy Policy
                  </a>
                </Typography>
              }
            />
            <FormInput
              name="agreeTerms"
              type="checkbox"
              rules={{ required: "You must agree to the terms and conditions" }}
              sx={{ display: "none" }}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box className="flex flex-col md:flex-col space-y-2 items-center mb-4">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="outlined"
            className="flex items-center justify-center content-center"
          >
            Cancel
          </Button>
          <Can page="/dashboard/all-user-list" action="create">
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ minWidth: 140 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create User"
              )}
            </Button>
          </Can>
        </Box>
      </GarageForm>
    </GarageModal>
  );
};

export default AddUserModal;
