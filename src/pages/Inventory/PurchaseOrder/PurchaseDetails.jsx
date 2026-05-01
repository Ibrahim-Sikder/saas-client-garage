/* eslint-disable react/prop-types */
// components/PurchaseOrder/PurchaseDetails.jsx

import { motion } from "framer-motion";
import {
    CalendarMonth as CalendarMonthIcon,
    CreditCard as CreditCardIcon,
    EventNote as EventNoteIcon,
    Numbers as NumbersIcon,
    Payment as PaymentIcon,
    Person as PersonIcon,
    Receipt as ReceiptIcon,
    ShoppingCart as ShoppingCartIcon,
    Store as StoreIcon,
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    Typography,
} from "@mui/material";

import FormDatePicker from "../../../components/form/Datepicker";
import FormInput from "../../../components/form/Input";
import GarageAutoCompleted from "../../../components/form/Autocomplete";
import FormSelect from "../../../components/form/Select";
import { FORM_FIELD_LABELS, PURCHASE_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../../../constant/purchaseOrderConstant";
import { outlinedInputSx, outlinedInputWrapperSx } from "../../../utils/customStyle";

const PurchaseDetails = ({ supplierOptions, warehouseOptions }) => {
    return (
        <Card
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            elevation={0}
            sx={{
                borderRadius: "20px",
                border: "1px solid rgba(226, 232, 240, 0.8)",
                overflow: "hidden",
                background:
                    "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
                boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            }}
        >
            <Box
                sx={{
                    background:
                        "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    py: 2,
                    px: 3,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <ShoppingCartIcon sx={{ color: "white", mr: 1.5 }} />
                <Typography variant="h6" fontWeight="700" color="white">
                    Purchase Details
                </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="#64748b" sx={{ mb: 3 }}>
                    Enter the purchase information below
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormDatePicker
                            name="orderDate"
                            label={
                                <>
                                    {FORM_FIELD_LABELS.orderDate}
                                    <span style={{ color: "red", fontSize: "25px" }}>
                                        {" "}
                                        *
                                    </span>
                                </>
                            }
                            fullWidth
                            size="medium"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarMonthIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: outlinedInputSx,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormDatePicker
                            name="expectedDeliveryDate"
                            label={FORM_FIELD_LABELS.expectedDeliveryDate}
                            fullWidth
                            size="medium"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EventNoteIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: outlinedInputSx,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormInput
                            name="referenceNo"
                            label={FORM_FIELD_LABELS.referenceNo}
                            fullWidth
                            size="medium"
                            placeholder="PO-0001"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NumbersIcon color="action" />
                                    </InputAdornment>
                                ),
                                sx: outlinedInputSx,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GarageAutoCompleted
                            options={warehouseOptions}
                            size="medium"
                            fullWidth
                            name="warehouse"
                            label={
                                <>
                                    {FORM_FIELD_LABELS.warehouse}
                                    <span style={{ color: "red", fontSize: "25px" }}>
                                        {" "}
                                        *
                                    </span>
                                </>
                            }
                            sx={outlinedInputWrapperSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <StoreIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <GarageAutoCompleted
                            options={supplierOptions}
                            size="medium"
                            fullWidth
                            name="suppliers"
                            label={
                                <>
                                    {FORM_FIELD_LABELS.suppliers}
                                    <span style={{ color: "red", fontSize: "25px" }}>
                                        {" "}
                                        *
                                    </span>
                                </>
                            }
                            sx={outlinedInputWrapperSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormSelect
                            items={PURCHASE_STATUS_OPTIONS}
                            size="medium"
                            label={
                                <>
                                    {FORM_FIELD_LABELS.status}
                                    <span style={{ color: "red", fontSize: "25px" }}>
                                        {" "}
                                        *
                                    </span>
                                </>
                            }
                            fullWidth
                            name="status"
                            sx={outlinedInputWrapperSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ReceiptIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormInput
                            size="medium"
                            fullWidth
                            name="paymentMethod"
                            label={FORM_FIELD_LABELS.paymentMethod}
                            placeholder="Bank Transfer"
                            sx={outlinedInputWrapperSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PaymentIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormSelect
                            items={PAYMENT_STATUS_OPTIONS}
                            size="medium"
                            fullWidth
                            name="paymentStatus"
                            label={
                                <>
                                    {FORM_FIELD_LABELS.paymentStatus}
                                    <span style={{ color: "red", fontSize: "25px" }}>
                                        {" "}
                                        *
                                    </span>
                                </>
                            }
                            sx={outlinedInputWrapperSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CreditCardIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default PurchaseDetails;