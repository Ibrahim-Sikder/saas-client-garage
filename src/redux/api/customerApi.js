import { baseApi } from "./baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: ({ customerInfo, tenantDomain }) => ({
        url: "/customers",
        method: "POST",
        body: customerInfo,
        params: { tenantDomain },
      }),
      invalidatesTags: ["customer"],
    }),

    getAllCustomers: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm, isRecycled }) => ({
        url: `/customers`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm, isRecycled },
      }),
      providesTags: ["customer", "vehicle", "jobCard", "quotation", "invoice"],
    }),

    getSingleCustomer: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/customers/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["customer", "vehicle", "jobCard", "quotation", "invoice"],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["customer"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customer"],
    }),
    permanentlyDeleteCustomer: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/customers/delete-permanantly/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["customer"],
    }),

    moveRecycledCustomer: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/customers/recycle/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["customer"],
    }),
    restoreFromRecycledCustomer: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/customers/restore/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["customer"],
    }),
    getAllTypeCustomers: builder.query({
      query: ({ limit, page, searchTerm }) => ({
        url: `/meta/allcustomer`,
        method: "GET",
        params: {
          limit: limit || 10,
          page: page || 1,
          searchTerm,
        },
      }),
      providesTags: ["customer", "vehicle", "jobCard", "quotation", "invoice"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useGetAllCustomersQuery,
  useGetSingleCustomerQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useMoveRecycledCustomerMutation,
  useRestoreFromRecycledCustomerMutation,
  usePermanentlyDeleteCustomerMutation,
  useGetAllTypeCustomersQuery,
} = customerApi;
