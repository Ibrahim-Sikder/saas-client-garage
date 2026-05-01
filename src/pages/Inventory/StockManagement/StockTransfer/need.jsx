// /* eslint-disable no-unused-vars */
// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable react/prop-types */
// "use client";
// import { useState, useEffect, useCallback } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Grid,
//   Typography,
//   Button,
//   TableContainer,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Paper,
//   Chip,
//   IconButton,
//   Tooltip,
//   Zoom,
//   Alert,
//   Autocomplete,
//   LinearProgress,
//   Divider,
// } from "@mui/material";
// import { alpha, useTheme } from "@mui/material/styles";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import InfoIcon from "@mui/icons-material/Info";
// import { useGetAllStocksQuery } from "../../../redux/api/stocksApi";
// import { useGetAllWarehousesQuery } from "../../../redux/api/warehouseApi";
// import { useTenantDomain } from "../../../hooks/useTenantDomain";
// import { useCreateStockTransferMutation } from "../../../redux/api/stocktransferApi";
// import toast from "react-hot-toast";

// export default function StockTransferModal({
//   open,
//   onClose,
//   onSubmit,
//   employees,
// }) {
//   const theme = useTheme();
//   const tenantDomain = useTenantDomain();

//   const [formSubmitting, setFormSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split("T")[0],
//     referenceNo: `TR-${new Date().getFullYear()}-${String(
//       Math.floor(Math.random() * 1000)
//     ).padStart(3, "0")}`,
//     fromLocation: "",
//     toLocation: "",
//     transferredBy: "",
//   });
//   const [transferItems, setTransferItems] = useState([
//     { id: 1, product: null, quantity: 1, note: "" },
//   ]);
//   const [errors, setErrors] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const queryParams = {
//     tenantDomain,
//     page: currentPage,
//     limit: 100,
//     searchTerm: searchTerm,
//   };

//   // Fetch stock and warehouse data
//   const { data: stockData, isLoading: stockLoading } =
//     useGetAllStocksQuery(queryParams);
//   const { data: warehouseResponse, isLoading: warehouseLoading } =
//     useGetAllWarehousesQuery(queryParams);

//   const [createStockTransfer, { isLoading: isTransferring }] =
//     useCreateStockTransferMutation();

//   // Organize stock data by warehouse
//   const [warehouseStocks, setWarehouseStocks] = useState({});
//   const [availableProducts, setAvailableProducts] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);

//   // Safe close function to prevent errors
//   const handleSafeClose = useCallback(() => {
//     if (onClose && typeof onClose === "function") {
//       setTimeout(() => {
//         onClose();
//       }, 0);
//     }
//   }, [onClose]);

//   // Process warehouse data when it's loaded
//   useEffect(() => {
//     if (
//       warehouseResponse &&
//       warehouseResponse.data &&
//       warehouseResponse.data.warehouses
//     ) {
//       const warehouseList = warehouseResponse.data.warehouses.map(
//         (warehouse) => ({
//           id: warehouse._id,
//           name: warehouse.name,
//           code: warehouse.code,
//           type: warehouse.type,
//           status: warehouse.status,
//         })
//       );
//       setWarehouses(warehouseList);
//     }
//   }, [warehouseResponse]);

//   // Process stock data when it's loaded
//   useEffect(() => {
//     if (stockData && stockData.data) {
//       // Group stocks by warehouse
//       const stocksByWarehouse = {};

//       stockData.data.forEach((stockItem) => {
//         // Check if stockItem has the required structure
//         if (!stockItem.warehouse || !stockItem.product) {
//           return;
//         }

//         const warehouseId = stockItem.warehouse._id || stockItem.warehouse;
//         const productId = stockItem.product._id;

//         if (!stocksByWarehouse[warehouseId]) {
//           stocksByWarehouse[warehouseId] = {
//             warehouseInfo: stockItem.warehouse,
//             products: {},
//           };
//         }

