/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Restore as RestoreIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const ManageRestore = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState("");

  // Mock backup list - in a real application, this would be fetched from an API
  const backupList = [
    "Backup_2023-05-01_12:00:00",
    "Backup_2023-05-02_12:00:00",
    "Backup_2023-05-03_12:00:00",
  ];

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setRestoreProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 10, 100);
          if (newProgress === 100) {
            setIsLoading(false);
            setShowProgressDialog(false);
            setShowSuccess(true);
            setLogs([
              "Database restored successfully from " +
                selectedBackup +
                " at " +
                new Date().toLocaleString(),
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
  }, [isLoading, selectedBackup]);

  const handleRestore = () => {
    if (selectedBackup) {
      setOpenConfirmDialog(true);
    }
  };

  const handleConfirmRestore = async () => {
    setOpenConfirmDialog(false);
    setShowProgressDialog(true);
    setIsLoading(true);
    setRestoreProgress(0);

    // Call the restore API
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ backupName: selectedBackup }),
      });

      const data = await response.json();
      if (response.ok) {
        // setShowSuccess(true);
        toast.success("Datebase restore successfully!");
        setLogs([
          `Database restore started for ${selectedBackup} at ${new Date().toLocaleString()}`,
        ]);
      } else {
        throw new Error(data.message || "Restore failed");
      }
    } catch (error) {
      setLogs([`Error: ${error.message}`]);
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
    <Container maxWidth="full" sx={{ mt: 4 }}>
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
          <RestoreIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Manage Restore
        </Typography>
      </Breadcrumbs>

      {/* Main Content */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "#1a1a1a", fontWeight: 500 }}
      >
        Manage Restore
      </Typography>

      {/* Backup Selection */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="backup-select-label">Select Backup</InputLabel>
          <Select
            labelId="backup-select-label"
            id="backup-select"
            value={selectedBackup}
            label="Select Backup"
            onChange={(e) => setSelectedBackup(e.target.value)}
          >
            {backupList.map((backup) => (
              <MenuItem key={backup} value={backup}>
                {backup}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleRestore}
          disabled={isLoading || !selectedBackup}
          sx={btnStyle}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              Restoring...
            </Box>
          ) : (
            "Restore Database"
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
            No restore logs found
          </Typography>
        )}
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Database Restore</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to restore the database from the backup "
            {selectedBackup}"? This process will overwrite the current database
            and cannot be interrupted once started.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)} sx={btnStyle}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRestore}
            sx={{ ...btnStyle, backgroundColor: "#0066b2" }}
            variant="contained"
          >
            Confirm Restore
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Dialog */}
      <Dialog
        open={showProgressDialog}
        aria-labelledby="restore-progress-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="restore-progress-dialog">
          Database Restore in Progress
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%", mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={restoreProgress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#0066b2",
                },
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              {`${Math.round(restoreProgress)}%`}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              Please wait while the database is being restored...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
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
          Database restored successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageRestore;
