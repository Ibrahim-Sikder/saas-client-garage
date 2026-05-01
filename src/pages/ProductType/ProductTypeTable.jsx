/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    IconButton,
    Chip,
    InputAdornment,
    Tooltip,
    CircularProgress,
    alpha,
} from "@mui/material";
import {
    Category as CategoryIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Clear as ClearIcon,
    Edit as EditIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import {
    useDeleteProductTypeMutation,
    useGetAllIProductTypeQuery,
} from "../../redux/api/productTypeApi";
import { useTenantDomain } from "../../hooks/useTenantDomain";
import { modalBox, modalStyle } from "../../utils/customStyle";
import { usePermissions } from "../../context/PermissionContext";
import Can from "../../components/Can";

const ProductTypeTable = ({ onEditProductType, onOpenCreateModal }) => {
    const { tenantDomain } = useTenantDomain();
    const { performActionWithPermission } = usePermissions();
    const [deleteProductType, { isLoading: isDeleting }] =
        useDeleteProductTypeMutation();
    const { isLoading, data, refetch } = useGetAllIProductTypeQuery({
        tenantDomain,
    });

    const [searchTerm, setSearchTerm] = useState("");

    const productTypes = data?.data?.productTypes || [];
    const filteredProductTypes = productTypes.filter((type) =>
        type.product_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const rows = filteredProductTypes.map((productType) => ({
        id: productType._id,
        _id: productType._id,
        product_type: productType.product_type,
        createdAt: new Date(productType.createdAt).toLocaleDateString(),
    }));

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDeleteClick = async (id, productTypeName) => {
        performActionWithPermission('/dashboard/product-type', 'delete',
            async () => {
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: `You are about to delete "${productTypeName}". This action cannot be undone!`,
                    icon: 'warning',
                    showCancelButton: true,


                });

                if (result.isConfirmed) {
                    try {
                        await deleteProductType({ tenantDomain, id }).unwrap();

                        Swal.fire({
                            icon: "success",
                            title: "Deleted!",
                            text: `"${productTypeName}" has been deleted successfully.`,
                            showConfirmButton: false,

                        });

                        // Refetch the data to update the table
                        refetch();
                    } catch (error) {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: "An error occurred while deleting the product type.",
                            confirmButtonColor: "#6a1b9a",

                        });
                    }
                }
            }
        )
    };

    const handleEditClick = (productType) => {
        if (onEditProductType) {
            onEditProductType({
                id: productType._id,
                _id: productType._id,
                product_type: productType.product_type
            });
        }
    };

    const columns = [
        {
            field: "product_type",
            headerName: "Product Type",
            flex: 2,
            renderCell: (params) => (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CategoryIcon
                        sx={{ color: alpha("#6a1b9a", 0.7), mr: 1, fontSize: 20 }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                        {params.value}
                    </Typography>
                </Box>
            ),
        },
        {
            field: "createdAt",
            headerName: "Created Date",
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        bgcolor: alpha("#6a1b9a", 0.1),
                        color: "#6a1b9a",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                    }}
                />
            ),
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={() => handleEditClick({
                                id: params.row._id,
                                _id: params.row._id,
                                product_type: params.row.product_type
                            })}
                            sx={{
                                bgcolor: alpha("#6a1b9a", 0.1),
                                color: "#6a1b9a",
                                "&:hover": {
                                    bgcolor: alpha("#6a1b9a", 0.2),
                                },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Can page='/dashboard/product-type' action='delete'>
                            <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(params.row._id, params.row.product_type)}
                                disabled={isDeleting}
                                sx={{
                                    bgcolor: alpha("#d32f2f", 0.1),
                                    color: "#d32f2f",
                                    "&:hover": {
                                        bgcolor: alpha("#d32f2f", 0.2),
                                    },
                                    "&:disabled": {
                                        bgcolor: alpha("#d32f2f", 0.05),
                                        color: alpha("#d32f2f", 0.3),
                                    },
                                }}
                            >
                                {isDeleting ? (
                                    <CircularProgress size={16} />
                                ) : (
                                    <DeleteIcon fontSize="small" />
                                )}
                            </IconButton>
                        </Can>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    background: "#499CCC",
                    py: 1.5,
                    px: { xs: 1, sm: 3 },
                    borderRadius: "12px 12px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",

                }}
                className="gap-2"
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CategoryIcon sx={{ color: "white", mr: 1, fontSize: 28 }} />
                    <p className="text-md md:text-4xl font-bold text-white">Product Types</p>
                    {/* <Typography
                        variant="h6"
                        component="h2"
                        sx={{ color: "white", fontWeight: 600 }}
                    >
                        Product Types
                    </Typography> */}
                    <Chip
                        label={productTypes.length}
                        size="small"
                        sx={{
                            ml: 1.5,
                            bgcolor: "rgba(255,255,255,0.2)",
                            color: "white",
                            fontWeight: 600,
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onOpenCreateModal}
                    sx={{
                        borderRadius: 100,
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        "&:hover": {
                            bgcolor: "rgba(255,255,255,0.3)",
                        },
                        px: { xs: 1, sm: 3 },

                        py: 0.5,
                    }}
                >
                    Add New
                </Button>
            </Box>

            <Box sx={{ p: 3, pb: 0 }}>
                <TextField
                    fullWidth
                    placeholder="Search product types..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm("")}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 100,
                            bgcolor: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: alpha("#6a1b9a", 0.2),
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: alpha("#6a1b9a", 0.5),
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#6a1b9a",
                            },
                        },
                    }}
                    sx={{
                        mb: 2,
                    }}
                />
            </Box>

            <CardContent
                sx={{
                    p: 3,
                    pt: 0,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ flexGrow: 1, width: "100%", mt: 2 }}>
                    {isLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "300px",
                            }}
                        >
                            <CircularProgress sx={{ color: "#6a1b9a" }} />
                        </Box>
                    ) : rows.length === 0 ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "300px",
                                bgcolor: alpha("#6a1b9a", 0.03),
                                borderRadius: 2,
                                border: `1px dashed ${alpha("#6a1b9a", 0.2)}`,
                            }}
                        >
                            <CategoryIcon
                                sx={{ fontSize: 48, color: alpha("#6a1b9a", 0.2), mb: 2 }}
                            />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No Product Types Found
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                                sx={{ maxWidth: 300, mb: 2 }}
                            >
                                {searchTerm
                                    ? "No product types match your search criteria."
                                    : "You haven't added any product types yet."}
                            </Typography>
                            {searchTerm ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={() => setSearchTerm("")}
                                    sx={{
                                        borderRadius: 100,
                                        borderColor: alpha("#6a1b9a", 0.5),
                                        color: "#6a1b9a",
                                        "&:hover": {
                                            borderColor: "#6a1b9a",
                                            bgcolor: alpha("#6a1b9a", 0.05),
                                        },
                                    }}
                                >
                                    Clear Search
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={onOpenCreateModal}
                                    sx={{
                                        borderRadius: 100,
                                        bgcolor: "#6a1b9a",
                                        "&:hover": {
                                            bgcolor: "#5a1485",
                                        },
                                    }}
                                >
                                    Add Product Type
                                </Button>
                            )}
                        </Box>
                    ) : (
                        <Box sx={modalBox}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                slots={{
                                    toolbar: GridToolbar,
                                }}
                                checkboxSelection
                                disableRowSelectionOnClick
                                autoHeight={false}
                                sx={modalStyle}
                            />
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ProductTypeTable;