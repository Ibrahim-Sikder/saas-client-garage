/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Avatar,
    IconButton,
    Tooltip,
    useTheme
} from '@mui/material';
import {
    Lock,
    Garage,
    HelpOutline,
    Info,
    ContactSupport,
    ArrowBack,
    Refresh
} from '@mui/icons-material';

const AccessDenied = ({ pagePath }) => {
    const theme = useTheme();
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    py: 4,
                    backgroundColor: theme.palette.background.default
                }}
            >
                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        textAlign: 'center',
                        width: '100%',
                        border: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: theme.palette.error.main,
                            width: 64,
                            height: 64,
                            mx: 'auto',
                            mb: 3
                        }}
                    >
                        <Lock fontSize="large" />
                    </Avatar>

                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        fontWeight={600}
                        color="text.primary"
                    >
                        Access Denied
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                        sx={{ mb: 3 }}
                    >
                        You don't have permission to view this page.
                    </Typography>

                    <Box
                        sx={{
                            p: 2,
                            mb: 3,
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: 1,
                            textAlign: 'left'
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Required permission: <strong>view</strong> for <strong>{pagePath}</strong>
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<ArrowBack />}
                            onClick={() => window.history.back()}
                            sx={{ minWidth: 120 }}
                        >
                            Go Back
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Garage />}
                            onClick={() => window.location.href = '/dashboard'}
                            sx={{ minWidth: 120 }}
                        >
                            Dashboard
                        </Button>
                        <Tooltip title="Refresh page">
                            <IconButton
                                onClick={() => window.location.reload()}
                                sx={{ ml: 1 }}
                            >
                                <Refresh />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <Button
                        size="small"
                        startIcon={showDetails ? <Info /> : <HelpOutline />}
                        onClick={() => setShowDetails(!showDetails)}
                        sx={{ textTransform: 'none', color: theme.palette.text.secondary }}
                    >
                        {showDetails ? 'Hide' : 'Show'} Details
                    </Button>

                    {showDetails && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                backgroundColor: theme.palette.grey[50],
                                borderRadius: 1,
                                textAlign: 'left',
                                border: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Access to this page is restricted based on your user role and permissions.
                                If you need access to this feature, please contact your system administrator.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Page Path:</strong> {pagePath}<br />
                                <strong>Required Action:</strong> view<br />
                                <strong>User Role:</strong> Your current role doesn't have this permission
                            </Typography>
                        </Box>
                    )}
                </Paper>

                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1
                    }}
                >
                    <ContactSupport color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                        If you believe this is an error, please contact your system administrator.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default AccessDenied;