//         // Add or update product in this warehouse
//         if (!stocksByWarehouse[warehouseId].products[productId]) {
//           stocksByWarehouse[warehouseId].products[productId] = {
//             productInfo: stockItem.product,
//             currentStock: stockItem.quantity || stockItem.inQuantity || 0,
//             avgPurchasePrice: stockItem.avgPurchasePrice || 0,
//             lastPurchasePrice: stockItem.lastPurchasePrice || 0,
//             totalPurchaseValue: stockItem.totalPurchaseValue || 0,
//             totalSellingValue: stockItem.totalSellingValue || 0,
//           };
//         }
//       });

//       setWarehouseStocks(stocksByWarehouse);
//     }
//   }, [stockData]);

//   // Update available products when fromLocation changes
//   useEffect(() => {
//     if (formData.fromLocation && warehouseStocks[formData.fromLocation]) {
//       const products = [];
//       const warehouseProducts = warehouseStocks[formData.fromLocation].products;
//       Object.keys(warehouseProducts).forEach((productId) => {
//         const product = warehouseProducts[productId];
//         if (product.currentStock > 0) {
//           products.push({
//             _id: productId,
//             name: product.productInfo.product_name || "Unknown Product",
//             code: product.productInfo.product_code || "N/A",
//             currentStock: product.currentStock,
//             image: product.productInfo.image,
//             category:
//               product.productInfo.category?.main_category || "Uncategorized",
//             sellingPrice: product.productInfo.sellingPrice || 0,
//             purchasePrice:
//               product.productInfo.purchasePrice ||
//               product.lastPurchasePrice ||
//               product.avgPurchasePrice ||
//               0,
//             batchNumber: product.productInfo.batchNumber || "",
//             brand: product.productInfo.brand?.brand || "N/A",
//             unit: product.productInfo.unit?.unit || "Unit",
//           });
//         }
//       });
//       setAvailableProducts(products);

//       // Reset transfer items when location changes
//       setTransferItems([{ id: 1, product: null, quantity: 1, note: "" }]);
//     } else {
//       setAvailableProducts([]);
//     }
//   }, [formData.fromLocation, warehouseStocks]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Reset toLocation if fromLocation changes
//     if (name === "fromLocation") {
//       setFormData((prev) => ({
//         ...prev,
//         toLocation: "",
//       }));
//     }
//   };

//   const handleAddItem = () => {
//     const newItem = {
//       id: Math.max(...transferItems.map((item) => item.id), 0) + 1,
//       product: null,
//       quantity: 1,
//       note: "",
//     };
//     setTransferItems([...transferItems, newItem]);
//   };

//   const handleRemoveItem = (id) => {
//     setTransferItems(transferItems.filter((item) => item.id !== id));
//     // Remove any errors for this item
//     const newErrors = { ...errors };
//     delete newErrors[id];
//     setErrors(newErrors);
//   };

//   const handleProductChange = (id, newProduct) => {
//     setTransferItems(
//       transferItems.map((item) =>
//         item.id === id ? { ...item, product: newProduct, quantity: 1 } : item
//       )
//     );
//     // Clear error for this item
//     const newErrors = { ...errors };
//     delete newErrors[id];
//     setErrors(newErrors);
//   };

//   const handleQuantityChange = (id, quantity) => {
//     const item = transferItems.find((item) => item.id === id);

//     if (item && item.product) {
//       // Validate quantity against current stock
//       if (quantity > item.product.currentStock) {
//         setErrors({ ...errors, [id]: "Quantity exceeds available stock" });
//       } else {
//         // Clear error if it exists
//         const newErrors = { ...errors };
//         delete newErrors[id];
//         setErrors(newErrors);
//       }
//     }

//     setTransferItems(
//       transferItems.map((item) =>
//         item.id === id ? { ...item, quantity: quantity } : item
//       )
//     );
//   };

//   const handleNoteChange = (id, note) => {
//     setTransferItems(
//       transferItems.map((item) =>
//         item.id === id ? { ...item, note: note } : item
//       )
//     );
//   };

//   const handleSubmit = async () => {
//     if (formSubmitting) {
//       return;
//     }

//     let hasErrors = false;
//     const newErrors = {};

