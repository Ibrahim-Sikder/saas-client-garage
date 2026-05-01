/* eslint-disable react/prop-types */
import { Box, Typography, Pagination } from "@mui/material";

const PermissionsPagination = ({ page, pages, total, limit, onPageChange }) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 3,
            p: 2,
        }}
    >
        <Typography variant="body2">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} permissions
        </Typography>
        <Pagination
            count={pages}
            page={page}
            onChange={onPageChange}
            color="primary"
            showFirstButton
            showLastButton
        />
    </Box>
);

export default PermissionsPagination;