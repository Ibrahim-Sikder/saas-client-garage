/* eslint-disable react/prop-types */
import {
  Alert,
  AlertTitle,
  alpha,
  Avatar,
  Box,
  Button,
  DialogActions,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import GarageModal from "../../../components/Share/Modal/GarageModal";

export default function ProductDetailsDialog({
  setOpen,
  handleCloseDialog,
  selectedProduct,
  getStatusChip,
  open,
}) {
  const theme = useTheme();

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title=" Expired Product Details"
      maxWidth="md"
    >
      {selectedProduct && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Avatar
                src={selectedProduct.image}
                alt={selectedProduct.name}
                variant="rounded"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  boxShadow: `0 8px 24px ${alpha(
                    theme.palette.text.primary,
                    0.15
                  )}`,
                }}
              />
              <Typography variant="h6" gutterBottom align="center">
                {selectedProduct.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                gutterBottom
              >
                {selectedProduct.code}
              </Typography>
              <Box sx={{ mt: 2, width: "100%" }}>
                {getStatusChip(
                  selectedProduct.status,
                  selectedProduct.daysExpired
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Category
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.category}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Brand
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.brand}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Expiry Date
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.error.main,
                  }}
                >
                  {selectedProduct.expiryDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Quantity
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.quantity} units
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.location}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Batch Number
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.batchNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Purchase Date
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.purchaseDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Supplier
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.supplier}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="text.secondary">
                  Disposal Method
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {selectedProduct.disposalMethod}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Alert
                  severity="error"
                  variant="outlined"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    borderWidth: 1.5,
                  }}
                >
                  <AlertTitle>Warning</AlertTitle>
                  This product has expired. It should be disposed of
                  immediately. Using expired products is not safe.
                </Alert>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleCloseDialog} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </GarageModal>
  );
}
