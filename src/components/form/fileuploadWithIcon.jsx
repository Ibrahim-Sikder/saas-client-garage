/* eslint-disable react/prop-types */
import { Typography, Box, alpha } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Controller, useFormContext } from "react-hook-form";
import TASFileupload from "./Fileupload";

const CategoryImageUpload = ({ previewImage, handleImageChange }) => {
  const { control } = useFormContext();

  return (
    <>
      <Typography variant="subtitle2" gutterBottom fontWeight={500}>
        Category Image
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: "200px",
          border: "2px dashed #6a1b9a",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          bgcolor: alpha("#6a1b9a", 0.05),
          "&:hover": {
            bgcolor: alpha("#6a1b9a", 0.1),
          },
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => document.getElementById("category-image-upload").click()}
      >
        {previewImage ? (
          <img
            src={previewImage || "/placeholder.svg"}
            alt="Category Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <>
            <PhotoCameraIcon sx={{ fontSize: 40, color: "#6a1b9a", mb: 1 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              Click to upload or drag and drop
              <br />
              <Typography variant="caption" component="span">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </Typography>
            </Typography>
          </>
        )}

        <Controller
          name="image"
          control={control}
          rules={{ required: "Image is required" }}
          render={({ field: { onChange } }) => (
            <TASFileupload
              id="category-image-upload"
              name="image"
              style={{ display: "none" }}
              onChange={(e) => {
                handleImageChange(e.target.files);
                onChange(e.target.files); 
              }}
            />
          )}
        />
      </Box>
    </>
  );
};

export default CategoryImageUpload;

