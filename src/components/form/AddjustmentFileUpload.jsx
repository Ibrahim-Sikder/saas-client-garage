/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { CloudUpload } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import uploadFile from "../../helper/uploadFile";

const AddjustmentFileUpload = ({
  name,
  label = "Upload Image",
  uploadBoxStyles = {},
  defaultValues,
}) => {
  const { control, setValue } = useFormContext();
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
      setValue(name, uploadedUrls);
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
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              background: "#f8faff",
              border: "2px dashed #c2c2c2",
              width: "500px",
              height: "180px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
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
            <CloudUpload sx={{ color: "#9e9e9e", fontSize: 40 }} />
            <Typography
              component="p"
              fontSize="14px"
              fontWeight="bold"
              color="#666"
              sx={{ marginTop: 1 }}
            >
              {loading ? "Uploading..." : label}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "flex-start",
              marginTop: "20px",
            }}
          >
            {imageUrls.length > 0 &&
              imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />
              ))}
          </Box>
          {error && (
            <Typography
              component="p"
              fontSize="12px"
              fontWeight="bold"
              color="red"
              sx={{ marginTop: 1 }}
            >
              {error}
            </Typography>
          )}
        </Box>
      )}
    />
  );
};

export default AddjustmentFileUpload;
