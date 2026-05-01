export const calculateFinancialMetrics = (invoices = [], profileType) => {
    const filteredInvoices = profileType === 'customer'
        ? invoices.filter(invoice => !invoice?.isRecycled)
        : invoices.filter(invoice => invoice?.isRecycled === false);

    return {
        totalAmount: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.net_total || 0), 0),
        discount: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.discount || 0), 0),
        totalDue: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.due || 0), 0),
        totalAdvance: filteredInvoices.reduce((sum, receipt) => sum + (receipt?.advance || 0), 0)
    };
};