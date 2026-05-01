import { baseApi } from "./baseApi";

const purchaseReturnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPurchaseReturn: builder.mutation({
      query: (returnInfo) => ({
        url: "/purchase-return",
        method: "POST",
        body: returnInfo,
      }),
      invalidatesTags: ["purchaseReturn"],
    }),

    getAllPurchaseReturns: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/purchase-return",
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["purchaseReturn"],
    }),
    getSinglePurchaseReturn: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/purchase-return/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["purchaseReturn"],
    }),

    updatePurchaseReturn: builder.mutation({
      query: ({ id, tenantDomain, data }) => ({
        url: `/purchase-return/${id}`,
        method: "PUT",
        body: {
          ...data,
          tenantDomain,
        },
      }),
      invalidatesTags: ["purchaseReturn"],
    }),

    removePurchaseReturn: builder.mutation({
      query: ({ id, data }) => ({
        url: `/purchase-return/remove-return`,
        method: "PATCH",
        body: data,
        params: { id },
      }),
      invalidatesTags: ["purchaseReturn"],
    }),

    deletePurchaseReturn: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/purchase-return/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["purchaseReturn"],
    }),
  }),
});

export const {
  useCreatePurchaseReturnMutation,
  useGetAllPurchaseReturnsQuery,
  useGetSinglePurchaseReturnQuery,
  useUpdatePurchaseReturnMutation,
  useRemovePurchaseReturnMutation,
  useDeletePurchaseReturnMutation,
} = purchaseReturnApi;
