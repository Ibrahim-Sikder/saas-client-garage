/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { CloudUpload } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import uploadFile from "../../helper/uploadFile";

const TASFileupload = ({
  name,
  label = "Upload Image",
  uploadBoxStyles = {},
  defaultValues,
}) => {
  const { control, setValue, watch } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imageUrl = watch(name); // now imageUrl is string (or undefined)

  const handleFileChange = async (e, onChange) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const uploaded = await uploadFile(file);
      if (uploaded?.secure_url) {
        const url = uploaded.secure_url;
        onChange(url); // set as string
        setValue(name, url, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValues || ""}
      render={({ field: { onChange } }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              background: "#f8faff",
              border: "2px dashed #c2c2c2",
              width: "250px",
              height: "180px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              ...uploadBoxStyles,
            }}
            onClick={() =>
              document.getElementById(`image-upload-${name}`).click()
            }
          >
            <input
              accept="image/*"
              id={`image-upload-${name}`}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, onChange)}
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

          {imageUrl && (
            <Box sx={{ marginTop: "10px" }}>
              <img
                src={imageUrl}
                alt="Uploaded"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
              />
            </Box>
          )}

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

export default TASFileupload;
