/* eslint-disable react/prop-types */
import {
    TableCell,
    TableRow,
    Avatar,
    Chip,
    Typography,
    Box,
    Tooltip,
    IconButton,
    Checkbox,
    useTheme,
    alpha
} from "@mui/material";
import { Edit, Delete, LibraryBooks, Person } from "@mui/icons-material";

const PermissionRow = ({
    permission,
    getRoleColor,
    handleDialogOpen,
    handleDeletePermission,
    isSelected,
    handleSelectPermission
}) => {
    const theme = useTheme();

    // Helper function to extract data from arrays
    const getFirstItem = (arr) => {
        return Array.isArray(arr) && arr.length > 0 ? arr[0] : {};
    };

    const page = getFirstItem(permission.pageId);
    const role = getFirstItem(permission.roleId);
    const user = getFirstItem(permission.userId);

    return (
        <TableRow
            key={permission._id}
            hover
            selected={isSelected}
            sx={{
                '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                },
                '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
            }}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={isSelected}
                    onChange={() => handleSelectPermission(permission._id)}
                />
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Box display="flex" alignItems="center">
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            mr: 1.5,
                            bgcolor: alpha(theme.palette.secondary.main, 0.15),
                            color: theme.palette.secondary.main,
                            boxShadow: `0 2px 8px ${alpha(theme.palette.secondary.main, 0.2)}`,
                        }}
                    >
                        <Person />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={500}>
                            {user.name || user.email || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user.email || 'N/A'}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Chip
                    label={role.name || 'N/A'}
                    size="small"
                    color={getRoleColor(role.name)}
                    sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        px: 1,
                    }}
                />
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Box display="flex" alignItems="center">
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            mr: 1.5,
                            bgcolor: alpha(theme.palette.info.main, 0.15),
                            color: theme.palette.info.main,
                            boxShadow: `0 2px 8px ${alpha(theme.palette.info.main, 0.2)}`,
                        }}
                    >
                        <LibraryBooks />
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={500}>
                            {page.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {page.path || 'N/A'}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Chip
                    label={page.category || 'N/A'}
                    size="small"
                    variant="outlined"
                    color="primary"
                />
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Checkbox
                    checked={permission.create || false}
                    color="success"
                    size="small"
                    disabled
                    sx={{
                        '&.Mui-disabled': {
                            opacity: 0.7,
                        },
                        '&.Mui-checked': {
                            color: theme.palette.success.main,
                        },
                    }}
                />
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Checkbox
                    checked={permission.edit || false}
                    color="warning"
                    size="small"
                    disabled
                    sx={{
                        '&.Mui-disabled': {
                            opacity: 0.7,
                        },
                        '&.Mui-checked': {
                            color: theme.palette.warning.main,
                        },
                    }}
                />
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Checkbox
                    checked={permission.view || false}
                    color="info"
                    size="small"
                    disabled
                    sx={{
                        '&.Mui-disabled': {
                            opacity: 0.7,
                        },
                        '&.Mui-checked': {
                            color: theme.palette.info.main,
                        },
                    }}
                />
            </TableCell>
            <TableCell sx={{ py: 2 }}>
                <Checkbox
                    checked={permission.delete || false}
                    color="error"
                    size="small"
                    disabled
                    sx={{
                        '&.Mui-disabled': {
                            opacity: 0.7,
                        },
                        '&.Mui-checked': {
                            color: theme.palette.error.main,
                        },
                    }}
                />
            </TableCell>
            <TableCell align="right" sx={{ py: 2 }}>
                <Tooltip title="Edit Permission">
                    <IconButton
                        size="small"
                        onClick={() => handleDialogOpen(permission._id)}
                        sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            }
                        }}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Permission">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeletePermission(permission._id)}
                        sx={{
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                            }
                        }}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default PermissionRow;