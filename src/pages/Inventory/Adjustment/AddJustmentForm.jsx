"use client";

/* eslint-disable no-unused-vars */
import { useState } from "react";
import TASForm from "../../../components/form/Form";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  alpha,
  useTheme,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import TASInput from "../../../components/form/Input";
import TASDatepicker from "../../../components/form/Datepicker";
import AddjustmentFileUpload from "../../../components/form/AddjustmentFileUpload";
import TASSelect from "../../../components/form/Select";
import TASTextarea from "../../../components/form/Textarea";
import { toast } from "react-toastify";
import { useCreateAdjustmentMutation } from "../../../redux/api/adjustmentApi";
import { useNavigate } from "react-router-dom";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CalendarMonth as CalendarIcon,
  Numbers as NumbersIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  Notes as NotesIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Tune as TuneIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import TASAutocomplete from "../../../components/form/Autocomplete";
import {
  outlinedInputWrapperSx,
  purchaseBtn,
} from "../../../utils/customStyle";
import { useGetAllStocksQuery } from "../../../redux/api/stocksApi";
import { useAppOptions } from "../../../hooks/useAppOptions";
import Can from "../../../components/Can";

const AddAdjustmentForm = () => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { tenantDomain, performActionWithPermission, warehouseOptions } =
    useAppOptions();

  const queryParams = {
    tenantDomain,
    page: currentPage,
    limit: 100,
    searchTerm: searchTerm,
  };

  const { data: stockData, isLoading } = useGetAllStocksQuery(queryParams);

  const [createAdjustment, { isLoading: isSubmitting }] =
    useCreateAdjustmentMutation();
  const [productFields, setProductFields] = useState([]);
  const [fileList, setFileList] = useState([]);

  const onAddProductField = (product) => {
    const existingProductIndex = productFields.findIndex(
      (field) => field.productId === product.stock.product._id
    );

    if (existingProductIndex !== -1) {
      toast.info("Product already added. You can adjust its quantity below.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setProductFields([
      ...productFields,
      {
        productId: product.stock.product._id,
        productName: product.stock.product.product_name,
        productCode: product.stock.product.product_code || "N/A",
        type: "Addition",
        quantity: 1,
        serialNumber: "",
        currentStock: product.stock.inQuantity - product.stock.outQuantity,
        avgPurchasePrice: product.stock.avgPurchasePrice,
        warehouse: product.stock.warehouse._id,
        warehouseName: product.stock.warehouse.name,
      },
    ]);

    toast.success("Product added successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const onRemoveProductField = (index) => {
    const newFields = [...productFields];
    newFields.splice(index, 1);
    setProductFields(newFields);

    toast.info("Product removed", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleAdjustmentTypeChange = (index, newType) => {
    const newFields = [...productFields];
    newFields[index].type = newType;
    setProductFields(newFields);
  };

  const handleSubmit = async (data) => {
    performActionWithPermission(
      "/dashboard/add-adjustment",
      "create",
      async () => {
        if (productFields.length === 0) {
          toast.error("Please add at least one product", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }

        const imageUrl = Array.isArray(data.image) ? data.image[0] : data.image;
        const modifyData = {
          image: imageUrl,
          ...data,
          warehouse:
            data.warehouse &&
            data.warehouse[0] &&
            warehouseOptions.find((cat) => cat.label === data.warehouse[0])
              ?.value
              ? [
                  warehouseOptions.find(
                    (cat) => cat.label === data.warehouse[0]
                  ).value,
                ]
              : [],
          products: productFields.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            productCode: product.productCode || "N/A",
            type: product.type,
            quantity: Number(product.quantity),
            warehouse: product.warehouse,
            currentStock: product.currentStock,
            avgPurchasePrice: product.avgPurchasePrice,
          })),
        };

        const formData = new FormData();

        for (const key in modifyData) {
          if (key === "products") {
            modifyData.products.forEach((product, index) => {
              for (const productKey in product) {
                formData.append(
                  `products[${index}][${productKey}]`,
                  product[productKey].toString()
                );
              }
            });
          } else {
            formData.append(key, modifyData[key]?.toString());
          }
        }

        if (fileList.length > 0) {
          formData.append("attachDocument", fileList[0].originFileObj);
        }

        try {
          const res = await createAdjustment({
            data: formData,
            tenantDomain,
          }).unwrap();

          if (res.success) {
            toast.success(res.message || "Adjustment created successfully");
          }
          navigate("/dashboard/quantity-adjustment");
        } catch (error) {
          const errorMessage =
            error.data?.errorSources?.[0]?.message ||
            error.data?.err?.issues?.[0]?.message ||
            error.data?.message ||
            "Failed to create adjustment";

          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      },
      "You don't have permission to create adjustment !"
    );
  };

  const handleChange = (_value, option) => {
    if (!option) return;
    onAddProductField(option);
  };

  return (
    <TASForm onSubmit={handleSubmit}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.text.primary,
            fontWeight: "bold",
          }}
        >
          <TuneIcon sx={{ mr: 1, color: "#6366f1" }} />
          Inventory Adjustment Details
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/quantity-adjustment")}
          sx={{
            borderRadius: "12px",
            borderColor: "#cbd5e1",
            color: "#64748b",
            "&:hover": {
              borderColor: "#94a3b8",
              backgroundColor: "#f8fafc",
            },
          }}
        >
          Back to List
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background:
                "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Box
              sx={{
                background: "#42A0D9",
                py: 2,
                px: 3,
                display: "flex",
                alignItems: "center",
              }}
            >
              <ReceiptIcon sx={{ color: "white", mr: 1.5 }} />
              <Typography variant="h6" fontWeight="700" color="white">
                Document
              </Typography>
            </Box>
            <CardContent
              sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                Attach invoice or related documents for this adjustment
              </Typography>

              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <AddjustmentFileUpload
                  name="attachDocument"
                  label="Attach Document"
                  fullWidth
                  sx={{ width: "100%" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card
            sx={{
              borderRadius: "20px",
              border: "1px solid rgba(226, 232, 240, 0.8)",
              overflow: "hidden",
              background:
                "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            }}
          >
            <Box
              sx={{
                background: "#42A0D9",
                py: 2,
                px: 3,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TuneIcon sx={{ color: "white", mr: 1.5 }} />
              <Typography variant="h6" fontWeight="700" color="white">
                Adjustment Details
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                Enter the basic information for this inventory adjustment
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TASDatepicker
                    name="date"
                    label="Adjustment Date"
                    fullWidth
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6366f1",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TASInput
                    name="referenceNo"
                    label="Reference No"
                    fullWidth
                    size="medium"
                    placeholder="ADJ-0001"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: "12px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#cbd5e1",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#6366f1",
                          borderWidth: "2px",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TASAutocomplete
                    options={warehouseOptions}
                    size="medium"
                    fullWidth
                    name="warehouse"
                    label="Select Warehouse"
                    sx={outlinedInputWrapperSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StoreIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Search */}
      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          mt: 4,
          overflow: "hidden",
          background:
            "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box
          sx={{
            background: "#42A0D9",
            py: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <SearchIcon sx={{ color: "white", mr: 1.5 }} />
          <Typography variant="h6" fontWeight="700" color="white">
            Add Products
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
            Search and add products to adjust their inventory quantities
          </Typography>

          <Autocomplete
            freeSolo
            disableClearable
            options={
              stockData?.data?.map((stock) => ({
                label: stock.product.product_name,
                value: stock.product._id,
                stock,
              })) || []
            }
            loading={isLoading}
            value={null}
            onChange={handleChange}
            onInputChange={(event, newValue) => setSearchTerm(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Product"
                placeholder="Type to search products..."
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                  sx: {
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e2e8f0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#cbd5e1",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#6366f1",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 50,
                      height: 50,
                      mr: 2,
                      backgroundColor: alpha("#6366f1", 0.1),
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor: alpha("#6366f1", 0.2),
                    }}
                  >
                    <InventoryIcon sx={{ color: "#6366f1" }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight="600">
                      {option.label}
                    </Typography>
                    <Typography variant="body2" color="#64748b">
                      Code: {option.stock.product.product_code || "N/A"} |
                      Stock:{" "}
                      {option.stock.inQuantity - option.stock.outQuantity ||
                        "N/A"}{" "}
                      | Warehouse: {option.stock.warehouse.name}
                    </Typography>
                  </Box>
                  <Chip
                    label="Add"
                    size="small"
                    color="primary"
                    sx={{
                      borderRadius: "8px",
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 2px 5px rgba(99, 102, 241, 0.3)",
                    }}
                  />
                </Box>
              </li>
            )}
          />
        </CardContent>
      </Card>

      {/* Product List */}
      <Box sx={{ mt: 4 }}>
        <>
          {productFields.length === 0 ? (
            <Box>
              <Typography
                variant="h6"
                fontWeight="600"
                color="#1e293b"
                textAlign="center"
              >
                No Products Added Yet
              </Typography>
            </Box>
          ) : (
            productFields.map((field, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: "16px",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  mb: 3,
                  overflow: "hidden",
                  color: "#fff",
                }}
              >
                <Box sx={{ p: 3, position: "relative" }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Product Name */}
                    <Grid item xs={12} md={3}>
                      <Box sx={{ mb: { xs: 1, md: 0 } }}>
                        <Typography
                          variant="body2"
                          color="#64748b"
                          gutterBottom
                        >
                          Product
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              mr: 1.5,
                              bgcolor: alpha("#6366f1", 0.1),
                              color: "#6366f1",
                              borderRadius: "8px",
                            }}
                          >
                            <InventoryIcon fontSize="small" />
                          </Avatar>
                          <Typography
                            variant="body1"
                            fontWeight="600"
                            color="#1e293b"
                          >
                            {field.productName}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Warehouse Name */}
                    <Grid item xs={12} md={2}>
                      <Box sx={{ mb: { xs: 1, md: 0 } }}>
                        <Typography
                          variant="body2"
                          color="#64748b"
                          gutterBottom
                        >
                          Warehouse
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Chip
                            icon={<StoreIcon fontSize="small" />}
                            label={field.warehouseName || "N/A"}
                            size="small"
                            sx={{
                              bgcolor: alpha("#6366f1", 0.1),
                              color: "#6366f1",
                              fontWeight: "medium",
                              borderRadius: "8px",
                              "& .MuiChip-icon": {
                                color: "#6366f1",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Current Stock */}
                    <Grid item xs={12} md={1}>
                      <Box sx={{ mb: { xs: 1, md: 0 } }}>
                        <Typography
                          variant="body2"
                          color="#64748b"
                          gutterBottom
                        >
                          Current Stock
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Chip
                            icon={<InventoryIcon fontSize="small" />}
                            label={field.currentStock || 0}
                            size="small"
                            sx={{
                              bgcolor: alpha("#10b981", 0.1),
                              color: "#10b981",
                              fontWeight: "medium",
                              borderRadius: "8px",
                              "& .MuiChip-icon": {
                                color: "#10b981",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Avg. Purchase Price */}
                    <Grid item xs={12} md={1}>
                      <Box sx={{ mb: { xs: 1, md: 0 } }}>
                        <Typography
                          variant="body2"
                          color="#64748b"
                          gutterBottom
                        >
                          Avg. Price
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Chip
                            label={`$${field.avgPurchasePrice || 0}`}
                            size="small"
                            sx={{
                              bgcolor: alpha("#6366f1", 0.1),
                              color: "#6366f1",
                              fontWeight: "medium",
                              borderRadius: "8px",
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>

                    {/* Adjustment Type - Plus/Minus Buttons in Bangla */}
                    <Grid item xs={12} md={2}>
                      <Box sx={{ mb: { xs: 1, md: 0 } }}>
                        <Typography
                          variant="body2"
                          color="#64748b"
                          gutterBottom
                          textAlign="center"
                        >
                          Adjustment Type
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          {/* Subtraction Button - Bangla */}
                          <Tooltip title="স্টক থেকে বাদ দিন" arrow>
                            <Button
                              variant={
                                field.type === "Subtraction"
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() =>
                                handleAdjustmentTypeChange(index, "Subtraction")
                              }
                              startIcon={<RemoveIcon />}
                              size="small"
                              sx={{
                                borderRadius: "6px",
                                textTransform: "none",
                                fontWeight: "600",
                                fontSize: "0.75rem",
                                minWidth: "auto",
                                px: 1,
                                py: 0.5,
                                ...(field.type === "Subtraction"
                                  ? {
                                      backgroundColor: "#ef4444",
                                      color: "white",
                                      "&:hover": {
                                        backgroundColor: "#dc2626",
                                      },
                                    }
                                  : {
                                      borderColor: "#ef4444",
                                      color: "#ef4444",
                                      "&:hover": {
                                        borderColor: "#dc2626",
                                        backgroundColor: alpha("#ef4444", 0.04),
                                      },
                                    }),
                              }}
                            >
                              বাদ
                            </Button>
                          </Tooltip>

                          {/* Addition Button - Bangla */}
                          <Tooltip title="স্টক যোগ করুন" arrow>
                            <Button
                              variant={
                                field.type === "Addition"
                                  ? "contained"
                                  : "outlined"
                              }
                              onClick={() =>
                                handleAdjustmentTypeChange(index, "Addition")
                              }
                              startIcon={<AddIcon />}
                              size="small"
                              sx={{
                                borderRadius: "6px",
                                textTransform: "none",
                                fontWeight: "600",
                                fontSize: "0.75rem",
                                minWidth: "auto",
                                px: 1,
                                py: 0.5,
                                ...(field.type === "Addition"
                                  ? {
                                      backgroundColor: "#10b981",
                                      color: "white",
                                      "&:hover": {
                                        backgroundColor: "#059669",
                                      },
                                    }
                                  : {
                                      borderColor: "#10b981",
                                      color: "#10b981",
                                      "&:hover": {
                                        borderColor: "#059669",
                                        backgroundColor: alpha("#10b981", 0.04),
                                      },
                                    }),
                              }}
                            >
                              যোগ
                            </Button>
                          </Tooltip>
                        </Box>

                        {/* Visual indicator in Bangla */}
                        <Typography
                          variant="caption"
                          color={
                            field.type === "Addition" ? "#10b981" : "#ef4444"
                          }
                          sx={{
                            display: "block",
                            textAlign: "center",
                            mt: 0.5,
                            fontWeight: "600",
                            fontSize: "0.7rem",
                          }}
                        >
                          {field.type === "Addition"
                            ? "স্টকে যোগ করা হচ্ছে"
                            : "স্টক থেকে বাদ দেওয়া হচ্ছে"}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Quantity */}
                    <Grid item xs={12} md={2}>
                      <Box sx={{ mb: { xs: 1, md: 0 } }}>
                        <Typography
                          variant="body2"
                          color="#64748b"
                          gutterBottom
                          textAlign="center"
                        >
                          {field.type === "Addition" ? "যতটা যোগ" : "যতটা বাদ"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => {
                                const newFields = [...productFields];
                                if (newFields[index].quantity > 1) {
                                  newFields[index].quantity -= 1;
                                  setProductFields(newFields);
                                }
                              }}
                              sx={{
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                p: "2px",
                                color: "#64748b",
                                transition: "all 0.2s",
                                "&:hover": {
                                  backgroundColor: "#f1f5f9",
                                  color: "#1e293b",
                                },
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              name={`products[${index}].quantity`}
                              type="number"
                              size="small"
                              value={field.quantity}
                              onChange={(e) => {
                                const newFields = [...productFields];
                                newFields[index].quantity = Math.max(
                                  1,
                                  Number(e.target.value)
                                );
                                setProductFields(newFields);
                              }}
                              InputProps={{
                                sx: {
                                  borderRadius: "6px",
                                  width: "70px",
                                  textAlign: "center",
                                  fontSize: "0.875rem",
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor:
                                      field.type === "Addition"
                                        ? alpha("#10b981", 0.3)
                                        : alpha("#ef4444", 0.3),
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor:
                                      field.type === "Addition"
                                        ? "#10b981"
                                        : "#ef4444",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                      borderColor:
                                        field.type === "Addition"
                                          ? "#10b981"
                                          : "#ef4444",
                                      borderWidth: "2px",
                                    },
                                },
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => {
                                const newFields = [...productFields];
                                newFields[index].quantity += 1;
                                setProductFields(newFields);
                              }}
                              sx={{
                                borderRadius: "6px",
                                p: "2px",
                                background:
                                  field.type === "Addition"
                                    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                                    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                                color: "white",
                                boxShadow:
                                  field.type === "Addition"
                                    ? "0 2px 5px rgba(16, 185, 129, 0.3)"
                                    : "0 2px 5px rgba(239, 68, 68, 0.3)",
                                "&:hover": {
                                  boxShadow:
                                    field.type === "Addition"
                                      ? "0 4px 8px rgba(16, 185, 129, 0.4)"
                                      : "0 4px 8px rgba(239, 68, 68, 0.4)",
                                },
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Remove Button */}
                    <Grid
                      item
                      xs={12}
                      md={1}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Tooltip title="Remove Product" arrow>
                        <IconButton
                          onClick={() => onRemoveProductField(index)}
                          sx={{
                            color: "#ef4444",
                            bgcolor: alpha("#ef4444", 0.1),
                            borderRadius: "8px",
                            "&:hover": {
                              backgroundColor: alpha("#ef4444", 0.2),
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            ))
          )}
        </>
      </Box>

      <Card
        sx={{
          borderRadius: "20px",
          border: "1px solid rgba(226, 232, 240, 0.8)",
          mt: 4,
          overflow: "hidden",
          background:
            "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box
          sx={{
            background: "#42A0D9",
            py: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
          }}
        >
          <NotesIcon sx={{ color: "white", mr: 1.5 }} />
          <Typography variant="h6" fontWeight="700" color="white">
            Additional Notes
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
            Add any additional information about this inventory adjustment
          </Typography>

          <TASTextarea
            name="note"
            placeholder="Enter notes or additional details about this adjustment..."
            minRows={4}
            fullWidth
            size="medium"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e2e8f0",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6366f1",
                  borderWidth: "2px",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ alignSelf: "flex-start", mt: 1.5 }}
                >
                  <NotesIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Can page="/dashboard/add-adjustment" action="create">
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={purchaseBtn}
          >
            {isSubmitting ? "Creating Adjustment..." : "Create Adjustment"}
          </Button>
        </Can>
      </Box>
    </TASForm>
  );
};

export default AddAdjustmentForm;
