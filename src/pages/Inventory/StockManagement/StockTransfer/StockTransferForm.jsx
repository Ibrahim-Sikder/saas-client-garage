/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,

} from "@mui/material";
import TransferItemsTable from "./TransferItemsTable";
import TransferSummary from "./TransferSummary";

export default function StockTransferForm({
  formData,
  transferItems,
  errors,
  warehouses,
  availableProducts,
  formSubmitting,
  handleInputChange,
  handleSelectChange,
  handleAddItem,
  handleRemoveItem,
  handleProductChange,
  handleQuantityChange,
  handleNoteChange,
  handleSubmit,
  getWarehouseName,
  theme,
}) {
  return (
    <Grid container spacing={3} sx={{ mt: 0, padding:2 }} >
      {/* Date and Reference Number Fields */}
      <Grid item xs={12} md={6}>
        <TextField
          name="date"
          label="Date"
          type="date"
          fullWidth
          variant="outlined"
          value={formData.date}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="referenceNo"
          label="Reference No"
          fullWidth
          variant="outlined"
          value={formData.referenceNo}
          onChange={handleInputChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>
      
      {/* Warehouse Selection Fields */}
      <Grid item xs={12} md={6}>
        <FormControl
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          error={Boolean(errors.fromLocation)}
        >
          <InputLabel>
            From Warehouse{" "}
            <span style={{ color: "red", fontSize: "25px" }}> *</span>
          </InputLabel>
          <Select
            name="fromLocation"
            value={formData.fromLocation}
            label="From Warehouse"
            onChange={handleSelectChange}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse.id} value={warehouse.id}>
                {warehouse.name}{" "}
                {warehouse.status === "inactive" && "(Inactive)"}
              </MenuItem>
            ))}
          </Select>
          {errors.fromLocation && (
            <Typography variant="caption" color="error">
              {errors.fromLocation}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
          disabled={!formData.fromLocation}
          error={Boolean(errors.toLocation)}
        >
          <InputLabel>
            To Warehouse{" "}
            <span style={{ color: "red", fontSize: "25px" }}> *</span>
          </InputLabel>
          <Select
            name="toLocation"
            value={formData.toLocation}
            label="To Warehouse"
            onChange={handleSelectChange}
          >
            {warehouses
              .filter(
                (warehouse) => warehouse.id !== formData.fromLocation
              )
              .map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}{" "}
                  {warehouse.status === "inactive" && "(Inactive)"}
                </MenuItem>
              ))}
          </Select>
          {errors.toLocation && (
            <Typography variant="caption" color="error">
              {errors.toLocation}
            </Typography>
          )}
        </FormControl>
      </Grid>
      
      {/* Transferred By Field */}
      <Grid item xs={12} md={6}>
        <TextField
          name="transferredBy"
          label={
            <>
              Referred By
              <span style={{ color: "red", fontSize: "25px" }}> *</span>
            </>
          }
          value={formData.transferredBy}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          required
          error={Boolean(errors.transferredBy)}
          helperText={errors.transferredBy}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Grid>
      
      {/* Products Section */}
      <Grid item xs={12}>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Products
        </Typography>

        {/* Error Messages */}
        {Object.keys(errors).length > 0 &&
          errors.submit === undefined && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              Please correct the errors before submitting.
            </Alert>
          )}

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errors.submit}
          </Alert>
        )}

        {/* Informational Messages */}
        {!formData.fromLocation ? (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            Please select a From warehouse first to add products.
          </Alert>
        ) : availableProducts.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            No products available in the selected warehouse.
          </Alert>
        ) : (
          <TransferItemsTable
            transferItems={transferItems}
            availableProducts={availableProducts}
            errors={errors}
            handleProductChange={handleProductChange}
            handleQuantityChange={handleQuantityChange}
            handleNoteChange={handleNoteChange}
            handleRemoveItem={handleRemoveItem}
            handleAddItem={handleAddItem}
            formData={formData}
            theme={theme}
          />
        )}

        {/* Transfer Summary */}
        {formData.fromLocation &&
          formData.toLocation &&
          transferItems.some((item) => item && item.product) && (
            <TransferSummary
              transferItems={transferItems}
              getWarehouseName={getWarehouseName}
              formData={formData}
              theme={theme}
            />
          )}
      </Grid>
    </Grid>
  );
}