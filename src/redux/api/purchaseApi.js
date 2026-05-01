import { baseApi } from "./baseApi";

const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPurchase: builder.mutation({
      query: (data) => ({
        url: "/purchases",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["purchase"],
    }),
    getAllPurchases: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/purchases`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["purchase"],
    }),

    getSinglePurchase: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/purchases/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["purchase"],
    }),

    updatePurchase: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/purchases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["purchase"],
    }),

    removePurchase: builder.mutation({
      query: (purchasesInfo) => {
        return {
          url: `/purchases/remove-purchase`,
          method: "PATCH",
          body: purchasesInfo.data,
          params: { id: purchasesInfo.id },
        };
      },
      invalidatesTags: ["purchase"],
    }),
    deletePurchase: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/purchases/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["purchase"],
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useGetAllPurchasesQuery,
  useGetSinglePurchaseQuery,
  useUpdatePurchaseMutation,
  useRemovePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
