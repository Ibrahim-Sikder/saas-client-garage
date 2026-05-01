// hooks/useFormOptions.js
import { useState, useMemo } from "react";
import { useAllCustomerQuery } from "../redux/api/meta.api";
import { useGetAllInvoicesQuery } from "../redux/api/invoice";
import { useGetAllJobCardsQuery } from "../redux/api/jobCard";
import { useTenantDomain } from "./useTenantDomain";
import { useGetAllSuppliersQuery } from "../redux/api/supplier";
import { useGetAllExpensesCategoryQuery } from "../redux/api/expense";

export const useFormOptions = (initialFilterType = "") => {
  const { tenantDomain } = useTenantDomain();
  const [filterType, setFilterType] = useState(initialFilterType);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch data
  const { data: allCustomers } = useAllCustomerQuery({ tenantDomain });
  const { data: allInvoices, isLoading: invoiceLoading } =
    useGetAllInvoicesQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });
  const { data: allJobCards, isLoading: jobCardLoading } =
    useGetAllJobCardsQuery({
      tenantDomain,
      limit,
      page: currentPage,
      searchTerm: filterType,
      isRecycled: false,
    });
  const { data: suppliers } = useGetAllSuppliersQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm: filterType,
    isRecycled: false,
  });

  const { data } = useGetAllExpensesCategoryQuery({
    tenantDomain,
    limit: 99999999999,
    page: 1,
    searchTerm: "",
  });

  const categoryOptions = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [data]);

  // Generate options
  const jobcardOption = useMemo(() => {
    if (!allJobCards?.data?.jobCards) return [];
    return allJobCards.data.jobCards.map((jobcard) => ({
      label: `${jobcard.job_no} - ${jobcard.Id}`,
      value: jobcard._id,
    }));
  }, [allJobCards?.data?.jobCards]);

  const customerOption = useMemo(() => {
    if (!allCustomers?.data?.data) return [];
    return allCustomers.data.data.map((customer) => ({
      label: `${customer.name}`,
      value: customer._id,
    }));
  }, [allCustomers?.data?.data]);

  const vehicleOptions = useMemo(() => {
    if (!allJobCards?.data?.jobCards) return [];
    return allJobCards.data.jobCards.map((jobcard) => {
      const vehicle = jobcard.vehicle && jobcard.vehicle[0];
      return {
        label: `${vehicle?.vehicle_brand} - ${vehicle?.vehicle_name} - ${vehicle?.carReg_no}`,
        value: jobcard._id,
      };
    });
  }, [allJobCards?.data?.jobCards]);

  const invoiceOption = useMemo(() => {
    if (!allInvoices?.data?.invoices) return [];
    return allInvoices.data.invoices.map((invoice) => ({
      label: `${invoice.invoice_no} - ${invoice.Id}`,
      value: invoice._id,
    }));
  }, [allInvoices?.data?.invoices]);
  const supplierOption = useMemo(() => {
    if (!suppliers?.data?.suppliers) return [];
    return suppliers.data.suppliers.map((supplier) => ({
      label: `${supplier.full_name}`,
      value: supplier._id,
    }));
  }, [suppliers?.data?.suppliers]);

  // Return all options and loading states
  return {
    // Options
    jobcardOption,
    customerOption,
    vehicleOptions,
    invoiceOption,
    categoryOptions,
    // Loading states
    invoiceLoading,
    jobCardLoading,

    // Pagination controls
    currentPage,
    setCurrentPage,

    // Filter controls
    filterType,
    setFilterType,

    // Raw data (in case you need it)
    allCustomers,
    allInvoices,
    allJobCards,
    supplierOption,
  };
};
