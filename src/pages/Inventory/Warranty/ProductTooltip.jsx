/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

export const ProductTooltip = ({ products }) => (
  <Box sx={{ p: 1, maxHeight: 200, overflow: 'auto' }}>
    {products && products.length > 0 ? (
      products.map((productId, index) => (
        <Typography key={index} variant="body2" sx={{ py: 0.5 }}>
          Product {index + 1}: {productId}
        </Typography>
      ))
    ) : (
      <Typography variant="body2">No products assigned</Typography>
    )}
  </Box>
);