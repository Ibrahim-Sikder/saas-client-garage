/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/ErrorBoundary.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          p={3}
          textAlign="center"
        >
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            We are sorry, but something unexpected happened. Our team has been notified.
          </Typography>
          {this.state.error && (
            <Typography variant="body2" color="error" sx={{ mb: 3 }}>
              Error: {this.state.error.toString()}
            </Typography>
          )}
          <Box>
            <Button 
              variant="contained" 
              onClick={this.handleReload}
              sx={{ mr: 2 }}
            >
              Reload Page
            </Button>
            <Button 
              variant="outlined" 
              onClick={this.handleGoBack}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;