import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Breadcrumbs,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Backup as BackupIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const ManageBackup = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setBackupProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 10, 100);
          if (newProgress === 100) {
            setIsLoading(false);
            setShowProgressDialog(false);
            setShowSuccess(true);
            setLogs([
              "Backup completed successfully at " + new Date().toLocaleString(),
            ]);
            clearInterval(timer);
          }
          return newProgress;
        });
      }, 800);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isLoading]);

  const handleBackup = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmBackup = async () => {
    setOpenConfirmDialog(false);
    setShowProgressDialog(true);
    setIsLoading(true);
    setBackupProgress(0);

    try {
      // Make the API call to trigger the backup process
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/backup`);
      if (response.status === 200) {
        toast.success(
          `Backup completed successfully at ${new Date().toLocaleString()}`
        );
      }else{
        toast.error(`Failed to backup at ${new Date().toLocaleString()}`)
      }
    } catch (error) {
      console.error("Backup failed:", error);
      setIsLoading(false);
      setShowProgressDialog(false);
      setLogs([
        "Backup failed at " +
          new Date().toLocaleString() +
          " - " +
          error.message,
      ]);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const btnStyle = {
    bgcolor: "#0066b2",
    color: "#fff",
    "&:hover": {
      bgcolor: "#005291",
    },
  };

  return (
    <Container maxWidth="" sx={{ mt: 4 }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="/dashboard"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Link
          color="inherit"
          href="/logs-backup"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <StorageIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Logs & Backup
        </Link>
        <Typography
          color="primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <BackupIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Manage Backup
        </Typography>
      </Breadcrumbs>

      {/* Main Content */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "#1a1a1a", fontWeight: 500 }}
      >
        Manage Backup
      </Typography>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleBackup}
          disabled={isLoading}
          sx={btnStyle}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              Backing up...
            </Box>
          ) : (
            "Manual Backup"
          )}
        </Button>
        <Button
          variant="contained"
          onClick={handleRefresh}
          startIcon={<RefreshIcon />}
          disabled={isLoading}
          sx={btnStyle}
        >
          Refresh
        </Button>
      </Box>

      {/* Logs Display */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: "#f5f5f5",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
        }}
      >
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {log}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No logs found
          </Typography>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Backup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to perform a manual backup? This process
            cannot be interrupted once started.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmBackup}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog
        open={showProgressDialog}
        aria-labelledby="backup-progress-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="backup-progress-dialog">
          Backup in Progress
        </DialogTitle>
        <DialogContent>
          <LinearProgress variant="determinate" value={backupProgress} />
          <Typography sx={{ mt: 2 }}>
            Backup Progress: {backupProgress}%
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Backup Completed Successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageBackup;
