import { baseApi } from "./baseApi";

const quotationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuotation: builder.mutation({
      query: (quotationInfo) => ({
        url: "/quotations",
        method: "POST",
        body: quotationInfo,
      }),
      invalidatesTags: ["quotation"],
    }),
    getAllQuotations: builder.query({
      query: ({
        tenantDomain,
        id,
        limit,
        page,
        searchTerm,
        isRecycled,
        status,
      }) => ({
        url: `/quotations`,
        method: "GET",
        params: {
          tenantDomain,
          id,
          limit,
          page,
          searchTerm,
          isRecycled,
          status,
        },
      }),
      providesTags: ["quotation"],
    }),
    getAllQuotationsForDashboard: builder.query({
      query: () => ({
        url: `quotations/quotation/dashboard`,
        method: "GET",
      }),
      providesTags: ["quotation"],
    }),

    getSingleQuotation: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/quotations/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["quotation"],
    }),

    updateQuotation: builder.mutation({
      query: (quotationInfo) => {
        return {
          url: `/quotations/${quotationInfo.id}`,
          method: "PUT",
          body: quotationInfo.data,
        };
      },
      invalidatesTags: ["quotation"],
    }),
updateQuotationStatus: builder.mutation({
  query: ({ id, tenantDomain, status }) => ({
    url: `/quotations/${id}/status`,
    method: "PUT",
    body: { status },
    headers: {
      'tenantDomain': tenantDomain,
    },
  }),
  invalidatesTags: ["quotation"],
}),
    removeQuotation: builder.mutation({
      query: ({ tenantDomain, quotationInfo }) => {
        return {
          url: `/quotations/remove-quotation`,
          method: "PATCH",
          body: quotationInfo?.data,
          params: { id: quotationInfo.id, tenantDomain },
        };
      },
      invalidatesTags: ["quotation"],
    }),

    deleteQuotation: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/quotations/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["quotation"],
    }),
    permanantlyDeleteQuotation: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/quotations/delete-permanantly/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["quotation"],
    }),
    moveRecycledQuotation: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/quotations/recycle/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["quotation"],
    }),
    restoreFromRecycledQuotation: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/quotations/restore/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["quotation"],
    }),
    cancelQuotation: builder.mutation({
      query: ({ id, tenantDomain }) => ({
        url: `quotations/${id}/cancel`,
        method: "PUT",
        params: { tenantDomain },
      }),
      invalidatesTags: ["Quotations"],
    }),
  }),
});

export const {
  useCreateQuotationMutation,
  useGetAllQuotationsQuery,
  useGetAllQuotationsForDashboardQuery,
  useGetSingleQuotationQuery,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useRemoveQuotationMutation,
  useMoveRecycledQuotationMutation,
  useRestoreFromRecycledQuotationMutation,
  usePermanantlyDeleteQuotationMutation,
  useCancelQuotationMutation,
  useUpdateQuotationStatusMutation
} = quotationApi;
