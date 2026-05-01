/* eslint-disable react/prop-types */
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Zoom,
  Autocomplete,
  TextField,
  Button,

} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TransferItemsTable({
  transferItems,
  availableProducts,
  errors,
  handleProductChange,
  handleQuantityChange,
  handleNoteChange,
  handleRemoveItem,
  handleAddItem,
  formData,
  theme,
}) {
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ borderRadius: 2, mb: 2 }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <TableCell width="40%" sx={{ fontWeight: "bold" }}>
              Product
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Current Stock
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Transfer Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Note</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transferItems.map((item) => (
            <TableRow
              key={item.id}
              sx={{
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
                transition: "background-color 0.2s ease",
                ...(errors[item.id] && {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                }),
              }}
            >
              <TableCell>
                <Autocomplete
                  options={availableProducts}
                  getOptionLabel={(option) =>
                    `${option.name} (${option.code})`
                  }
                  value={item.product}
                  onChange={(_, newValue) =>
                    handleProductChange(item.id, newValue)
                  }
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            marginRight: "8px",
                            width: "32px",
                            height: "32px",
                          }}
                        >
                          {option.image ? (
                            <img
                              src={option.image || "/placeholder.svg"}
                              alt={option.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                backgroundColor: "#f0f0f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <span>No img</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div>
                            {option.name} ({option.code})
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            {option.category} - Stock:{" "}
                            {option.currentStock}
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Product"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  )}
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={item.product ? item.product.currentStock : 0}
                  size="small"
                  color={
                    item.product
                      ? item.product.currentStock > 10
                        ? "success"
                        : item.product.currentStock > 0
                          ? "warning"
                          : "error"
                      : "default"
                  }
                  sx={{ fontWeight: "bold" }}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                  InputProps={{
                    inputProps: {
                      min: 1,
                      max: item.product ? item.product.currentStock : 1,
                    },
                  }}
                  error={Boolean(errors[item.id])}
                  helperText={errors[item.id] || ""}
                  sx={{
                    width: 80,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  placeholder="Note"
                  value={item.note}
                  onChange={(e) => handleNoteChange(item.id, e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Remove" TransitionComponent={Zoom}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.id)}
                    sx={{
                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {formData.fromLocation && availableProducts.length > 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Button
                  startIcon={<AddIcon />}
                  fullWidth
                  variant="outlined"
                  sx={{
                    my: 1,
                    borderRadius: 2,
                    py: 1,
                  }}
                  onClick={handleAddItem}
                >
                  Add Product
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}