//     if (!formData.fromLocation) {
//       newErrors.fromLocation = "Source warehouse is required";
//       hasErrors = true;
//     }

//     if (!formData.toLocation) {
//       newErrors.toLocation = "Destination warehouse is required";
//       hasErrors = true;
//     }

//     if (!formData.transferredBy) {
//       newErrors.transferredBy = "Transfer person is required";
//       hasErrors = true;
//     }

//     if (!transferItems || transferItems.length === 0) {
//       newErrors.items = "At least one product must be added";
//       hasErrors = true;
//     } else {
//       transferItems.forEach((item, index) => {
//         if (!item.product) {
//           newErrors[`item_${index}`] = "Product is required";
//           hasErrors = true;
//         } else if (item.quantity <= 0) {
//           newErrors[`item_${index}`] = "Quantity must be greater than 0";
//           hasErrors = true;
//         } else if (item.quantity > item.product.currentStock) {
//           newErrors[`item_${index}`] = "Quantity exceeds available stock";
//           hasErrors = true;
//         }
//       });
//     }

//     setErrors(newErrors);

//     if (!hasErrors) {
//       setFormSubmitting(true);

//       try {
//         // Ensure items is always an array
//         const items = Array.isArray(transferItems)
//           ? transferItems
//               .filter((item) => item && item.product)
//               .map((item) => ({
//                 product: item.product._id,
//                 quantity: Number(item.quantity),
//                 note: item.note || "",
//                 batchNumber: `TR-${Date.now()}-${item.id}`,
//               }))
//           : [];

//         // Create the transfer data object
//         const transferData = {
//           referenceNo: formData.referenceNo,
//           date: formData.date,
//           fromWarehouse: formData.fromLocation,
//           toWarehouse: formData.toLocation,
//           transferredBy: formData.transferredBy,
//           items,
//         };


//         // Call the API with the correct structure
//         const result = await createStockTransfer({
//           transferData,
//           tenantDomain,
//         }).unwrap();

//         if (result.success) {
//           toast.success("Stock transfer completed successfully!");

//           // Reset form data
//           setFormData({
//             date: new Date().toISOString().split("T")[0],
//             referenceNo: `TR-${new Date().getFullYear()}-${String(
//               Math.floor(Math.random() * 1000)
//             ).padStart(3, "0")}`,
//             fromLocation: "",
//             toLocation: "",
//             transferredBy: "",
//           });

//           // Reset transfer items
//           setTransferItems([{ id: 1, product: null, quantity: 1, note: "" }]);

//           setErrors({});

//           // Call onSubmit callback if provided
//           if (onSubmit && typeof onSubmit === "function") {
//             onSubmit({
//               success: true,
//               message: "Stock transfer completed successfully",
//               data: {
//                 fromWarehouse: formData.fromLocation,
//                 toWarehouse: formData.toLocation,
//                 transferredBy: formData.transferredBy,
//                 referenceNo: formData.referenceNo,
//                 date: formData.date,
//                 items: transferItems
//                   .filter((item) => item && item.product)
//                   .map((item) => ({
//                     product: item.product._id,
//                     productName: item.product.name,
//                     quantity: item.quantity,
//                     note: item.note || "",
//                   })),
//                 totalItems: transferItems.filter((item) => item && item.product)
//                   .length,
//                 totalQuantity: transferItems
//                   .filter((item) => item && item.product)
//                   .reduce((sum, item) => sum + item.quantity, 0),
//               },
//             });
//           }

//           handleSafeClose();
//         } else {
//           setErrors({
//             submit: result.message || "Transfer failed. Please try again.",
//           });
//         }
//       } catch (error) {
//         console.error("Error transferring stock:", error);
//         const errorMessage =
//           error?.data?.message ||
//           error?.message ||
//           "An unexpected error occurred";
//         toast.error(errorMessage);
//         setErrors({
//           submit: errorMessage,
//         });
//       } finally {
//         setFormSubmitting(false);
//       }
//     }
//   };

