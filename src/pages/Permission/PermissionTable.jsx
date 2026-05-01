/* eslint-disable react/prop-types */
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    alpha,
    Checkbox
} from "@mui/material";
import NoPermissionsFound from "./NoPermissionFound";
import PermissionRow from "./PermissionRow";

const PermissionsTable = ({
    permissions,
    getRoleColor,
    handleDialogOpen,
    handleDeletePermission,
    selectedPermissions,
    handleSelectPermission,
    handleSelectAllPermissions,
    isAllSelected
}) => {
    const theme = useTheme();

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
        >
            <Table>
                <TableHead sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                }}>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                indeterminate={selectedPermissions.length > 0 && selectedPermissions.length < permissions.length}
                                checked={isAllSelected}
                                onChange={handleSelectAllPermissions}
                            />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Page</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Create</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Edit</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>View</TableCell>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Delete</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {permissions.length > 0 ? (
                        permissions.map((permission) => (
                            <PermissionRow
                                key={permission._id}
                                permission={permission}
                                getRoleColor={getRoleColor}
                                handleDialogOpen={handleDialogOpen}
                                handleDeletePermission={handleDeletePermission}
                                isSelected={selectedPermissions.includes(permission._id)}
                                handleSelectPermission={handleSelectPermission}
                            />
                        ))
                    ) : (
                        <NoPermissionsFound />
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PermissionsTable;