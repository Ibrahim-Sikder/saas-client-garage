/* eslint-disable react/prop-types */

import {
    Box,
    Typography,
    Divider,
    Grid,
    alpha,
} from '@mui/material';
import GarageModal from '../../components/Share/Modal/GarageModal';

const ProductDetailsModal = ({
    open,
    selectedProduct,
    theme,
    setOpen
}) => {

    return (
        <GarageModal
            open={open}
            setOpen={setOpen}
            title=' Product Details'
            maxWidth="md"
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                        {selectedProduct?.image ? (
                            <img
                                src={selectedProduct?.image}
                                alt={selectedProduct?.product_name}
                                style={{
                                    maxHeight: "200px",
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 200,
                                    width: 200,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    borderRadius: 1,
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    No Image Available
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        {selectedProduct?.product_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Product Code: {selectedProduct?.product_code}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Category: {selectedProduct?.category?.main_category || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Brand: {selectedProduct?.brand?.brand || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Product Type: {selectedProduct?.product_type?.product_type || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Unit: {selectedProduct?.unit?.unit || 'N/A'} ({selectedProduct?.unit?.short_name || 'N/A'})
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Pricing Information
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Purchase Price: ৳ {selectedProduct?.purchasePrice}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Selling Price: ৳ {selectedProduct?.sellingPrice}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Minimum Sale Price: ৳ {selectedProduct?.minimumSalePrice}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Discount: {selectedProduct?.discount}%
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Tax: {selectedProduct?.product_tax}%
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Stock Information
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Stock: {selectedProduct?.product_quantity} {selectedProduct?.unit?.short_name || ''}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Initial Stock: {selectedProduct?.initialStock} {selectedProduct?.unit?.short_name || ''}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Stock Alert: {selectedProduct?.stock_alert} {selectedProduct?.unit?.short_name || ''}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Reorder Level: {selectedProduct?.reorderLevel} {selectedProduct?.unit?.short_name || ''}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Additional Information
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Batch Number: {selectedProduct?.batchNumber || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Storage Location: {selectedProduct?.storageLocation || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Warehouse: {selectedProduct?.warehouse?.name || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Supplier: {selectedProduct?.suppliers?.supplierId || 'N/A'}
                    </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Date Information
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Manufacturing Date: {selectedProduct?.manufacturingDate || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Expiry Date: {selectedProduct?.expiryDate || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Purchase Date: {selectedProduct?.lastPurchaseDate || 'N/A'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Sold Date: {selectedProduct?.lastSoldDate || 'N/A'}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Product Description
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {selectedProduct?.productDescription || 'No description available'}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Specifications
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {selectedProduct?.specifications || 'No specifications available'}
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Tags
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedProduct?.tags && selectedProduct?.tags.length > 0 ? (
                            selectedProduct?.tags.map((tag, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        borderRadius: 1,
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    {tag}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No tags available
                            </Typography>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </GarageModal>
    );
};

export default ProductDetailsModal;