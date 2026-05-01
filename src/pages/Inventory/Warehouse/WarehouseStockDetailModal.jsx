/* eslint-disable react/prop-types */
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const WarehouseStockDetailModal = ({ open, onClose, warehouse }) => {
  if (!warehouse) return null;

  const {
    warehouse: warehouseInfo,
    products,
    totalProducts,
    totalQuantity,
  } = warehouse;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          width: 800,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Warehouse Stock Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Warehouse Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Name:</strong> {warehouseInfo?.name || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Warehouse ID:</strong>{" "}
                  {warehouseInfo?.warehouseId || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>City:</strong> {warehouseInfo?.city || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong> {warehouseInfo?.address || "—"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Manager:</strong> {warehouseInfo?.manager || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {warehouseInfo?.phone || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Type:</strong> {warehouseInfo?.type || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {warehouseInfo?.status || "—"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Stock Summary */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Stock Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "primary.light",
                    color: "white",
                  }}
                >
                  <Typography variant="h6">{totalProducts || 0}</Typography>
                  <Typography variant="body2">Total Products</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "success.light",
                    color: "white",
                  }}
                >
                  <Typography variant="h6">{totalQuantity || 0}</Typography>
                  <Typography variant="body2">Total Quantity</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: "info.light",
                    color: "white",
                  }}
                >
                  <Typography variant="h6">
                    {warehouseInfo?.capacity
                      ? `${totalQuantity}/${warehouseInfo.capacity}`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2">Capacity Usage</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Products Table */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Products in Warehouse ({products?.length || 0})
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>#</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Product Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Product Code</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Quantity</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products?.map((product, index) => (
                    <TableRow
                      key={product._id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor:
                          product.quantity === 0
                            ? "rgba(255, 0, 0, 0.05)"
                            : "inherit",
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {product.image && (
                            <Avatar
                              src={product.image}
                              alt={product.product_name}
                              variant="rounded"
                              sx={{ width: 32, height: 32 }}
                            />
                          )}
                          <Typography variant="body2">
                            {product.product_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{product.product_code}</TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          fontWeight={
                            product.quantity === 0 ? "bold" : "normal"
                          }
                          color={product.quantity === 0 ? "error" : "inherit"}
                        >
                          {product.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {product.quantity === 0 ? (
                          <Typography
                            variant="body2"
                            color="error"
                            fontWeight="bold"
                          >
                            Out of Stock
                          </Typography>
                        ) : product.quantity < 10 ? (
                          <Typography
                            variant="body2"
                            color="warning.main"
                            fontWeight="bold"
                          >
                            Low Stock
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="success.main"
                            fontWeight="bold"
                          >
                            In Stock
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!products || products.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No products found in this warehouse
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Additional Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Opening Date:</strong>{" "}
                  {warehouseInfo?.openingDate || "—"}
                </Typography>
                <Typography variant="body2">
                  <strong>Capacity:</strong>{" "}
                  {warehouseInfo?.capacity
                    ? `${warehouseInfo.capacity} units`
                    : "—"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            textAlign: "right",
            mt: 3,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default WarehouseStockDetailModal;
