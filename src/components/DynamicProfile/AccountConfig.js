import { formatDate } from "../../utils/formateDate";

export const ACCOUNT_CONFIG = {
    customer: {
        contactInfo: {
            title: "Customer Info",
            fields: [
                { label: "Customer Name", key: "customer_name" },
                { label: "Customer Phone", key: "customer_contact", prefix: "0" },
                { label: "Driver Name", key: "driver_name" },
                { label: "Driver Phone", key: "driver_contact", prefix: "0" },
                { label: "Company Name", key: "company_name" },
                { label: "Address", key: "company_address" },
                { label: "Reference Name", key: "reference_name" },
                { label: "Date", key: "createdAt", formatter: formatDate }
            ]
        },
        moneyReceiptKey: "money_receipts"
    },
    showroom: {
        contactInfo: {
            title: "Show Room Info",
            fields: [
                { label: "Show Room Name", key: "showRoom_name" },
                { label: "Company Phone", key: "company_contact", prefix: "0" },
                { label: "Driver Name", key: "driver_name" },
                { label: "Driver Phone", key: "driver_contact", prefix: "0" },
                { label: "Address", key: "showRoom_address" },
                { label: "Reference Name", key: "reference_name" },
                { label: "Date", key: "createdAt", formatter: formatDate }
            ]
        },
        moneyReceiptKey: "moneyReceipts"
    },
    company: {
        contactInfo: {
            title: "Company Info",
            fields: [
                { label: "Company Name", key: "company_name" },
                { label: "Company Phone", key: "company_contact", prefix: "0" },
                { label: "Driver Name", key: "driver_name" },
                { label: "Driver Phone", key: "driver_contact", prefix: "0" },
                { label: "Address", key: "company_address" },
                { label: "Reference Name", key: "reference_name" },
                { label: "Date", key: "createdAt", formatter: formatDate }
            ]
        },
        moneyReceiptKey: "moneyReceipts"
    }
};