/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SummaryCards = ({ totalTransactions, totalIn, totalOut, isLoading }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Total Transactions
            </Typography>
            <Typography variant="h4" fontWeight={600}>
              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                totalTransactions
              )}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            bgcolor: alpha(theme.palette.success.main, 0.1),
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Stock In
            </Typography>
            <Typography
              variant="h4"
              fontWeight={600}
              color="success.main"
            >
              {isLoading ? <CircularProgress size={24} /> : totalIn}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.1),
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Stock Out
            </Typography>
            <Typography variant="h4" fontWeight={600} color="error.main">
              {isLoading ? <CircularProgress size={24} /> : totalOut}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;