//   const getWarehouseName = (warehouseId) => {
//     const warehouse = warehouses.find((w) => w.id === warehouseId);
//     if (warehouse) {
//       return warehouse.name;
//     }
//     if (warehouseStocks[warehouseId]) {
//       return warehouseStocks[warehouseId].warehouseInfo.name;
//     }

//     return warehouseId;
//   };

//   const isLoading = stockLoading || warehouseLoading || isTransferring;

//   return (
//     <Dialog
//       open={open}
//       onClose={handleSafeClose}
//       maxWidth="md"
//       fullWidth
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
//         },
//       }}
//     >
//       <DialogTitle sx={{ pb: 1 }}>
//         <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//           New Stock Transfer
//         </Typography>
//       </DialogTitle>
//       <Divider />
//       <DialogContent sx={{ pb: 4 }}>
//         {isLoading ? (
//           <LinearProgress sx={{ my: 4 }} />
//         ) : (
//           <Grid container spacing={3} sx={{ mt: 0 }}>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 name="date"
//                 label="Date"
//                 type="date"
//                 fullWidth
//                 variant="outlined"
//                 value={formData.date}
//                 onChange={handleInputChange}
//                 InputLabelProps={{ shrink: true }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <TextField
//                 name="referenceNo"
//                 label="Reference No"
//                 fullWidth
//                 variant="outlined"
//                 value={formData.referenceNo}
//                 onChange={handleInputChange}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <FormControl
//                 fullWidth
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//                 error={Boolean(errors.fromLocation)}
//               >
//                 <InputLabel>From Warehouse</InputLabel>
//                 <Select
//                   name="fromLocation"
//                   value={formData.fromLocation}
//                   label={
//                     <>
//                       From Warehouse{" "}
//                       <span style={{ color: "red", fontSize: "25px" }}> *</span>
//                     </>
//                   }
//                   onChange={handleSelectChange}
//                 >
//                   {warehouses.map((warehouse) => (
//                     <MenuItem key={warehouse.id} value={warehouse.id}>
//                       {warehouse.name}{" "}
//                       {warehouse.status === "inactive" && "(Inactive)"}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.fromLocation && (
//                   <Typography variant="caption" color="error">
//                     {errors.fromLocation}
//                   </Typography>
//                 )}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <FormControl
//                 fullWidth
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//                 disabled={!formData.fromLocation}
//                 error={Boolean(errors.toLocation)}
//               >
//                 <InputLabel>To Warehouse</InputLabel>
//                 <Select
//                   name="toLocation"
//                   value={formData.toLocation}
//                   label={
//                     <>
//                       To Warehouse{" "}
//                       <span style={{ color: "red", fontSize: "25px" }}> *</span>
//                     </>
//                   }
//                   onChange={handleSelectChange}
//                 >
//                   {warehouses
//                     .filter(
//                       (warehouse) => warehouse.id !== formData.fromLocation
//                     )
//                     .map((warehouse) => (
//                       <MenuItem key={warehouse.id} value={warehouse.id}>
//                         {warehouse.name}{" "}
//                         {warehouse.status === "inactive" && "(Inactive)"}
//                       </MenuItem>
//                     ))}
//                 </Select>
//                 {errors.toLocation && (
//                   <Typography variant="caption" color="error">
//                     {errors.toLocation}
//                   </Typography>
//                 )}
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               {/* Replaced Select with TextField for Transferred By */}
//               <TextField
//                 name="transferredBy"
//                 label={
//                   <>
//                     Referred By
//                     <span style={{ color: "red", fontSize: "25px" }}> *</span>
//                   </>
//                 }
//                 value={formData.transferredBy}
//                 onChange={handleInputChange}
//                 fullWidth
//                 variant="outlined"
//                 required
//                 error={Boolean(errors.transferredBy)}
//                 helperText={errors.transferredBy}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ mb: 2, fontWeight: "bold" }}
//               >
//                 Products
//               </Typography>

//               {Object.keys(errors).length > 0 &&
//                 errors.submit === undefined && (
//                   <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//                     Please correct the errors before submitting.
//                   </Alert>
//                 )}

