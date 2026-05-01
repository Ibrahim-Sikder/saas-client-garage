import { baseApi } from "./baseApi";

const stockTransactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStockTransactions: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/stock-transaction",
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["stock-transactions"],
    }),

    getSingleStockTransaction: builder.query({
      query: (id) => ({
        url: `/stock-transaction/${id}`,
        method: "GET",
      }),
      providesTags: ["stock-transactions"],
    }),

    createStockTransaction: builder.mutation({
      query: (data) => ({
        url: "/stock-transaction",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["stock-transactions"],
    }),

    stockTransactionTransfer: builder.mutation({
      query: (data) => ({
        url: "/stock-transactions/transfer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["stock-transactions"],
    }),

    updateStockTransaction: builder.mutation({
      query: ({ id, data }) => ({
        url: `/stock-transaction/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["stock-transactions"],
    }),

    deleteStockTransaction: builder.mutation({
      query: (id) => ({
        url: `/stock-transaction/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["stock-transactions"],
    }),
    
  }),
});

export const {
  useGetAllStockTransactionsQuery,
  useGetSingleStockTransactionQuery,
  useCreateStockTransactionMutation,
  useStockTransactionTransferMutation,
  useUpdateStockTransactionMutation,
  useDeleteStockTransactionMutation,
} = stockTransactionApi;
