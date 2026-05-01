/* eslint-disable react/prop-types */
import {
  Collapse,
  Alert,
  AlertTitle,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ExpiredAlert({
  alertOpen,
  setAlertOpen,
  totalExpired,
  totalExpiringSoon,
}) {
  const theme = useTheme();

  return (
    <Collapse in={alertOpen}>
      <Alert
        severity="warning"
        variant="filled"
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={() => setAlertOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{
          mb: 3,
          borderRadius: 2,
          boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.2)}`,
        }}
      >
        <AlertTitle>Warning</AlertTitle>
        There are {totalExpired} expired and {totalExpiringSoon} soon-to-expire
        products in your inventory. Please dispose of them promptly.
      </Alert>
    </Collapse>
  );
}
