/* eslint-disable react/prop-types */
import { Typography, Grid, Box } from "@mui/material";
import { formatDate } from "../../../utils/formateDate";
import GarageModal from "../../../components/Share/Modal/GarageModal";

const ProductDetailsModal = ({ open, onClose, product, setOpen }) => {
  if (!product) return null;

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title="Product Details"
      maxWidth="md"
    >
      <Box sx={{ mt: 2 }}>
        <Box display="flex" justifyContent="space-between">
          {product.image && (
            <Grid item xs={12}>
              <img
                src={product.image}
                alt={product.product_name}
                style={{ maxWidth: 200, marginTop: 5 }}
              />
            </Grid>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>
              <b>Code:</b> {product.product_code}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Name:</b> {product.product_name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Batch Number:</b> {product.batchNumber || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Brand ID:</b> {product.brand || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Category ID:</b> {product.category || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Product Type ID:</b> {product.product_type || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Unit ID:</b> {product.unit || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Warehouse ID:</b> {product.warehouse || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Suppliers ID:</b> {product.suppliers || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Warranties ID:</b> {product.warranties || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Status:</b> {product.productStatus || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Initial Stock:</b> {product.initialStock}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Stock Quantity:</b> {product.product_quantity}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Reorder Level:</b> {product.reorderLevel}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Stock Alert:</b> {product.stock_alert}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Selling Price:</b> ৳{product.sellingPrice?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Purchase Price:</b> ৳{product.purchasePrice?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Minimum Sale Price:</b> ৳{product.minimumSalePrice?.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Discount:</b> ৳{product.discount}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Expense:</b> ৳{product.expense}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Shipping:</b> ৳{product.shipping}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Tax Method:</b> {product.tax_method || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Product Tax:</b> {product.product_tax}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Expiry Date:</b> {formatDate(product.expiryDate)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Expiry Alert Days:</b> {product.expiryAlertDays}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Expiry Date Type:</b> {product.expiryDateType}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Last Purchase Date:</b> {formatDate(product.lastPurchaseDate)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Last Sold Date:</b> {formatDate(product.lastSoldDate)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Storage Location:</b> {product.storageLocation || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Shelf Life:</b> {product.shelfLife || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Created At:</b> {formatDate(product.createdAt)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              <b>Updated At:</b> {formatDate(product.updatedAt)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </GarageModal>
  );
};

export default ProductDetailsModal;
