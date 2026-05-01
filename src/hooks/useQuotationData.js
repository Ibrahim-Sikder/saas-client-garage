import { useEffect, useState } from "react";
import { useGetCompanyProfileQuery } from "../redux/api/companyProfile";
import {
  useCreateQuotationMutation,
  useGetSingleQuotationQuery,
  useRemoveQuotationMutation,
  useUpdateQuotationMutation,
} from "../redux/api/quotation";
import { useGetSingleJobCardWithJobNoQuery } from "../redux/api/jobCard";
import { useGetAllStocksQuery } from "../redux/api/stocksApi";

export const useQuotationData = (tenantDomain, id, orderNumber, isEditMode) => {
  const [specificQuotation, setSpecificQuotation] = useState({});
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);
  const queryParams = {
    tenantDomain,
    page: 1,
    searchTerm: "",
    isRecycled: false,
  };

  const { data: stockData } = useGetAllStocksQuery(queryParams);
  const { data: CompanyInfoData } = useGetCompanyProfileQuery({
    tenantDomain,
  });

  const [createQuotation, { isLoading: createLoading }] =
    useCreateQuotationMutation();
  const [updateQuotation, { isLoading: updateLoading }] =
    useUpdateQuotationMutation();
  const [removeQuotation, { isLoading: removeLoading }] =
    useRemoveQuotationMutation();

  const { data: jobCardData, refetch } = useGetSingleJobCardWithJobNoQuery({
    tenantDomain,
    jobNo: orderNumber,
  });

  const {
    data: quotationData,
    isLoading: quotationLoading,
    error: quotationError,
    refetch: refetchQuotation,
  } = useGetSingleQuotationQuery(
    {
      tenantDomain,
      id,
    },
    {
      skip: !id || !tenantDomain || !isEditMode,
    }
  );

  // Initialize form data when quotation data is loaded in edit mode
  useEffect(() => {
    if (isEditMode && quotationData && typeof quotationData === "object") {
      const data = quotationData.data || quotationData;
      if (data && typeof data === "object") {
        setSpecificQuotation(data);
      }
    }
  }, [isEditMode, quotationData]);

  return {
    stockData,
    CompanyInfoData,
    jobCardData,
    specificQuotation,
    setSpecificQuotation,
    quotationLoading,
    quotationError,
    error,
    setError,
    reload,
    setReload,

    createQuotation,
    updateQuotation,
    removeQuotation,
    refetch,
    refetchQuotation,
    createLoading,
    updateLoading,
    removeLoading,
  };
};
