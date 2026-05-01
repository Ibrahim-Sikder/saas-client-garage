/* eslint-disable no-unused-vars */
"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Paper,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  CreditCard as CreditCardIcon,
  Event as EventIcon,
  Security as SecurityIcon,
  Store as StoreIcon,

  CalendarToday as CalendarTodayIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useGetSingleBillPayQuery } from "../../redux/api/bill-pay";
import logo from "../../../public/assets/logo.png";

const BillPayInvoice = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef(null);
  const theme = useTheme();
  const id = new URLSearchParams(location.search).get("id");

  const { data: singleBillpay, isLoading } = useGetSingleBillPayQuery(id);

  // Calculate total amount considering tax and discount
  function calculateTotal(singleBillpay) {
    const amount = singleBillpay?.data?.amount || 0;
    const taxAmount = singleBillpay?.data?.tax_amount || 0;
    const discountAmount = singleBillpay?.data?.discount_amount || 0;

    return amount + taxAmount - discountAmount;
  }

  //   A4 printing with perfect dimensions
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${singleBillpay?.data?.supplier}`,
    pageStyle: `
      @page {
        size: 210mm 297mm;
        margin: 0;
      }
      @media print {
        html, body {
          width: 210mm;
          height: 297mm;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setIsGenerating(true);
        resolve();
      });
    },
    onAfterPrint: () => {
      setIsGenerating(false);
    },
  });

  const downloadAsPDF = async () => {
    if (!invoiceRef.current) return;

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, // Balance between quality and performance
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      // A4 size in mm: 210 × 297
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297], // Exact A4 dimensions
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate scaling to fit exactly on one page
      const widthRatio = pdfWidth / canvas.width;
      const heightRatio = pdfHeight / canvas.height;
      const ratio = Math.min(widthRatio, heightRatio);

      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio;

      // Center on page
      const offsetX = (pdfWidth - canvasWidth) / 2;
      const offsetY = (pdfHeight - canvasHeight) / 2;

      pdf.addImage(imgData, "PNG", offsetX, offsetY, canvasWidth, canvasHeight);
      pdf.save(`Invoice-${singleBillpay?.data?.supplierId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          borderColor: theme.palette.success.main,
        };
      case "pending":
        return {
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.dark,
          borderColor: theme.palette.warning.main,
        };
      case "overdue":
        return {
          bgcolor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
          borderColor: theme.palette.error.main,
        };
      case "partial":
        return {
          bgcolor: alpha(theme.palette.info.main, 0.1),
          color: theme.palette.info.dark,
          borderColor: theme.palette.info.main,
        };
      default:
        return {
          bgcolor: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.grey[700],
          borderColor: theme.palette.grey[500],
        };
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading invoice data...</Typography>
      </Box>
    );
  }

  return (
    <>
      <div className="invoicePrintWrap">
        <div className="pb-5 px-5 invoicePrint">
          <>
            <Box
              ref={invoiceRef}
              sx={{
                p: 4,
                bgcolor: "#ffffff",
                height: "277mm",
                position: "relative",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <Box sx={{ mb: 4 }}>
                <div className=" mb-2 mx-auto text-center ">
                  <div className="flex items-center justify-between w-full mb-2">
                    <img
                      className="w-[120px] "
                      src={logo || "/placeholder.svg"}
                      alt="logo"
                    />
                    <div>
                      <h2 className="trustAutoTitle qoutationTitle">
                        Garage Master{" "}
                      </h2>
                      <small className="block">
                        Office: Ka-93/4/C, Kuril Bishawroad, Dhaka-1229
                      </small>
                    </div>
                    <div className="text-left">
                      <small className="block">
                        <small className="font-bold">Mobile:</small> +88
                        01821-216465
                      </small>
                      <small className="block">
                        <small className="font-bold">Email:</small>{" "}
                        trustautosolution@gmail.com
                      </small>
                      <small className="block font-bold ">
                        www.trustautosolution.com
                      </small>
                    </div>
                  </div>
                </div>
                <Divider
                  sx={{
                    mt: 2,
                    borderColor: theme.palette.primary.main,
                    borderWidth: 0.5,
                  }}
                />
              </Box>

              {/* Invoice Title and Basic Info */}
              <Box sx={{ mb: 3 }}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      <strong>ID:</strong>{" "}
                      {singleBillpay?.data?.supplierId || "7654345"}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: theme.palette.primary.main,
                      }}
                    >
                      Bill Payment
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: "right" }}>
                    <Typography variant="body2">
                      <strong>Date:</strong>{" "}
                      {formatDate(new Date().toISOString())}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Invoice and Customer Details */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Invoice Details */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      border: `1px solid ${alpha(
                        theme.palette.primary.main,
                        0.1
                      )}`,
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    >
                      <AssignmentIcon sx={{ mr: 1 }} />
                      Invoice Information
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Invoice Number:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          765432
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Bill Number:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.against_bill}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Invoice Date:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(singleBillpay?.data?.payment_date)}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Due Date:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {formatDate(singleBillpay?.data?.due_date)}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Category:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.category}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Status:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.payment_status?.toUpperCase()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Supplier Details */}
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.secondary.main, 0.03),
                      border: `1px solid ${alpha(
                        theme.palette.secondary.main,
                        0.1
                      )}`,
                      height: "100%",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                      }}
                    >
                      <StoreIcon sx={{ mr: 1 }} />
                      Supplier Information
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          ID:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.supplier?.supplierId}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.supplier?.full_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Company:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.shop_name}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.supplier?.state}{" "}
                          {singleBillpay?.data?.supplier?.street_address}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.supplier?.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Phone:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" fontWeight="medium">
                          {singleBillpay?.data?.supplier?.phone_number}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>

              {/* Payment Info */}
              <Box sx={{ mb: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.03),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      color: theme.palette.info.main,
                      fontWeight: 600,
                    }}
                  >
                    <CreditCardIcon />
                    Payment Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        ৳
                        <Typography variant="body2" color="text.secondary">
                          Payment Method
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ ml: 4 }}
                      >
                        {singleBillpay?.data?.payment_method}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <CalendarTodayIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Payment Date
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ ml: 4 }}
                      >
                        {formatDate(singleBillpay?.data?.payment_date)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <AssignmentIcon
                          fontSize="small"
                          sx={{ color: "text.secondary", mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Transaction ID
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ ml: 4 }}
                      >
                        {singleBillpay?.data?.transaction_id}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              {/* Totals */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    width: 320,
                    bgcolor: alpha(theme.palette.success.main, 0.03),
                    border: `1px solid ${alpha(
                      theme.palette.success.main,
                      0.1
                    )}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Subtotal:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatCurrency(singleBillpay?.data?.amount)}
                    </Typography>
                  </Box>

                  {singleBillpay?.data?.tax_amount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Tax ({singleBillpay?.data?.taxRate || 0}%):
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatCurrency(singleBillpay?.data?.tax_amount)}
                      </Typography>
                    </Box>
                  )}

                  {singleBillpay?.data?.discount_amount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Discount{" "}
                        {singleBillpay?.data?.discount_type === "percentage" &&
                        singleBillpay?.data?.discount_value
                          ? `(${singleBillpay?.data?.discount_value}%)`
                          : ""}
                        :
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="error.main"
                      >
                        -{formatCurrency(singleBillpay?.data?.discount_amount)}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {formatCurrency(calculateTotal(singleBillpay))}
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Notes & Terms */}
              {(singleBillpay?.data?.notes || singleBillpay?.data?.terms) && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {singleBillpay?.data?.notes && (
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.grey[500], 0.03),
                          border: `1px solid ${alpha(
                            theme.palette.grey[500],
                            0.1
                          )}`,
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: theme.palette.text.primary,
                          }}
                        >
                          <AssignmentIcon fontSize="small" sx={{ mr: 1 }} />
                          Notes
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {singleBillpay?.data?.notes}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}

                  {singleBillpay?.data?.terms && (
                    <Grid item xs={12} md={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.grey[500], 0.03),
                          border: `1px solid ${alpha(
                            theme.palette.grey[500],
                            0.1
                          )}`,
                          height: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: theme.palette.text.primary,
                          }}
                        >
                          <SecurityIcon fontSize="small" sx={{ mr: 1 }} />
                          Terms & Conditions
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {singleBillpay?.data?.terms}
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Footer */}
              <Box
                sx={{
                  pt: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  position: "absolute",
                  bottom: "24px",
                  left: "32px",
                  right: "32px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Thank you for your business!
                    {singleBillpay?.data?.isRecurring &&
                      singleBillpay?.data?.recurring_frequency && (
                        <Box
                          sx={{
                            mt: 0.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <EventIcon fontSize="small" />
                          This is a recurring{" "}
                          {singleBillpay?.data?.recurring_frequency?.toLowerCase()}{" "}
                          invoice
                        </Box>
                      )}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SecurityIcon color="primary" fontSize="small" />
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="primary.main"
                    >
                      Secure Transaction
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 1, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Invoice #{singleBillpay?.data?.supplierId} • Generated on{" "}
                    {formatDate(new Date().toISOString())}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        </div>
        <div className="printInvoiceBtnGroup">
          <button onClick={handlePrint} disabled={isGenerating}>
            <PrintIcon sx={{ mr: 1 }} />
          </button>

          <button onClick={downloadAsPDF} disabled={isGenerating}>
            <DownloadIcon sx={{ mr: 1 }} />
          </button>
        </div>
      </div>
    </>
  );
};

export default BillPayInvoice;
