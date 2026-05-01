/* eslint-disable react/prop-types */
"use client"

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  IconButton,
  Fade,
  Slide,
  Paper,
  Stack,
} from "@mui/material"
import {
  History,
  CalendarToday,
  Payment,
  AccountBalanceWallet,
  CreditCard,
  MonetizationOn,
  Close,
  Receipt,
  TrendingUp,
  AccessTime,
} from "@mui/icons-material"
import { format } from "date-fns"



const PaymentHistoryModal = ({
  open,
  onClose,
  paymentHistory = [],
  employeeName = "Employee",
  employeeId = "",
  month = "",
  year = "",
}) => {
  const theme = useTheme()

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case "cash":
        return <MonetizationOn />
      case "card":
      case "credit_card":
        return <CreditCard />
      case "bank":
      case "transfer":
        return <AccountBalanceWallet />
      default:
        return <Payment />
    }
  }

  const getPaymentMethodColor = (method) => {
    switch (method.toLowerCase()) {
      case "cash":
        return "success"
      case "card":
      case "credit_card":
        return "primary"
      case "bank":
      case "transfer":
        return "info"
      default:
        return "default"
    }
  }

  const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch {
      return "Invalid Date"
    }
  }

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), "hh:mm a")
    } catch {
      return ""
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}08 100%)`,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: "white",
          p: 3,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              width: 56,
              height: 56,
            }}
          >
            <History fontSize="large" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
              Payment History
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {employeeName} • ID: {employeeId} • {month} {year}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Summary Card */}
        <Paper
          elevation={0}
          sx={{
            m: 3,
            mb: 2,
            p: 3,
            background: `linear-gradient(135deg, ${theme.palette.success.light}15, ${theme.palette.success.main}08)`,
            border: `1px solid ${theme.palette.success.light}30`,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: theme.palette.success.main, width: 48, height: 48 }}>
              <TrendingUp />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                Total Payments Made
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paymentHistory.length} transaction{paymentHistory.length !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h4" fontWeight="bold" color="success.main">
            ৳{totalPaid.toLocaleString()}
          </Typography>
        </Paper>

        {/* Payment History List */}
        <Box sx={{ px: 3, pb: 2 }}>
          {paymentHistory.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: theme.palette.grey[50],
                borderRadius: 2,
              }}
            >
              <Receipt sx={{ fontSize: 64, color: theme.palette.grey[400], mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Payment History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No payments have been recorded for this salary period.
              </Typography>
            </Paper>
          ) : (
            <List sx={{ p: 0 }}>
              {paymentHistory.map((payment, index) => (
                <Fade in={open} timeout={300 + index * 100} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <ListItem
                        sx={{
                          p: 3,
                          background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}05 100%)`,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: `${getPaymentMethodColor(payment.payment_method)}.main`,
                              width: 56,
                              height: 56,
                            }}
                          >
                            {getPaymentMethodIcon(payment.payment_method)}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          sx={{ ml: 2 }}
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                              <Typography variant="h6" fontWeight="bold">
                                ৳{payment.amount.toLocaleString()}
                              </Typography>
                              <Chip
                                label={payment.payment_method.toUpperCase()}
                                color={getPaymentMethodColor(payment.payment_method)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Stack spacing={1}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CalendarToday fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(payment.date)}
                                </Typography>
                                <AccessTime fontSize="small" color="action" sx={{ ml: 2 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatTime(payment.date)}
                                </Typography>
                              </Box>
                              {payment.note && (
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontStyle: "italic",
                                    color: theme.palette.text.secondary,
                                    bgcolor: theme.palette.grey[100],
                                    p: 1,
                                    borderRadius: 1,
                                    mt: 1,
                                  }}
                                >
                                  {payment.note}
                                </Typography>
                              )}
                            </Stack>
                          }
                        />

                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="caption"
                            sx={{
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.main,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontWeight: "bold",
                            }}
                          >
                            Payment #{index + 1}
                          </Typography>
                        </Box>
                      </ListItem>
                    </CardContent>
                  </Card>
                </Fade>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: theme.palette.grey[50],
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            borderRadius: 2,
            px: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PaymentHistoryModal
