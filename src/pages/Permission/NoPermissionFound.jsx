import { TableCell, TableRow, Typography } from "@mui/material";

const NoPermissionsFound = () => (
    <TableRow>
        <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
            <Typography variant="body2" color="text.secondary">
                No permissions found
            </Typography>
        </TableCell>
    </TableRow>
);

export default NoPermissionsFound;