//               {errors.submit && (
//                 <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//                   {errors.submit}
//                 </Alert>
//               )}

//               {!formData.fromLocation ? (
//                 <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
//                   Please select a "From" warehouse first to add products.
//                 </Alert>
//               ) : availableProducts.length === 0 ? (
//                 <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
//                   No products available in the selected warehouse.
//                 </Alert>
//               ) : (
//                 <TableContainer
//                   component={Paper}
//                   variant="outlined"
//                   sx={{ borderRadius: 2, mb: 2 }}
//                 >
//                   <Table>
//                     <TableHead>
//                       <TableRow
//                         sx={{
//                           backgroundColor: alpha(
//                             theme.palette.primary.main,
//                             0.1
//                           ),
//                         }}
//                       >
//                         <TableCell width="40%" sx={{ fontWeight: "bold" }}>
//                           Product
//                         </TableCell>
//                         <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                           Current Stock
//                         </TableCell>
//                         <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                           Transfer Quantity
//                         </TableCell>
//                         <TableCell sx={{ fontWeight: "bold" }}>Note</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                           Action
//                         </TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {transferItems.map((item) => (
//                         <TableRow
//                           key={item.id}
//                           sx={{
//                             "&:hover": {
//                               backgroundColor: alpha(
//                                 theme.palette.primary.main,
//                                 0.04
//                               ),
//                             },
//                             transition: "background-color 0.2s ease",
//                             ...(errors[item.id] && {
//                               backgroundColor: alpha(
//                                 theme.palette.error.main,
//                                 0.08
//                               ),
//                             }),
//                           }}
//                         >
//                           <TableCell>
//                             <Autocomplete
//                               options={availableProducts}
//                               getOptionLabel={(option) =>
//                                 `${option.name} (${option.code})`
//                               }
//                               value={item.product}
//                               onChange={(_, newValue) =>
//                                 handleProductChange(item.id, newValue)
//                               }
//                               renderOption={(props, option) => (
//                                 <li {...props}>
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <div
//                                       style={{
//                                         marginRight: "8px",
//                                         width: "32px",
//                                         height: "32px",
//                                       }}
//                                     >
//                                       {option.image ? (
//                                         <img
//                                           src={
//                                             option.image || "/placeholder.svg"
//                                           }
//                                           alt={option.name}
//                                           style={{
//                                             width: "100%",
//                                             height: "100%",
//                                             objectFit: "contain",
//                                           }}
//                                         />
//                                       ) : (
//                                         <div
//                                           style={{
//                                             width: "100%",
//                                             height: "100%",
//                                             backgroundColor: "#f0f0f0",
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                           }}
//                                         >
//                                           <span>No img</span>
//                                         </div>
//                                       )}
//                                     </div>
//                                     <div>
//                                       <div>
//                                         {option.name} ({option.code})
//                                       </div>
//                                       <div
//                                         style={{
//                                           fontSize: "0.75rem",
//                                           color: "rgba(0, 0, 0, 0.6)",
//                                         }}
//                                       >
//                                         {option.category} - Stock:{" "}
//                                         {option.currentStock}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </li>
//                               )}
//                               renderInput={(params) => (
//                                 <TextField
//                                   {...params}
//                                   label="Select Product"
//                                   sx={{
//                                     "& .MuiOutlinedInput-root": {
//                                       borderRadius: 2,
//                                     },
//                                   }}
//                                 />
//                               )}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <Chip
//                               label={
//                                 item.product ? item.product.currentStock : 0
//                               }
//                               size="small"
//                               color={
//                                 item.product
//                                   ? item.product.currentStock > 10
//                                     ? "success"
//                                     : item.product.currentStock > 0
//                                     ? "warning"
//                                     : "error"
//                                   : "default"
//                               }
//                               sx={{ fontWeight: "bold" }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <TextField
//                               type="number"
//                               value={item.quantity}
//                               onChange={(e) =>
//                                 handleQuantityChange(
//                                   item.id,
//                                   Number(e.target.value)
//                                 )
//                               }
//                               InputProps={{
//                                 inputProps: {
//                                   min: 1,
//                                   max: item.product
//                                     ? item.product.currentStock
//                                     : 1,
//                                 },
//                               }}
//                               error={Boolean(errors[item.id])}
//                               helperText={errors[item.id] || ""}
//                               sx={{
//                                 width: 80,
//                                 "& .MuiOutlinedInput-root": {
//                                   borderRadius: 2,
//                                 },
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               placeholder="Note"
//                               value={item.note}
//                               onChange={(e) =>
//                                 handleNoteChange(item.id, e.target.value)
//                               }
//                               sx={{
//                                 "& .MuiOutlinedInput-root": {
//                                   borderRadius: 2,
//                                 },
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell align="right">
//                             <Tooltip title="Remove" TransitionComponent={Zoom}>
//                               <IconButton
//                                 color="error"
//                                 onClick={() => handleRemoveItem(item.id)}
//                                 sx={{
//                                   backgroundColor: alpha(
//                                     theme.palette.error.main,
//                                     0.1
//                                   ),
//                                   "&:hover": {
//                                     backgroundColor: alpha(
//                                       theme.palette.error.main,
//                                       0.2
//                                     ),
//                                   },
//                                 }}
//                               >
//                                 <DeleteIcon />
//                               </IconButton>
//                             </Tooltip>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                       {formData.fromLocation &&
//                         availableProducts.length > 0 && (
//                           <TableRow>
//                             <TableCell colSpan={5}>
//                               <Button
//                                 startIcon={<AddIcon />}
//                                 fullWidth
//                                 variant="outlined"
//                                 sx={{
//                                   my: 1,
//                                   borderRadius: 2,
//                                   py: 1,
//                                 }}
//                                 onClick={handleAddItem}
//                               >
//                                 Add Product
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               )}

