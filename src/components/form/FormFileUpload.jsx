/* eslint-disable react/prop-types */
import { Controller } from "react-hook-form"
import { Box, Typography, CircularProgress } from "@mui/material"
import { FaFileAlt } from "react-icons/fa"
import { styled } from "@mui/system"

const UploadButton = styled("button")({
  backgroundColor: "#42A1DA",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
})

const FilePreview = styled("div")({
  display: "flex",
  alignItems: "center",
  marginTop: "8px",
})

const FormFileUpload = ({ control, name, loading, url, onUpload, margin = "normal" }) => {
  // This function will handle the file change without submitting the form
  const handleFileChange = (e, onChange) => {
    // Prevent default behavior which might trigger form submission
    e.preventDefault()

    // Update the form field value
    onChange(e)

    // Call the custom upload handler
    if (onUpload) {
      onUpload(e)
    }
  }

  return (
    <Box sx={{ margin }}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <div>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <FaFileAlt className="text-[#42A1DA] mt-1 mr-2" />
              <Typography variant="subtitle1" fontWeight="medium">
                Supporting Document
              </Typography>
            </Box>

            <input
              type="file"
              id={name}
              className="hidden"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e, onChange)}
            />

            <label htmlFor={name}>
              <UploadButton
                component="span"
                disabled={loading}
                type="button"
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Uploading...
                  </>
                ) : (
                  <>{url ? "Change Document" : "Attach Document"}</>
                )}
              </UploadButton>
            </label>

            {url && (
              <FilePreview>
                <FaFileAlt className="text-[#42A1DA] mr-2" />
                <Typography variant="body2">Document uploaded successfully</Typography>
              </FilePreview>
            )}
          </div>
        )}
      />
    </Box>
  )
}

export default FormFileUpload

