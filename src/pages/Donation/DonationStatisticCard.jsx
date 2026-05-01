/* eslint-disable react/prop-types */
import { Typography, Box, Card, Grid, alpha, useTheme } from "@mui/material";
const DonationStatisticCard = ({ accountSummary }) => {
  const theme = useTheme();
  return (
    <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.success.main,
              0.9
            )} 0%, ${theme.palette.success.dark} 100%)`,
            color: "white",
            boxShadow: theme.shadows[8],
            textAlign: "center",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Monthly Donations
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            ৳{accountSummary?.data?.donation?.monthly?.toLocaleString() || 0}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Current Month
            </Typography>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.info.main,
              0.9
            )} 0%, ${theme.palette.info.dark} 100%)`,
            color: "white",
            boxShadow: theme.shadows[8],
            textAlign: "center",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Yearly Donations
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            ৳{accountSummary?.data?.donation?.yearly?.toLocaleString() || 0}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              This Year
            </Typography>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.warning.main,
              0.9
            )} 0%, ${theme.palette.warning.dark} 100%)`,
            color: "white",
            boxShadow: theme.shadows[8],
            textAlign: "center",
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <Typography variant="h6" gutterBottom>
            Total Donations
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            ৳{accountSummary?.data?.donation?.total?.toLocaleString() || 0}
          </Typography>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              All Time
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DonationStatisticCard;