//               {formData.fromLocation &&
//                 formData.toLocation &&
//                 transferItems.some((item) => item && item.product) && (
//                   <Paper
//                     variant="outlined"
//                     sx={{
//                       p: 2,
//                       borderRadius: 2,
//                       mt: 2,
//                       backgroundColor: alpha(theme.palette.info.main, 0.05),
//                       display: "flex",
//                       alignItems: "center",
//                     }}
//                   >
//                     <InfoIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
//                     <Typography variant="body2">
//                       This will transfer{" "}
//                       {transferItems.reduce(
//                         (sum, item) =>
//                           sum + (item && item.product ? item.quantity : 0),
//                         0
//                       )}{" "}
//                       items from {getWarehouseName(formData.fromLocation)} to{" "}
//                       {getWarehouseName(formData.toLocation)}. Total value: ৳{" "}
//                       {transferItems
//                         .reduce(
//                           (sum, item) =>
//                             sum +
//                             (item && item.product
//                               ? item.quantity *
//                                 (item.product.purchasePrice || 0)
//                               : 0),
//                           0
//                         )
//                         .toFixed(2)}
//                     </Typography>
//                   </Paper>
//                 )}
//             </Grid>
//           </Grid>
//         )}

//         {formSubmitting && <LinearProgress sx={{ mt: 3 }} />}
//       </DialogContent>
//       <DialogActions sx={{ px: 3, pb: 3 }}>
//         <Button
//           onClick={handleSafeClose}
//           variant="outlined"
//           sx={{
//             borderRadius: 2,
//             py: 1,
//             px: 3,
//             borderWidth: 2,
//             "&:hover": {
//               borderWidth: 2,
//             },
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={
//             isLoading ||
//             formSubmitting ||
//             !formData.fromLocation ||
//             !formData.toLocation ||
//             !formData.transferredBy ||
//             !transferItems ||
//             transferItems.length === 0 ||
//             transferItems.some((item) => !item || !item.product) ||
//             transferItems.some(
//               (item) => item && item.product && item.quantity <= 0
//             ) ||
//             Object.keys(errors).length > 0
//           }
//           sx={{
//             borderRadius: 2,
//             py: 1,
//             px: 3,
//             boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
//             background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
//           }}
//         >
//           Complete Transfer
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }
