/* eslint-disable react/prop-types */
// components/PurchaseOrder/ProductTable.jsx

import {
    alpha,
    Avatar,
    Box,
    Card,
    Chip,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Inventory as InventoryIcon,
    Remove as RemoveIcon,
} from "@mui/icons-material";
import { formatCurrency } from "../../../utils/formateCurrency";

const ProductTable = ({
    productFields,
    onQuantityChange,
    onPriceChange,
    onUnitPriceChange,
    onTaxChange,
    onDiscountChange,
    onRemoveProduct,
}) => {
    const productBox = {
        background: `linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)`,
        py: 2,
        px: 3,
        display: "flex",
        alignItems: "center",
    };

    return (
        <Card
            sx={{
                borderRadius: "20px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                mt: 4,
                width: "100%",
                overflow: "hidden",
                background:
                    "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
                boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            }}
        >
            <Box sx={productBox}>
                <Box>
                    <InventoryIcon sx={{ color: "white", mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="700" color="white">
                        Purchase Items
                    </Typography>
                </Box>
                {productFields.length > 0 && (
                    <Chip
                        label={`${productFields.length} ${productFields.length === 1 ? "item" : "items"
                            }`}
                        size="small"
                        sx={{
                            color: "white",
                            bgcolor: "rgba(255,255,255,0.2)",
                            fontWeight: "bold",
                            borderRadius: "8px",
                        }}
                    />
                )}
            </Box>

            <Box width="100%" sx={{ p: 0 }}>
                <Box sx={{ overflowX: "auto", width: "100%" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ backgroundColor: alpha("#8b5cf6", 0.05) }}>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    #
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "left",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Product
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Unit
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Unit Price
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Quantity
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "right",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Price
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "right",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Tax (%)
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "right",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Discount
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "right",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Subtotal
                                </th>
                                <th
                                    style={{
                                        padding: "14px 16px",
                                        textAlign: "center",
                                        fontWeight: 600,
                                        color: "#475569",
                                        borderBottom: "1px solid #e2e8f0",
                                    }}
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {productFields.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={10}
                                            style={{
                                                padding: "40px 16px",
                                                textAlign: "center",
                                                color: "#64748b",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    gap: 2,
                                                }}
                                            >
                                                <div

                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            backgroundColor: alpha("#8b5cf6", 0.1),
                                                            color: "#8b5cf6",
                                                            border: "2px dashed",
                                                            borderColor: alpha("#8b5cf6", 0.3),
                                                        }}
                                                    >
                                                        <InventoryIcon sx={{ fontSize: 40 }} />
                                                    </Avatar>
                                                </div>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="600"
                                                    color="#1e293b"
                                                >
                                                    No products added yet
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="#64748b"
                                                    sx={{ maxWidth: "400px" }}
                                                >
                                                    Search for products above and add them to your purchase order
                                                </Typography>
                                            </Box>
                                        </td>
                                    </tr>
                                ) : (
                                    productFields.map((field, index) => (
                                        <tr
                                            key={index}
                                            style={{
                                                borderBottom: "1px solid #e2e8f0",
                                                backgroundColor:
                                                    index % 2 === 0
                                                        ? "white"
                                                        : alpha("#f8fafc", 0.5),
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    color: "#64748b",
                                                    textAlign: "left",
                                                }}
                                            >
                                                <Chip
                                                    label={index + 1}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha("#8b5cf6", 0.1),
                                                        color: "#8b5cf6",
                                                        fontWeight: "bold",
                                                        minWidth: "30px",
                                                    }}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    color: "#1e293b",
                                                    fontWeight: 600,
                                                    textAlign: "left",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            mr: 1.5,
                                                            bgcolor: alpha("#8b5cf6", 0.1),
                                                            color: "#8b5cf6",
                                                            borderRadius: "8px",
                                                        }}
                                                    >
                                                        <InventoryIcon fontSize="small" />
                                                    </Avatar>
                                                    {field.productName}
                                                </Box>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    color: "#64748b",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Chip
                                                    label={field.productUnit}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: alpha("#3b82f6", 0.1),
                                                        color: "#3b82f6",
                                                        fontWeight: "medium",
                                                    }}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={field.unit_price || ""}
                                                    onChange={(e) =>
                                                        onUnitPriceChange(index, e.target.value)
                                                    }
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                ৳
                                                            </InputAdornment>
                                                        ),
                                                        sx: {
                                                            borderRadius: "8px",
                                                            width: "120px",
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#e2e8f0",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#cbd5e1",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#8b5cf6",
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            onQuantityChange(index, -1)
                                                        }
                                                        sx={{
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "8px",
                                                            p: "4px",
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
                                                    <Typography
                                                        variant="body1"
                                                        fontWeight="600"
                                                        color="#1e293b"
                                                        sx={{
                                                            minWidth: "36px",
                                                            textAlign: "center",
                                                            bgcolor: alpha("#8b5cf6", 0.05),
                                                            borderRadius: "6px",
                                                            py: 0.5,
                                                        }}
                                                    >
                                                        {field.product_quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            onQuantityChange(index, 1)
                                                        }
                                                        sx={{
                                                            borderRadius: "8px",
                                                            p: "4px",
                                                            background:
                                                                "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                                            color: "white",
                                                            boxShadow:
                                                                "0 2px 5px rgba(139, 92, 246, 0.3)",
                                                            "&:hover": {
                                                                boxShadow:
                                                                    "0 4px 8px rgba(139, 92, 246, 0.4)",
                                                            },
                                                        }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={field.productPrice || ""}
                                                    onChange={(e) =>
                                                        onPriceChange(index, e.target.value)
                                                    }
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                ৳
                                                            </InputAdornment>
                                                        ),
                                                        sx: {
                                                            borderRadius: "8px",
                                                            width: "120px",
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#e2e8f0",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#cbd5e1",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#8b5cf6",
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={field.tax || ""}
                                                    onChange={(e) =>
                                                        onTaxChange(index, e.target.value)
                                                    }
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                %
                                                            </InputAdornment>
                                                        ),
                                                        sx: {
                                                            borderRadius: "8px",
                                                            width: "100px",
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#e2e8f0",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#cbd5e1",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#8b5cf6",
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                <TextField
                                                    size="small"
                                                    type="number"
                                                    value={field.discount || ""}
                                                    onChange={(e) =>
                                                        onDiscountChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                ৳
                                                            </InputAdornment>
                                                        ),
                                                        sx: {
                                                            borderRadius: "8px",
                                                            width: "120px",
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#e2e8f0",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#cbd5e1",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                            {
                                                                borderColor: "#8b5cf6",
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                    }}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    color: "#1e293b",
                                                    fontWeight: 700,
                                                    textAlign: "right",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        bgcolor: alpha("#10b981", 0.1),
                                                        color: "#10b981",
                                                        py: 0.75,
                                                        px: 1.5,
                                                        borderRadius: "8px",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        field.subtotal ||
                                                        (field.unit_price ||
                                                            field.productPrice) * field.product_quantity
                                                    )}
                                                </Box>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "16px",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Tooltip title="Remove Item" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onRemoveProduct(index)}
                                                        sx={{
                                                            color: "#ef4444",
                                                            bgcolor: alpha("#ef4444", 0.1),
                                                            borderRadius: "8px",
                                                            "&:hover": {
                                                                backgroundColor: alpha(
                                                                    "#ef4444",
                                                                    0.2
                                                                ),
                                                            },
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </>
                        </tbody>
                    </table>
                </Box>
            </Box>
        </Card>
    );
};

export default ProductTable;