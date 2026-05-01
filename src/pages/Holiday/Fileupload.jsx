/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import { Button, Box } from "@mui/material";
import { FileText } from "lucide-react";

const HolidayFileUpload = ({ name, label, accept, multiple = true }) => {
  const { control } = useFormContext();

  const handleFileChange = (e, onChange) => {
    const files = Array.from(e.target.files);
    // Check the file types if needed
    const validFiles = files.filter((file) => file.type.match(accept));
    if (validFiles.length > 0) {
      onChange(validFiles); // Pass the valid files to the form state
    } else {
      // Optionally, display a message if no valid files were selected
      alert("Invalid file format selected.");
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { onChange, value } }) => (
        <Box>
          <input
            accept={accept}
            style={{ display: "none" }}
            id={name}
            type="file"
            multiple={multiple}
            onChange={(e) => handleFileChange(e, onChange)}
          />
          <label htmlFor={name}>
            <Button
              variant="outlined"
              component="span"
              startIcon={<FileText />}
            >
              {label || "Upload Attachments"}
            </Button>
          </label>

          {/* Display the selected file names */}
          {value.length > 0 && (
            <Box mt={1}>
              <ul>
                {value.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      )}
    />
  );
};

export default HolidayFileUpload;
