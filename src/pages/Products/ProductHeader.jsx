/* eslint-disable react/prop-types */
import { Box, Button, Typography } from "@mui/material";
import Breadcrumb from "../../components/Breadcrumb";
import {
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
export const ProductHeader = ({ id, navigate }) => {
    const breadcrumbItems = [
        { label: "Dashboard", href: "/" },
        { label: "Products", href: "/products" },
        { label: id ? "Edit Product" : "Create Product" },
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />

            <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: 'space-between' }}>
                <Box>

                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {id ? "Edit Product" : "Create New Product"}
                    </Typography>
                </Box>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    sx={{
                        borderRadius: 100,
                        borderColor: "rgba(0,0,0,0.12)",
                        color: "text.secondary",
                        px: 3,
                    }}
                >
                    Back to Product List
                </Button>

            </Box>

        </>
    );
};
