/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  InputAdornment,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { LocalOffer } from "@mui/icons-material";

const TagsInput = ({ name = "tags" }) => {
  const { control, setValue, getValues } = useFormContext();

  const handleAddTag = (tag) => {
    if (!tag.trim()) return;
    const currentTags = getValues(name) || [];
    if (!currentTags.includes(tag)) {
      setValue(name, [...currentTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = getValues(name) || [];
    setValue(
      name,
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Product Tags
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tags help in searching and categorizing products
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {field.value.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                sx={{
                  bgcolor: alpha("#6a1b9a", 0.1),
                  color: "#6a1b9a",
                  borderRadius: "8px",
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              placeholder="Add a tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(e.target.value);
                  e.target.value = "";
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalOffer sx={{ color: "action.active", mr: 1 }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "12px" },
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder="Add a tag"]'
                );
                if (input && input.value) {
                  handleAddTag(input.value);
                  input.value = "";
                }
              }}
              sx={{ borderRadius: "12px" }}
            >
              Add
            </Button>
          </Box>
        </>
      )}
    />
  );
};

export default TagsInput;
