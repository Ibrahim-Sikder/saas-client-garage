/* eslint-disable react/prop-types */
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    InputAdornment,
    useTheme,
    alpha
} from "@mui/material";
import { FilterList, Person, Search } from "@mui/icons-material";

const PermissionFilters = ({
    selectedRole,
    selectedUser,
    searchTerm,
    roles,
    users,
    total,
    onRoleFilterChange,
    onUserFilterChange,
    onSearchChange
}) => {
    const theme = useTheme();

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05)
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="role-filter-label">Filter by Role</InputLabel>
                    <Select
                        labelId="role-filter-label"
                        id="role-filter"
                        value={selectedRole}
                        onChange={onRoleFilterChange}
                        label="Filter by Role"
                        startAdornment={
                            <InputAdornment position="start">
                                <FilterList fontSize="small" />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="">
                            <em>All Roles</em>
                        </MenuItem>
                        {roles.map((role) => (
                            <MenuItem key={role} value={role}>{role}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="user-filter-label">Filter by User</InputLabel>
                    <Select
                        labelId="user-filter-label"
                        id="user-filter"
                        value={selectedUser}
                        onChange={onUserFilterChange}
                        label="Filter by User"
                        startAdornment={
                            <InputAdornment position="start">
                                <Person fontSize="small" />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="">
                            <em>All Users</em>
                        </MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user} value={user}>{user}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    size="small"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={onSearchChange}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 250 }}
                />
            </Box>

            <Typography variant="body2" color="text.secondary">
                {total} permissions found
            </Typography>
        </Box>
    );
};

export default PermissionFilters;