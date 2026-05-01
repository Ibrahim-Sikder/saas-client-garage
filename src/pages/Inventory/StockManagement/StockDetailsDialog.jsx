/* eslint-disable react/prop-types */
"use client";

import {
  CalendarMonth as CalendarMonthIcon,
  Description as DescriptionIcon,
  Inventory as InventoryIcon,
  Label as LabelIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  DialogActions,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import GarageModal from "../../../components/Share/Modal/GarageModal";

export function StockDetailsDialog({ open, onClose, product, setOpen }) {
  if (!product) {
    return null;
  }

  // Extract data from the product object with proper fallbacks
  const {
    code = "N/A",
    name = "Unknown Product",
    category = "Uncategorized",
    subCategory = "N/A",
    image,
    currentStock = 0,
    inQuantity = 0,
    outQuantity = 0,
    minimumStock = 0,
    purchasePrice = 0,
    sellingPrice = 0,
    minimumSalePrice = 0,
    unit = "unit",
    shortUnit = "unit",
    warehouse = "N/A",
    status = "N/A",
    productDescription = "",
    brand = "N/A",
    productType = "N/A",
    supplier = "N/A",
    supplierCompany = "N/A",
    batchNumber = "N/A",
    expiryDate = "N/A",
    manufacturingDate = "N/A",
    storageLocation = "N/A",
    specifications = "N/A",
    tags = [],
    tax = 0,

    productStatus = "active",
    reorderLevel = 0,
    initialStock = 0,
    shelfLife = 0,
    shelfLifeUnit = "Days",

    lastPurchaseDate = "N/A",
    lastSoldDate = "N/A",
    totalPurchaseValue = 0,
    totalSellingValue = 0,
    avgPurchasePrice = 0,
  } = product;

  // Calculate total value based on current stock and purchase price
  const totalValue = currentStock * purchasePrice;

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== "number") return "0 ৳";
    return amount.toLocaleString("en-US") + " ৳";
  };

  const title = "Product Details";

  return (
    <GarageModal open={open} setOpen={setOpen} title={title} maxWidth="lg">
      <Grid container spacing={3}>
        {/* Product Image and Basic Info */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                width: "100%",
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                bgcolor: "rgba(0, 0, 0, 0.02)",
              }}
            >
              <img
                src={image || "/placeholder.svg?height=200&width=200"}
                alt={name}
                width={150}
                height={150}
                style={{ objectFit: "contain" }}
              />
            </Paper>

            <Chip
              label={code}
              color="primary"
              sx={{ fontWeight: "bold", mb: 1 }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "center" }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              {category} {subCategory !== "N/A" ? `- ${subCategory}` : ""}
            </Typography>

            <Box
              sx={{
                mt: 1,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Chip
                label={status}
                color={
                  status === "low-stock"
                    ? "warning"
                    : status === "out-of-stock"
                      ? "error"
                      : "success"
                }
                size="small"
              />
              <Chip
                label={productStatus}
                color={productStatus === "active" ? "success" : "default"}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Basic Product Info */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Product Information
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Brand:
                </Typography>
                <Typography variant="body2">{brand}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Type:
                </Typography>
                <Typography variant="body2">{productType}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Supplier:
                </Typography>
                <Typography variant="body2">
                  {supplier} {supplierCompany && `(${supplierCompany})`}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Detailed Information */}
        <Grid item xs={12} md={8}>
          {/* Stock Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              <InventoryIcon sx={{ mr: 1, fontSize: 20 }} />
              Stock Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Current Stock:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {currentStock} {shortUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Stock In:
                </Typography>
                <Typography variant="body1" color="success.main">
                  +{inQuantity} {shortUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Stock Out:
                </Typography>
                <Typography variant="body1" color="error.main">
                  -{outQuantity} {shortUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Min Stock Alert:
                </Typography>
                <Typography variant="body1">
                  {minimumStock} {shortUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Reorder Level:
                </Typography>
                <Typography variant="body1">
                  {reorderLevel} {shortUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Initial Stock:
                </Typography>
                <Typography variant="body1">
                  {initialStock} {shortUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Warehouse:
                </Typography>
                <Typography variant="body1">{warehouse}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Unit:
                </Typography>
                <Typography variant="body1">
                  {unit} ({shortUnit})
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Pricing Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              <MonetizationOnIcon sx={{ mr: 1, fontSize: 20 }} />
              Pricing Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Purchase Price:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {formatCurrency(purchasePrice)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Selling Price:
                </Typography>
                <Typography variant="body1" color="success.main">
                  {formatCurrency(sellingPrice)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Min Sale Price:
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(minimumSalePrice)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Current Value:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {formatCurrency(totalValue)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Purchase Value:
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(totalPurchaseValue)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Selling Value:
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(totalSellingValue)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Avg Purchase Price:
                </Typography>
                <Typography variant="body1">
                  {formatCurrency(avgPurchasePrice)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Additional Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Batch Number:
                </Typography>
                <Typography variant="body1">{batchNumber}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Storage Location:
                </Typography>
                <Typography variant="body1">{storageLocation}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Tax:
                </Typography>
                <Typography variant="body1">{tax}%</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Specifications:
                </Typography>
                <Typography variant="body1">
                  {specifications || "No specifications available"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Description:
                </Typography>
                <Typography variant="body1">
                  {productDescription || "No description available"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Tags:
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  {tags && tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                        icon={<LabelIcon />}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No tags available
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Dates & Expiry Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                mb: 1,
              }}
            >
              <CalendarMonthIcon sx={{ mr: 1, fontSize: 20 }} />
              Dates & Expiry
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Manufacturing Date:
                </Typography>
                <Typography variant="body1">
                  {formatDate(manufacturingDate)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Expiry Date:
                </Typography>
                <Typography variant="body1">
                  {formatDate(expiryDate)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Shelf Life:
                </Typography>
                <Typography variant="body1">
                  {shelfLife} {shelfLifeUnit}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Purchase:
                </Typography>
                <Typography variant="body1">
                  {formatDate(lastPurchaseDate)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Sold:
                </Typography>
                <Typography variant="body1">
                  {formatDate(lastSoldDate)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.1)" }}
      >
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Edit Product
        </Button>
      </DialogActions>
    </GarageModal>
  );
}
