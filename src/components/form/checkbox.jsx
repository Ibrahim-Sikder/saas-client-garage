/* eslint-disable react/prop-types */
import { Controller, useFormContext } from "react-hook-form";
import {
  Card,
  Box,
  Typography,
  Checkbox,
  alpha,
  useTheme,
} from "@mui/material";

const colorMap = {
  create: "success",
  edit: "info",
  view: "primary",
  delete: "error",
};

const FormCheckBox = ({ name, label, description }) => {
  const { control } = useFormContext();
  const theme = useTheme();

  const colorKey = colorMap[name] || "secondary";
  const mainColor = theme.palette[colorKey].main;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <Card
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: `1px solid ${alpha(mainColor, 0.2)}`,
            bgcolor: alpha(mainColor, 0.05),
            transition: "all 0.3s",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              bgcolor: alpha(mainColor, 0.1),
            },
          }}
        >
          <Box display="flex" alignItems="center" mb={1}>
            <Checkbox
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              color={colorKey}
            />
            <Typography variant="body2" fontWeight={500}>
              {label}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Card>
      )}
    />
  );
};

export default FormCheckBox;
