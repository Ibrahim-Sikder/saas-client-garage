import { baseApi } from "./baseApi";

const stockTransferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStockTransfer: builder.mutation({
      query: ({transferData, tenantDomain}) => ({
        url: "/stock-transfer",
        method: "POST",
        body: transferData,
        params: {tenantDomain}
      }),
      invalidatesTags: ["stockTransfers"],
    }),

    getAllStockTransfers: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm } = {}) => ({
        url: "/stock-transfer",
        method: "GET",
        params: {tenantDomain,  limit, page, searchTerm },
      }),
      providesTags: ["stockTransfers"],
    }),
    getSingleStockTransfer: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/stock-transfer/${id}`,
        method: "GET",
          params: { tenantDomain },
      }),
      providesTags: ["stockTransfers"],
    }),
    deleteStockTransfer: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/stock-transfer/${id}`,
        method: "DELETE",
          params: { tenantDomain },
      }),
      invalidatesTags: ["stockTransfers"],
    }),
  }),
});

export const {
  useCreateStockTransferMutation,
  useGetAllStockTransfersQuery,
  useGetSingleStockTransferQuery,
  useDeleteStockTransferMutation,
} = stockTransferApi;
