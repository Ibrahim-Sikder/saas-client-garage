/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Divider,
    FormControlLabel,
    Switch,
    Grid,
    Chip,
    Avatar,
    useTheme,
    alpha,
    CircularProgress,
} from "@mui/material";
import { LibraryBooks, Person, Security } from "@mui/icons-material";
import Swal from "sweetalert2";

const UpdateMultiplePermissionsDialog = ({
    open,
    onClose,
    selectedPermissions,
    permissions,
    onUpdatePermissions,
    tenantDomain
}) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [permissionUpdates, setPermissionUpdates] = useState({});

    // Initialize permission updates when dialog opens
    useEffect(() => {
        if (open && selectedPermissions.length > 0) {
            const updates = {};
            selectedPermissions.forEach(id => {
                const permission = permissions.find(p => p._id === id);
                if (permission) {
                    updates[id] = {
                        // userId যোগ করুন
                        userId: permission.userId && permission.userId.length > 0
                            ? permission.userId.map(u => u._id || u.toString())
                            : [],
                        // roleId যোগ করুন
                        roleId: permission.roleId && permission.roleId.length > 0
                            ? permission.roleId.map(r => r._id || r.toString())
                            : [],
                        // pageId যোগ করুন
                        pageId: permission.pageId && permission.pageId.length > 0
                            ? permission.pageId.map(p => p._id || p.toString())
                            : [],
                        create: permission.create,
                        edit: permission.edit,
                        view: permission.view,
                        delete: permission.delete,
                    };
                }
            });
            setPermissionUpdates(updates);
        }
    }, [open, selectedPermissions, permissions]);

    const handlePermissionChange = (permissionId, permissionType) => {
        setPermissionUpdates(prev => ({
            ...prev,
            [permissionId]: {
                ...prev[permissionId],
                [permissionType]: !prev[permissionId][permissionType]
            }
        }));
    };

    const handleUpdateAll = (permissionType, value) => {
        const updates = {};
        selectedPermissions.forEach(id => {
            updates[id] = {
                ...permissionUpdates[id],
                [permissionType]: value
            };
        });
        setPermissionUpdates(updates);
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const updates = selectedPermissions.map(id => ({
                tenantDomain,
                permissionId: id,
                // userId, roleId, এবং pageId অন্তর্ভুক্ত করুন
                userId: permissionUpdates[id]?.userId,
                roleId: permissionUpdates[id]?.roleId,
                pageId: permissionUpdates[id]?.pageId,
                create: permissionUpdates[id]?.create,
                edit: permissionUpdates[id]?.edit,
                view: permissionUpdates[id]?.view,
                delete: permissionUpdates[id]?.delete,
            }));

            const result = await onUpdatePermissions(updates);

            if (result.success) {
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: `${selectedPermissions.length} permission(s) updated successfully.`,
                    showConfirmButton: false,
                    timer: 2000,
                    background: "#fff",
                });
                onClose();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: result.error,
                    confirmButtonColor: theme.palette.primary.main,
                    background: "#fff",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "An error occurred while updating permissions.",
                confirmButtonColor: theme.palette.primary.main,
                background: "#fff",
            });
        } finally {
            setLoading(false);
        }
    };

    const getSelectedPermissionDetails = () => {
        return selectedPermissions.map(id => {
            const permission = permissions.find(p => p._id === id);
            if (!permission) return null;

            const page = permission.pageId && permission.pageId.length > 0 ? permission.pageId[0] : {};
            const user = permission.userId && permission.userId.length > 0 ? permission.userId[0] : {};
            const role = permission.roleId && permission.roleId.length > 0 ? permission.roleId[0] : {};

            return {
                id,
                pageName: page.name || 'Unknown Page',
                pagePath: page.path || '',
                userName: user.name || 'Unknown User',
                userEmail: user.email || '',
                roleName: role.name || 'Unknown Role',
            };
        }).filter(Boolean);
    };

    const selectedPermissionDetails = getSelectedPermissionDetails();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                    Update Multiple Permissions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    You are about to update {selectedPermissions.length} permission(s)
                </Typography>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 2 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                        Selected Permissions:
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {selectedPermissionDetails.map((detail) => (
                            <Box
                                key={detail.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1.5,
                                    mb: 1,
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        mr: 1.5,
                                        bgcolor: alpha(theme.palette.info.main, 0.15),
                                        color: theme.palette.info.main,
                                    }}
                                >
                                    <LibraryBooks />
                                </Avatar>
                                <Box flexGrow={1}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {detail.pageName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {detail.pagePath}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip
                                        avatar={<Avatar sx={{ width: 24, height: 24 }}><Person /></Avatar>}
                                        label={detail.userName}
                                        size="small"
                                        variant="outlined"
                                    />
                                    <Chip
                                        avatar={<Avatar sx={{ width: 24, height: 24 }}><Security /></Avatar>}
                                        label={detail.roleName}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                        Permission Settings:
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2">Create</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                        Set All:
                                    </Typography>
                                    <Switch
                                        size="small"
                                        checked={selectedPermissions.every(id => permissionUpdates[id]?.create)}
                                        onChange={(e) => handleUpdateAll('create', e.target.checked)}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedPermissions.map(id => (
                                    <FormControlLabel
                                        key={`create-${id}`}
                                        control={
                                            <Switch
                                                size="small"
                                                checked={permissionUpdates[id]?.create || false}
                                                onChange={() => handlePermissionChange(id, 'create')}
                                            />
                                        }
                                        label={
                                            <Typography variant="caption">
                                                {permissions.find(p => p._id === id)?.pageId?.[0]?.name || 'Unknown'}
                                            </Typography>
                                        }
                                    />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2">Edit</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                        Set All:
                                    </Typography>
                                    <Switch
                                        size="small"
                                        checked={selectedPermissions.every(id => permissionUpdates[id]?.edit)}
                                        onChange={(e) => handleUpdateAll('edit', e.target.checked)}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedPermissions.map(id => (
                                    <FormControlLabel
                                        key={`edit-${id}`}
                                        control={
                                            <Switch
                                                size="small"
                                                checked={permissionUpdates[id]?.edit || false}
                                                onChange={() => handlePermissionChange(id, 'edit')}
                                            />
                                        }
                                        label={
                                            <Typography variant="caption">
                                                {permissions.find(p => p._id === id)?.pageId?.[0]?.name || 'Unknown'}
                                            </Typography>
                                        }
                                    />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2">View</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                        Set All:
                                    </Typography>
                                    <Switch
                                        size="small"
                                        checked={selectedPermissions.every(id => permissionUpdates[id]?.view)}
                                        onChange={(e) => handleUpdateAll('view', e.target.checked)}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedPermissions.map(id => (
                                    <FormControlLabel
                                        key={`view-${id}`}
                                        control={
                                            <Switch
                                                size="small"
                                                checked={permissionUpdates[id]?.view || false}
                                                onChange={() => handlePermissionChange(id, 'view')}
                                            />
                                        }
                                        label={
                                            <Typography variant="caption">
                                                {permissions.find(p => p._id === id)?.pageId?.[0]?.name || 'Unknown'}
                                            </Typography>
                                        }
                                    />
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2">Delete</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                                        Set All:
                                    </Typography>
                                    <Switch
                                        size="small"
                                        checked={selectedPermissions.every(id => permissionUpdates[id]?.delete)}
                                        onChange={(e) => handleUpdateAll('delete', e.target.checked)}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedPermissions.map(id => (
                                    <FormControlLabel
                                        key={`delete-${id}`}
                                        control={
                                            <Switch
                                                size="small"
                                                checked={permissionUpdates[id]?.delete || false}
                                                onChange={() => handlePermissionChange(id, 'delete')}
                                            />
                                        }
                                        label={
                                            <Typography variant="caption">
                                                {permissions.find(p => p._id === id)?.pageId?.[0]?.name || 'Unknown'}
                                            </Typography>
                                        }
                                    />
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                    {loading ? 'Updating...' : 'Update Permissions'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateMultiplePermissionsDialog;