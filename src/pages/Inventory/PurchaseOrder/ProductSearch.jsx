/* eslint-disable react/prop-types */
// components/PurchaseOrder/ProductSearch.jsx

import {
    Box,
    Card,
    CardContent,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import {
    Inventory as InventoryIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { inputFieldSx, productStyle } from "../../../utils/customStyle";

const ProductSearch = ({ onProductSearch, productSearchRef }) => {
    const productBox = {
        background: `linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)`,
        py: 2,
        px: 3,
        display: "flex",
        alignItems: "center",
    };

    return (
        <Card sx={productStyle}>
            <Box sx={productBox}>
                <InventoryIcon sx={{ color: "white", mr: 1.5 }} />
                <Typography variant="h6" fontWeight="700" color="white">
                    Add Products
                </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                    Search and add products to your purchase order
                </Typography>

                <TextField
                    label="Search Product"
                    placeholder="Type to search products..."
                    InputProps={{
                        type: "search",
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        sx: inputFieldSx,
                    }}
                    inputRef={productSearchRef}
                    onChange={(e) => onProductSearch(e.target.value)}
                    fullWidth
                />
            </CardContent>
        </Card>
    );
};

export default ProductSearch;