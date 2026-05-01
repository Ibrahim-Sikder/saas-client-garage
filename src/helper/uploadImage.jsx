/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import BackupIcon from "@mui/icons-material/Backup";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import uploadFile from "./uploadFile";

const ImageUploader = ({
  name,
  sx,
  setUploadedFile,
  uploadedFile,
  upload_file,
}) => {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (event) => {
    setLoading(true);
    const file = event.target.files?.[0];
    if (file) {
      const uploadResponse = await uploadFile(file);
      setUploadedFile(uploadResponse?.secure_url);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: "20px",
        borderRadius: "8px",
        border: "1px dashed #ddd",
        width: {
          lg: "300px",
          xs: "200px",
        },
        textAlign: "center",
        margin: "0 auto",
        marginTop: {
          lg: "25px",
          sm: "0px",
        },
      }}
    >
      <Box sx={sx}>
        <input
          type="file"
          id="files"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="files"
          className="cursor-pointer py-2 rounded-md shadow-[rgba(0, 0, 0, 0.1) 0px 1px 2px 0px]"
          style={{ display: uploadedFile ? "none" : "block" }}
        >
          {!upload_file && !loading && (
            <>
              <BackupIcon
                sx={{
                  mr: 2,
                  color: "#111",
                  fontSize: 60,
                  background: "#E8EDFF",
                  padding: "10px",
                  borderRadius: "100%",
                }}
              />

              <Typography component="h2">
                Choose File to Upload Your Documents
              </Typography>
            </>
          )}
        </label>
        {loading ? (
          <Typography
            component="h2"
            width={300}
            height={200}
            className="flex items-center justify-center"
          >
            Uploading...
          </Typography>
        ) : (
          <>
            {(uploadedFile || upload_file) && (
              <Box mt={2}>
                <Box mt={2}>
                  <img
                    src={uploadedFile || upload_file}
                    width="100%"
                    height="100%"
                    title="Uploaded Document"
                    className=" overflow-hidden"
                  />
                </Box>
              </Box>
            )}
          </>
        )}
        {(uploadedFile || upload_file) && (
          <Box mt={2}>
            <label
              htmlFor="files"
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                background: "#059065",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Upload Another
            </label>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageUploader;
