export const formatCurrency = (value) => {
    if (value === undefined || value === null) return "৳0";
    return `৳${Number(value).toLocaleString()}`;
};
