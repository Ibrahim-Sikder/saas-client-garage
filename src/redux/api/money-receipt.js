import { baseApi } from "./baseApi";

const moneyReceiptApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMoneyReceipt: builder.mutation({
      query: (moneyReceiptInfo) => ({
        url: "/money-receipts",
        method: "POST",
        body: moneyReceiptInfo,
      }),
      invalidatesTags: ["moneyReceipt"],
    }),
    getAllMoneyReceipts: builder.query({
      query: ({
        tenantDomain,
        id,
        limit,
        page,
        searchTerm,
        isRecycled,
        dueMoney,
      }) => ({
        url: `/money-receipts`,
        method: "GET",
        params: {
          tenantDomain,
          id,
          limit,
          page,
          searchTerm,
          isRecycled,
          dueMoney,
        },
      }),

      providesTags: ["moneyReceipt"],
    }),
    dueAllMoneyReceipts: builder.query({
      query: ({ tenantDomain, id, limit, page, searchTerm, isRecycled }) => ({
        url: `/money-receipts/duemoney-receipts`,
        method: "GET",
        params: { tenantDomain, id, limit, page, searchTerm, isRecycled },
      }),

      providesTags: ["moneyReceipt"],
    }),

    getSingleMoneyReceipt: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/money-receipts/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["moneyReceipt"],
    }),
   updateMoneyReceipt: builder.mutation({
  query: ({ tenantDomain, id, data }) => ({
    url: `/money-receipts/${id}`,
    method: "PUT",
    params: { tenantDomain },
    body: data,
  }),
  invalidatesTags: ["moneyReceipt"],
}),


    deleteMoneyReceipt: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/money-receipts/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["moneyReceipt"],
    }),
    permanantlyDeleteMoneyReceipt: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/money-receipts/delete-permanantly/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["moneyReceipt"],
    }),
    moveRecycledMoneyReceipt: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/money-receipts/recycle/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["moneyReceipt"],
    }),
    restoreFromRecycledMoneyReceipt: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/money-receipts/restore/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["moneyReceipt"],
    }),
  }),
});

export const {
  useCreateMoneyReceiptMutation,
  useGetAllMoneyReceiptsQuery,
  useGetSingleMoneyReceiptQuery,
  useUpdateMoneyReceiptMutation,
  useDeleteMoneyReceiptMutation,
  useMoveRecycledMoneyReceiptMutation,
  useRestoreFromRecycledMoneyReceiptMutation,
  usePermanantlyDeleteMoneyReceiptMutation,
  useDueAllMoneyReceiptsQuery,
} = moneyReceiptApi;
