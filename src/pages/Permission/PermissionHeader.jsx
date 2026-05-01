import { Card, Typography, Box, useTheme, alpha } from "@mui/material";

const PermissionHeader = () => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        p: 2,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.8)}, ${alpha(theme.palette.primary.dark, 0.9)})`,
        color: "white",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box position="absolute" top={-20} right={-20} width={200} height={200} borderRadius="50%"
           sx={{ background: alpha(theme.palette.primary.light, 0.1) }} />
      <Box position="absolute" bottom={-30} left={-30} width={250} height={250} borderRadius="50%"
           sx={{ background: alpha(theme.palette.primary.light, 0.1) }} />

      <Box position="relative" zIndex={1}>
        <Typography variant="h3" fontWeight="bold" mb={1}>
          Permission Management
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
          Advanced permission control and access management system
        </Typography>
      </Box>
    </Card>
  );
};

export default PermissionHeader;
