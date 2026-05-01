/* eslint-disable react/prop-types */
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Grid,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaCrown,
  FaEdit,
  FaExclamationTriangle,
  FaGlobe,
  FaLock,
  FaUnlock,
  FaCamera,
} from "react-icons/fa";
import { GradientCard } from "../../utils/customStyle";
import toast from "react-hot-toast";
import { useUpdateUserMutation } from "../../redux/api/userApi";
import uploadFile from "../../helper/uploadFile";
import EditProfileModal from "./EditProfileModal";



const ProfileHeader = ({
  userData,
  tenantInfo,
  subscription,
  getSubscriptionStatusColor,
  tenantDomain
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const fileInputRef = useRef(null);

  // Debugging effect
  useEffect(() => {

  }, [isEditing]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");

    try {
      // Upload to Cloudinary using your reusable function
      const uploadResponse = await uploadFile(file);

      if (!uploadResponse.secure_url) {
        throw new Error("Upload failed - no URL returned");
      }

      const imageUrl = uploadResponse.secure_url;

      // Update user profile with the Cloudinary URL
      const updateData = {
        image: imageUrl,
      };

      await updateUser({
        tenantDomain,
        id: userData?._id,
        data: updateData,
      }).unwrap();

      toast.success("Profile image updated successfully!", {
        id: uploadToast,
      });

      setTimeout(() => {
        setPreviewImage(null);
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.message || "Failed to upload image. Please try again.",
        {
          id: uploadToast,
        }
      );
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdateProfile = async (updateData) => {
    const updateToast = toast.loading("Updating profile...");

    try {
      await updateUser({
        tenantDomain,
        id: userData?._id,
        data: updateData,
      }).unwrap();

      toast.success("Profile updated successfully!", {
        id: updateToast,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error?.data?.message || "Failed to update profile. Please try again.",
        {
          id: updateToast,
        }
      );
    }
  };

  const getCurrentProfileImage = () => {
    if (previewImage) return previewImage;
    if (userData?.image) return userData.image;
    return "/placeholder.svg?height=120&width=120";
  };

  const handleEditClick = () => {

    setIsEditing(true);
  };

  return (
    <>
      <div

      >
        <GradientCard sx={{ mb: 4, overflow: "visible" }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={getCurrentProfileImage()}
                      alt={userData?.name}
                      sx={{
                        width: 140,
                        height: 140,
                        border: "4px solid rgba(255,255,255,0.3)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        cursor: "pointer",

                      }}
                      onClick={handleAvatarClick}
                    />

                    {/* Upload Overlay */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 1,
                        },
                      }}
                      onClick={handleAvatarClick}
                    >
                      {isUploading ? (
                        <CircularProgress size={30} sx={{ color: "white" }} />
                      ) : (
                        <FaCamera size={30} color="white" />
                      )}
                    </Box>

                    {/* Upload Progress Indicator */}
                    {isUploading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -10,
                          left: -10,
                          right: -10,
                          bottom: -10,
                          borderRadius: "50%",
                          border: "3px solid rgba(59, 130, 246, 0.3)",
                          borderTop: "3px solid #3b82f6",
                          animation: "spin 1s linear infinite",
                          "@keyframes spin": {
                            "0%": { transform: "rotate(0deg)" },
                            "100%": { transform: "rotate(360deg)" },
                          },
                        }}
                      />
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </Box>
                </motion.div>

                {/* Upload Status */}
                {isUploading && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      mt: 1,
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: "bold",
                    }}
                  >
                    Uploading...
                  </Typography>
                )}
              </Grid>

              <Grid item xs>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {userData?.name || "User Name"}
                    <Tooltip title="Verified Account">
                      <FaCheckCircle style={{ color: "#4CAF50" }} />
                    </Tooltip>
                    {!subscription?.isPaid && (
                      <Tooltip title="Payment Required">
                        <FaExclamationTriangle style={{ color: "#FF9800" }} />
                      </Tooltip>
                    )}
                  </Typography>

                  <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
                    {userData.role || "User"} •{" "}
                    {tenantInfo.name || "Organization"}
                  </Typography>

                  <Typography variant="h6" sx={{ opacity: 0.8, mb: 2 }}>
                    {userData.email}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      icon={<FaCrown />}
                      label={`${subscription?.plan || "Free"} Plan`}
                      sx={{
                        background: "linear-gradient(45deg, #FFD700, #FFA500)",
                        color: "black",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    />

                    <Chip
                      icon={
                        subscription?.status === "Expired" ? (
                          <FaExclamationTriangle />
                        ) : (
                          <FaCalendarAlt />
                        )
                      }
                      label={`${subscription?.status || "Unknown"}`}
                      sx={{
                        bgcolor: getSubscriptionStatusColor(subscription?.status),
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />

                    <Chip
                      icon={subscription?.isPaid ? <FaUnlock /> : <FaLock />}
                      label={subscription?.isPaid ? "Paid" : "Unpaid"}
                      sx={{
                        bgcolor: subscription?.isPaid ? "#4CAF50" : "#f44336",
                        color: "white",
                        fontWeight: "bold",
                        animation: !subscription?.isPaid
                          ? "pulse 2s infinite"
                          : "none",
                      }}
                    />

                    <Chip
                      icon={<FaGlobe />}
                      label={`${tenantInfo?.domain || "domain"}.app`}
                      color="secondary"
                      variant="outlined"
                      sx={{
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "white",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<FaEdit />}
                    onClick={handleEditClick}
                    disabled={isUploading}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "",
                      px: 3,
                      py: 1.5,
                      borderRadius: "12px",


                      transition: "all 0.3s ease",
                    }}
                  >
                    Edit Profile
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </GradientCard>
      </div>

      <EditProfileModal
        open={isEditing}
        setOpen={setIsEditing}
        userData={userData}
        tenantInfo={tenantInfo}
        onUpdate={handleUpdateProfile}
        isLoading={isUpdating}
        tenantDomain={tenantDomain}
      />
    </>
  );
};

export default ProfileHeader;