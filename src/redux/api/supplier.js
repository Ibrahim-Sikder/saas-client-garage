import { baseApi } from "./baseApi";

const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSupplier: builder.mutation({
      query: (supplierInfo) => ({
        url: "/suppliers",
        method: "POST",
        body: supplierInfo,
      }),
      invalidatesTags: ["supplier"],
    }),
    recordPayment: builder.mutation({
      query: ({ data, tenantDomain }) => ({
        url: "/suppliers/payments",
        method: "POST",
        body: data,
        params: { tenantDomain, }
      }),
      invalidatesTags: ["supplier"],
    }),
    getAllSuppliers: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm, isRecycled }) => ({
        url: `/suppliers`,
        method: "GET",
        params: { limit, page, searchTerm, isRecycled, tenantDomain },

      }),
      providesTags: ["supplier"],
    }),


    getSingleSupplier: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/suppliers/${id}`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["supplier"],
    }),
    getSupplierWithBillPay: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/suppliers/${id}/profile`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["supplier"],
    }),
    updateSupplier: builder.mutation({
      query: ({ id, data }) => ({
        url: `/suppliers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["supplier"],
    }),

    deleteSupplier: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["supplier"],
    }),
    permenantlyDeleteSupplier: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/suppliers/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["supplier"],
    }),
    moveRecycledSupplier: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/suppliers/recycle/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["supplier"],
    }),
    restoreFromRecycledSupplier: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/suppliers/restore/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["supplier"],
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useGetAllSuppliersQuery,
  useGetSingleSupplierQuery,
  useUpdateSupplierMutation,
  useRestoreFromRecycledSupplierMutation,
  useMoveRecycledSupplierMutation,
  usePermenantlyDeleteSupplierMutation,
  useGetSupplierWithBillPayQuery,
  useRecordPaymentMutation
} = supplierApi;
