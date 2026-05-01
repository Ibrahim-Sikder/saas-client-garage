/* eslint-disable react/prop-types */
// ProductStatusSelector.js
import { Controller, useFormContext } from "react-hook-form";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";

const statuses = [
  { label: "Active", value: "active", color: "#2e7d32", hover: "#1b5e20" },
  { label: "Low Stock", value: "low_stock", color: "#ed6c02", hover: "#e65100" },
  { label: "Out of Stock", value: "out_of_stock", color: "#d32f2f", hover: "#c62828" },
  { label: "Discontinued", value: "discontinued", color: "#616161", hover: "#424242" },
];

const ProductStatusSelector = ({ name = "status" }) => {
  const { control } = useFormContext();

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Product Status
      </Typography>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              overflowX: "auto",
              flexWrap: "nowrap",
              pb: 1,
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#ccc",
                borderRadius: 3,
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#999",
              },
            }}
          >
            {statuses.map((status) => {
              const isActive = field.value === status.value;
              return (
                <Chip
                  key={status.value}
                  label={status.label}
                  clickable
                  onClick={() => field.onChange(status.value)}
                  sx={{
                    bgcolor: isActive
                      ? status.color
                      : alpha(status.color, 0.1),
                    color: isActive ? "white" : status.color,
                    fontWeight: isActive ? 600 : 400,
                    "&:hover": {
                      bgcolor: isActive
                        ? status.hover
                        : alpha(status.color, 0.2),
                    },
                  }}
                />
              );
            })}
          </Stack>
        )}
      />
    </Box>
  );
};

export default ProductStatusSelector;
