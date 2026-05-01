"use client";

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PhotoCamera as PhotoCameraIcon } from "@mui/icons-material";
import { Box, Typography, alpha } from "@mui/material";
import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import uploadFile from "../../helper/uploadFile";

const ImageUpload = ({
  name,
  label = "Upload Image",
  uploadBoxStyles = {},
  defaultValues,
}) => {
  const { control, setValue, getValues } = useFormContext();
  const [imageUrls, setImageUrls] = useState(
    defaultValues ? [defaultValues] : [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setImageUrls([defaultValues]);
      setValue(name, [defaultValues]);
    }
  }, [defaultValues, name, setValue]);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const uploadPhoto = await uploadFile(files[i]);
        if (uploadPhoto?.secure_url) {
          uploadedUrls.push(uploadPhoto.secure_url);
        } else {
          throw new Error("Invalid image URL format");
        }
      }

      setImageUrls(uploadedUrls);

      setValue(name, uploadedUrls, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } catch (error) {
      setError(error.message || "Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValues ? [defaultValues] : []}
      render={({ field }) => (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: { xs: "120px", sm: "150px", md: "200px" },
              border: "2px dashed #6a1b9a",
              borderRadius: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              bgcolor: "#fff",
              ...uploadBoxStyles,
            }}
            onClick={() => document.getElementById(`${name}-input`).click()}
          >
            <input
              id={`${name}-input`}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <PhotoCameraIcon sx={{ fontSize: 40, color: "#42A1DA", mb: 1 }} />
            <Typography variant="body2" color="text.secondary" align="center">
              {loading ? "Uploading..." : "Click to upload or drag and drop"}
              <br />
              <Typography variant="caption" component="span">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </Typography>
            </Typography>
          </Box>

          {imageUrls.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                mt: 2,
              }}
            >
              {imageUrls.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "#42A1DA",
                  }}
                >
                  <img
                    src={url || "/placeholder.svg"}
                    alt={`Uploaded ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {error && (
            <Typography
              component="p"
              fontSize="12px"
              fontWeight="bold"
              color="error"
              sx={{ mt: 1 }}
            >
              {error}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default ImageUpload;
