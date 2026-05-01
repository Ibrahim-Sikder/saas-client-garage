import { baseApi } from "./baseApi";

const invoiceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (invoiceInfo) => ({
        url: "/invoices",
        method: "POST",
        body: invoiceInfo,
      }),
      invalidatesTags: ["invoice"],
    }),
    getAllInvoices: builder.query({
      query: ({ tenantDomain,id, limit, page, searchTerm, isRecycled }) => ({
        url: `/invoices`,
        method: "GET",
        params: {tenantDomain, id, limit, page, searchTerm, isRecycled },
      }),
      providesTags: ["invoice"],
    }),

    getSingleInvoice: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/invoices/${id}`,
        method: "GET",
         params: { tenantDomain },
      }),
      providesTags: ["invoice"],
    }),

    updateInvoice: builder.mutation({
      query: (invoiceInfo) => {
        return {
          url: `/invoices/${invoiceInfo.id}`,
          method: "PUT",
          body: invoiceInfo.data,
        };
      },
      invalidatesTags: ["invoice"],
    }),
    removeInvoice: builder.mutation({
      query: ({tenantDomain, invoiceInfo}) => {
        return {
          url: `/invoices/remove-invoice`,
          method: "PATCH",
          body: invoiceInfo.data,
          params: { id: invoiceInfo.id, tenantDomain },
        };
      },
      invalidatesTags: ["invoice"],
    }),

    deleteInvoice: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
         params: { tenantDomain },
      }),
      invalidatesTags: ["invoice"],
    }),
    permanantlyDeleteInvoice: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/invoices/delete-permanantly/${id}`,
        method: "DELETE",
         params: { tenantDomain },
      }),
      invalidatesTags: ["invoice"],
    }),
    moveRecycledInvoice: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/invoices/recycle/${id}`,
        method: "PATCH",
         params: { tenantDomain },
      }),
      invalidatesTags: ["invoice"],
    }),
    restoreFromRecycledInvoice: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/invoices/restore/${id}`,
        method: "PATCH",
         params: { tenantDomain },
      }),
      invalidatesTags: ["invoice"],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetAllInvoicesQuery,
  useGetSingleInvoiceQuery,
  useUpdateInvoiceMutation,
  useRemoveInvoiceMutation,
  useDeleteInvoiceMutation,
  useRestoreFromRecycledInvoiceMutation,
  useMoveRecycledInvoiceMutation,
  usePermanantlyDeleteInvoiceMutation,
} = invoiceApi;

