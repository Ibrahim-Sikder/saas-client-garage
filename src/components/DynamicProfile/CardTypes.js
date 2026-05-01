
export const CARD_TYPES = {
    vehicle: {
        title: "Recent Vehicle",
        dataKey: "vehicles",
        fields: [
            { label: "Vehicle name", key: "vehicle_name" },
            { label: "Car Reg no", key: "fullRegNum" }
        ],
        viewAction: "vehicleDetails"
    },
    jobCard: {
        title: "Recent Job Card",
        dataKey: "jobCards",
        fields: [
            { label: "Vehicle Name", key: "vehicle_name" },
            { label: "Job No", key: "job_no" }
        ],
        createLink: "/dashboard/create-job-card",
        viewLink: "/dashboard/preview",
        editIcon: true
    },
    quotation: {
        title: "Recent Quotation",
        dataKey: "quotations",
        fields: [
            { label: "Quotation Number", key: "job_no" },
            { label: "Vehicle Name", key: "vehicle_name" },
            { label: "Total Amount", key: "net_total", prefix: "৳" }
        ],
        createLink: "/dashboard/create-quotation",
        viewLink: "/dashboard/quotation-view",
        editIcon: true
    },
    invoice: {
        title: "Recent Invoice",
        dataKey: "invoices",
        fields: [
            { label: "Invoice No", key: "job_no" },
            { label: "Vehicle Name", key: "vehicle_name" },
            { label: "Total Amount", key: "net_total", prefix: "৳" }
        ],
        createLink: "/dashboard/create-invoice",
        viewLink: "/dashboard/detail",
        editIcon: true
    },
    moneyReceipt: {
        title: "Recent Money Receipt",
        dataKey: null,
        fields: [
            { label: "Against bill no", key: "against_bill_no" },
            { label: "Remaining", key: "remaining", prefix: "৳" },
            { label: "Total Amount", key: "total_amount", prefix: "৳" }
        ],
        createLink: "/dashboard/money-receive-create",
        viewLink: "/dashboard/money-receipt-view",
        editIcon: true
    }
};