// constants/purchaseOrderConstants.js

export const PURCHASE_STATUS_OPTIONS = [
    "Pending",
    "Approved",
    "Cancelled",
    "Shipped",
    "Received",
];

export const PAYMENT_STATUS_OPTIONS = ["Unpaid", "Partial", "Paid"];

export const FORM_FIELD_LABELS = {
    orderDate: "Order Date",
    expectedDeliveryDate: "Expected Delivery Date",
    referenceNo: "Reference No",
    warehouse: "Select Warehouse",
    suppliers: "Select Supplier",
    status: "Purchase Status",
    paymentMethod: "Payment Method",
    paymentStatus: "Payment Status",
    note: "Notes & Details",
    attachDocument: "Attach Document",
};

export const TOAST_MESSAGES = {
    productAdded: "Product added",
    productRemoved: "Product removed",
    quantityUpdated: "Product quantity updated",
    noProducts: "Please add at least one product",
    createSuccess: "Purchase order created successfully!",
    updateSuccess: "Purchase updated successfully!",
    createError: "Failed to create purchase",
    updateError: "Failed to update purchase",
};