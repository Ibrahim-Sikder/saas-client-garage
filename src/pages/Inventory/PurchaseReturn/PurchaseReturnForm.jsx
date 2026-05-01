/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  RadioGroup,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import EditNote from "@mui/icons-material/EditNote";
import Loading from "@/components/Loading/Loading";
import { useNavigate } from "react-router-dom";
import {
  useCreatePurchaseReturnMutation,
  useGetSinglePurchaseReturnQuery,
  useUpdatePurchaseReturnMutation,
} from "../../../redux/api/purchaseReturnApi";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useGetAllStocksQuery } from "../../../redux/api/stocksApi";
import { returnStatuses } from "../../../constant/constant";
import { useAppOptions } from "../../../hooks/useAppOptions";
import Can from "../../../components/Can";
import { purchaseBtn } from "../../../utils/customStyle";

export default function PurchaseReturnForm({ id }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [returnItems, setReturnItems] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [setSelectedSupplier] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      returnDate: new Date().toISOString().split("T")[0],
      referenceNo: "",
      suppliers: [],
      warehouse: "",
      returnReason: "",
      returnNote: "",
      status: "pending",
    },
  });

  const watchedWarehouse = watch("warehouse");
  const watchedSuppliers = watch("suppliers");
  const watchedPurchase = watch("purchase");
  const {
    performActionWithPermission,
    supplierOptions,
    warehouseOptions,
    tenantDomain,
  } = useAppOptions();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    limit: 100,
    searchTerm: searchTerm,
    warehouse: watchedWarehouse,
    supplier: watchedSuppliers?.[0] || "",
    purchase: watchedPurchase,
  };

  const { data: stockData, isLoading } = useGetAllStocksQuery(queryParams);
  const [createPurchaseReturn, { isLoading: isSubmitting }] =
    useCreatePurchaseReturnMutation();
  const [updatePurchaseReturn, { isLoading: isUpdating }] =
    useUpdatePurchaseReturnMutation();
  const { data: singlePurchaseReturn, isLoading: singlePurchaseReturnLoading } =
    useGetSinglePurchaseReturnQuery({
      tenantDomain,
      id,
    });

  useEffect(() => {
    if (stockData && stockData.data && stockData.data.length > 0) {
      const initialReturnItems = stockData.data.map((item, index) => {
        const productId = item.product?._id;
        const existingItem = singlePurchaseReturn?.data?.items?.find(
          (returnItem) =>
            returnItem.productId?._id === productId ||
            returnItem.productId === productId,
        );

        const supplierName =
          item.product?.suppliers && item.product.suppliers[0]
            ? item.product.suppliers[0].full_name
            : "Unknown";

        return {
          id: index,
          product: {
            code:
              item.product?.product_code || existingItem?.productCode || "N/A",
            name:
              item.product?.product_name ||
              existingItem?.productName ||
              "Unknown Product",
            unit: item.product?.unit?.unit || existingItem?.unit || "Unit",
          },
          maxQuantity: item.stock || existingItem?.maxQuantity || 0,
          returnQuantity: existingItem ? existingItem.quantity : 0,
          price:
            item.productPurchasePrice ||
            item.product?.purchasePrice ||
            existingItem?.unitPrice ||
            0,
          total: existingItem ? existingItem.totalAmount : 0,
          selected: !!existingItem,
          productId: productId,
          tax: item.product?.product_tax || 0,
          discount: item.product?.discount || 0,
          shipping: item.product?.shipping || 0,
          purchaseId: item._id,
          purchaseReferenceNo: item.referenceType || "N/A",
          supplierName: supplierName,
          warehouse: item.warehouse?._id,
          warehouseName: item.warehouse?.name || "Unknown",
        };
      });

      setReturnItems(initialReturnItems);

      if (stockData.data[0]?.warehouse && !watchedWarehouse) {
        setValue("warehouse", stockData.data[0].warehouse._id);
      }
      setIsFormLoading(false);
    } else if (
      singlePurchaseReturn?.data?.items &&
      singlePurchaseReturn.data.items.length > 0
    ) {
      // If no stock data but we have single purchase return data, create items from it
      const itemsFromPurchaseReturn = singlePurchaseReturn.data.items.map(
        (item, index) => ({
          id: index,
          product: {
            code: item.productCode || "N/A",
            name: item.productName || "Unknown Product",
            unit: item.unit || "Unit",
          },
          maxQuantity: item.maxQuantity || 0,
          returnQuantity: item.quantity || 0,
          price: item.unitPrice || 0,
          total: item.totalAmount || 0,
          selected: true,
          productId: item.productId?._id || item.productId,
          tax: 0,
          discount: 0,
          shipping: 0,
          purchaseId: item._id,
          purchaseReferenceNo: singlePurchaseReturn.data.referenceNo || "N/A",
          supplierName:
            singlePurchaseReturn.data.suppliers?.[0]?.full_name || "Unknown",
          warehouse: singlePurchaseReturn.data.warehouse,
          warehouseName: "Unknown",
        }),
      );

      setReturnItems(itemsFromPurchaseReturn);
      setIsFormLoading(false);
    }
  }, [stockData, setValue, singlePurchaseReturn, watchedWarehouse]);

  useEffect(() => {
    if (singlePurchaseReturn?.data) {
      setIsFormLoading(true);
      setValue(
        "returnDate",
        singlePurchaseReturn.data.returnDate
          ? new Date(singlePurchaseReturn.data.returnDate)
              .toISOString()
              .split("T")[0]
          : new Date().toISOString().split("T")[0],
      );
      setValue("referenceNo", singlePurchaseReturn.data.referenceNo || "");
      if (
        singlePurchaseReturn.data.suppliers &&
        singlePurchaseReturn.data.suppliers.length > 0
      ) {
        setValue(
          "suppliers",
          singlePurchaseReturn.data.suppliers.map((s) => s._id),
        );
      } else if (singlePurchaseReturn.data.supplier) {
        setValue("suppliers", [singlePurchaseReturn.data.supplier]);
      } else {
        setValue("suppliers", []);
      }

      setValue("warehouse", singlePurchaseReturn.data.warehouse || "");
      setValue("returnReason", singlePurchaseReturn.data.returnReason || "");
      setValue("returnNote", singlePurchaseReturn.data.returnNote || "");
      setValue("status", singlePurchaseReturn.data.status || "pending");
      setIsFormLoading(false);
    }
  }, [singlePurchaseReturn, setValue]);

  useEffect(() => {
    if (watchedWarehouse) {
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [watchedWarehouse]);

  useEffect(() => {
    if (watchedSuppliers && watchedSuppliers.length > 0) {
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [watchedSuppliers]);

  useEffect(() => {
    if (watchedPurchase) {
      setSearchTerm("");
      setCurrentPage(1);
    }
  }, [watchedPurchase]);

  const handleItemSelection = (id) => {
    setReturnItems(
      returnItems.map((item) => {
        if (item.id === id) {
          const newSelected = !item.selected;
          let newReturnQuantity = item.returnQuantity;
          if (newSelected && item.returnQuantity === 0) {
            newReturnQuantity = 1;
          }
          if (!newSelected) {
            newReturnQuantity = 0;
          }

          return {
            ...item,
            selected: newSelected,
            returnQuantity: newReturnQuantity,
            total: newReturnQuantity * item.price,
          };
        }
        return item;
      }),
    );
  };

  const handleQuantityChange = (id, value) => {
    const quantity = Number.parseInt(value) || 0;
    setReturnItems(
      returnItems.map((item) =>
        item.id === id
          ? {
              ...item,
              returnQuantity: Math.min(Math.max(0, quantity), item.maxQuantity),
              total:
                Math.min(Math.max(0, quantity), item.maxQuantity) * item.price,
            }
          : item,
      ),
    );
  };

  const calculateTotalItems = () => {
    return returnItems.filter(
      (item) => item.selected && item.returnQuantity > 0,
    ).length;
  };

  const calculateTotalReturn = () => {
    return returnItems.reduce(
      (sum, item) =>
        item.selected && item.returnQuantity > 0 ? sum + item.total : sum,
      0,
    );
  };

  const onSubmit = async (formData) => {
    performActionWithPermission(
      "/dashboard/purchase-return-add",
      id ? "edit" : "create",
      async () => {
        const loadingToast = toast.loading(
          `${id ? "Updating" : "creating"} purchase return...`,
        );

        try {
          let res;
          const selectedItems = returnItems.filter(
            (item) => item.selected && item.returnQuantity > 0,
          );

          if (selectedItems.length === 0) {
            toast.error(
              "Please select at least one item to return with quantity greater than 0",
            );
            return;
          }
          const invalidItems = selectedItems.filter(
            (item) =>
              item.returnQuantity <= 0 ||
              item.returnQuantity > item.maxQuantity,
          );

          if (invalidItems.length > 0) {
            toast.error(
              "Please ensure all return quantities are valid (greater than 0 and not exceeding available quantity)",
            );
            return;
          }
          if (!formData.suppliers || formData.suppliers.length === 0) {
            toast.error("Please select at least one supplier");
            return;
          }
          const items = selectedItems.map((item) => ({
            productId: item.productId,
            productCode: item.product?.code || "N/A",
            productName: item.product?.name || "Unknown Product",
            quantity: item.returnQuantity,
            maxQuantity: item.maxQuantity,
            unitPrice: item.price,
            unit: item.product?.unit || "Unit",
            totalAmount: item.total,
          }));

          const totalReturnAmount = selectedItems.reduce(
            (sum, item) => sum + item.total,
            0,
          );

          const submitData = {
            returnDate: formData.returnDate,
            referenceNo: formData.referenceNo,
            suppliers: Array.isArray(formData.suppliers)
              ? formData.suppliers
              : [formData.suppliers],
            purchase: formData.purchase,
            warehouse: formData.warehouse,
            returnNote: formData.returnNote,
            returnReason: formData.returnReason,
            status: formData.status,
            items: items,
            totalReturnAmount,
          };

          if (id && singlePurchaseReturn?.data?._id) {
            res = await updatePurchaseReturn({
              id,
              tenantDomain,
              data: submitData,
            }).unwrap();
          } else {
            res = await createPurchaseReturn({
              tenantDomain,
              ...submitData,
            }).unwrap();
          }

          if (res.success) {
            toast.dismiss(loadingToast);
            toast.success(
              `Purchase return ${id ? "update" : "create"} successfully`,
            );
            setTimeout(() => {
              navigate("/dashboard/purchase-return");
            }, 1500);
          }
        } catch (error) {
          console.error("Error processing purchase return:", error);
          toast.error(
            error.data?.message || "Failed to process purchase return",
          );
        }
      },
      `You don't have permission to ${id ? "edit" : "create"} purchase return `,
    );
  };

  const handleCancel = () => {
    navigate("/dashboard/purchase-return");
  };

  const handleConfirmSubmit = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleFormSubmit = (formData) => {
    handleConfirmSubmit();
  };

  const handleDialogConfirm = async () => {
    const formData = getValues();
    await onSubmit(formData);
    setOpenConfirmDialog(false);
  };

  const steps = ["Select Filters", "Select Return Items", "Review & Submit"];

  if (isLoading || !stockData || singlePurchaseReturnLoading || isFormLoading) {
    return <Loading />;
  }

  if (!stockData || !stockData.data || stockData.data.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          No stock data found.
          <Button
            color="inherit"
            size="small"
            onClick={() => navigate("/dashboard/purchase")}
            sx={{ ml: 2 }}
          >
            Go to Purchase List
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.primary.light,
          0.05,
        )}, ${alpha(theme.palette.background.default, 1)})`,
        minHeight: "100vh",
        p: 1,
        borderRadius: 2,
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          mb: 3,
          "& .MuiBreadcrumbs-ol": {
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            p: 1,
            borderRadius: 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          },
        }}
      >
        <Link
          color="inherit"
          href="/dashboard"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="/dashboard/purchase"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ShoppingCartIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Purchase
        </Link>
        <Typography
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Return
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          backgroundColor: theme.palette.background.paper,
          p: 2,
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: "bold",
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {id ? "Update Purchase Return" : "Create Purchase Return"}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
          sx={{ borderRadius: "8px" }}
        >
          Go Back
        </Button>
      </Box>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 2,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.5,
                  )}`,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    mr: 2,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <EditNote />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Select Filters
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="warehouse"
                    control={control}
                    rules={{ required: "Warehouse is required" }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.warehouse}
                        required
                      >
                        <InputLabel>Warehouse</InputLabel>
                        <Select
                          {...field}
                          label="Warehouse"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setActiveStep(1);
                          }}
                        >
                          {warehouseOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.warehouse && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.5 }}
                          >
                            {errors.warehouse.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="suppliers"
                    control={control}
                    rules={{ required: "Supplier is required" }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.suppliers}
                        required
                      >
                        <InputLabel>Supplier</InputLabel>
                        <Select
                          {...field}
                          label="Supplier"
                          value={field.value || []}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setSelectedSupplier(e.target.value);
                            setActiveStep(1);
                          }}
                        >
                          {supplierOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.suppliers && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ mt: 0.5, ml: 1.5 }}
                          >
                            {errors.suppliers.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  pb: 2,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.5,
                  )}`,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.info.main,
                    mr: 2,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <EditNote />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Select Items to Return
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Select the items you want to return and specify the quantity.
                You can select items from multiple purchases.
              </Alert>

              {returnItems.length > 0 ? (
                <TableContainer
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    mb: 2,
                  }}
                >
                  <Table>
                    <TableHead
                      sx={{
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.05,
                        ),
                      }}
                    >
                      <TableRow>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Product
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Warehouse
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Purchase Ref
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Supplier
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Available Qty
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Return Qty
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Price
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {returnItems.map((item) => (
                        <TableRow
                          key={item.id}
                          sx={{
                            backgroundColor: item.selected
                              ? alpha(theme.palette.primary.main, 0.04)
                              : "inherit",
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.04,
                              ),
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={item.selected}
                              onChange={() => handleItemSelection(item.id)}
                              sx={{
                                "&.Mui-checked": {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {item.product?.code || "N/A"}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              {item.product?.name || "Unknown Product"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.warehouseName || "Unknown"}
                              size="small"
                              sx={{
                                backgroundColor: alpha(
                                  theme.palette.secondary.main,
                                  0.1,
                                ),
                                color: theme.palette.secondary.main,
                                fontWeight: "medium",
                                borderRadius: "6px",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              #{item.purchaseReferenceNo || "N/A"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {item.supplierName || "Unknown"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={item.product?.unit || "Unit"}
                              size="small"
                              sx={{
                                backgroundColor: alpha(
                                  theme.palette.primary.main,
                                  0.1,
                                ),
                                color: theme.palette.primary.main,
                                fontWeight: "medium",
                                borderRadius: "6px",
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={item.maxQuantity || 0}
                              size="small"
                              sx={{
                                backgroundColor: alpha(
                                  theme.palette.info.main,
                                  0.1,
                                ),
                                color: theme.palette.info.main,
                                fontWeight: "medium",
                                borderRadius: "6px",
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              size="small"
                              value={item.returnQuantity || 0}
                              onChange={(e) =>
                                handleQuantityChange(item.id, e.target.value)
                              }
                              disabled={!item.selected}
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                  max: item.maxQuantity || 0,
                                },
                                sx: { borderRadius: 2 },
                              }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            ৳ {item.price || 0}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            ৳ {item.total || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                  No products found in any purchases.
                </Alert>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                position: "sticky",
                top: 20,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    pb: 2,
                    borderBottom: `1px solid ${alpha(
                      theme.palette.divider,
                      0.5,
                    )}`,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.main,
                      mr: 2,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    <EditNote />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Return Details
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Controller
                      name="returnDate"
                      control={control}
                      rules={{ required: "Return date is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={
                            <>
                              Return Date
                              <span style={{ color: "red", fontSize: "25px" }}>
                                {" "}
                                *
                              </span>
                            </>
                          }
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <CalendarMonth
                                sx={{
                                  mr: 1,
                                  color: theme.palette.text.secondary,
                                }}
                              />
                            ),
                            sx: { borderRadius: 2 },
                          }}
                          sx={{ mb: 2 }}
                          error={!!errors.returnDate}
                          helperText={errors.returnDate?.message}
                          required
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="referenceNo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Reference No"
                          placeholder="RET-0001"
                          InputProps={{
                            sx: { borderRadius: 2 },
                          }}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="returnReason"
                      control={control}
                      rules={{ required: "Return reason is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={
                            <>
                              Return Reason
                              <span style={{ color: "red", fontSize: "25px" }}>
                                {" "}
                                *
                              </span>
                            </>
                          }
                          multiline
                          rows={3}
                          InputProps={{ sx: { borderRadius: 2 } }}
                          sx={{ mb: 2 }}
                          required
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <RadioGroup {...field} row sx={{ borderRadius: 2 }}>
                            {returnStatuses.map((status) => (
                              <FormControlLabel
                                key={status.value}
                                value={status.value}
                                control={<Radio />}
                                label={
                                  <Chip
                                    label={status.label}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha(
                                        theme.palette[status.color].main,
                                        0.1,
                                      ),
                                      color: theme.palette[status.color].main,
                                      fontWeight: "medium",
                                      borderRadius: "6px",
                                    }}
                                  />
                                }
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="returnNote"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Return Note"
                          multiline
                          rows={3}
                          InputProps={{ sx: { borderRadius: 2 } }}
                          sx={{ mb: 2 }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.1,
                    )}`,
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "medium" }}
                      >
                        Total Items:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        align="right"
                        sx={{
                          fontWeight: "bold",
                          color: theme.palette.primary.main,
                        }}
                      >
                        {calculateTotalItems()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "medium" }}
                      >
                        Total Return Value:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="subtitle1"
                        align="right"
                        sx={{
                          fontWeight: "bold",
                          color: theme.palette.primary.main,
                        }}
                      >
                        ৳{calculateTotalReturn()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <div className="gap-2 space-y-3">
                  <Can
                    page="/dashboard/purchase-return-add"
                    action={id ? "edit" : "create"}
                  >
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={
                        isSubmitting || isUpdating ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      disabled={
                        isSubmitting ||
                        isUpdating ||
                        returnItems.filter(
                          (item) => item.selected && item.returnQuantity > 0,
                        ).length === 0
                      }
                      sx={purchaseBtn}
                    >
                      {isSubmitting || isUpdating
                        ? "Processing..."
                        : id
                          ? "Update Return"
                          : "Submit Return"}
                    </Button>
                  </Can>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: "8px",
                      py: 1.5,
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Purchase Return
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to {id ? "update" : "submit"} this purchase
            return?
          </Typography>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">Total Items:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right" fontWeight="bold">
                  {calculateTotalItems()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Total Return Value:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" align="right" fontWeight="bold">
                  ৳{calculateTotalReturn()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Can
            page="/dashboard/purchase-return-add"
            action={id ? "edit" : "create"}
          >
            <Button
              onClick={handleDialogConfirm}
              color="primary"
              variant="contained"
              disabled={isSubmitting || isUpdating}
            >
              {isSubmitting || isUpdating ? "Processing..." : "Confirm"}
            </Button>
          </Can>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
