/* eslint-disable react/prop-types */
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  AccountBalanceWallet as WalletIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const SummaryCards = ({ supplier }) => {
  const theme = useTheme();

  const totalDue = supplier?.purchasesSummary?.dueAmount || 0;
  const totalPaid = supplier?.purchasesSummary?.paidAmount || 0;
  const totalBalance = supplier?.purchasesSummary?.totalAmount || 0;
  const pendingSuppliers = supplier?.balance > 0 ? 1 : 0;

  const cards = [
    {
      title: "Total Due",
      value: `৳${totalDue.toLocaleString()}`,
      icon: "৳",
      color: theme.palette.primary.main,
    },
    {
      title: "Total Paid",
      value: `৳${totalPaid.toLocaleString()}`,
      icon: <PaymentIcon />,
      color: theme.palette.success.main,
    },
    {
      title: "Outstanding Balance",
      value: `৳${totalBalance.toLocaleString()}`,
      icon: <WalletIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: "Pending Suppliers",
      value: pendingSuppliers,
      icon: <TrendingIcon />,
      color: theme.palette.info.main,
    },
  ];

  return (
    <>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 2,
              background: `linear-gradient(45deg, ${card.color}, ${card.color}30)`,
              color: "white",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {card.value}
              </Typography>
              <Typography variant="body2">{card.title}</Typography>
            </Box>
            <Box
              sx={{
                p: 1,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {card.icon}
            </Box>
          </Paper>
        </Grid>
      ))}
    </>
  );
};

export default SummaryCards;
