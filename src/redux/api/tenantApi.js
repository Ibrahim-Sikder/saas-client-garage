import { baseApi } from "./baseApi";

const tenantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTenant: builder.mutation({
      query: ({ payload, plan }) => ({
        url: "/tenants",
        method: "POST",
        body: {
          ...payload,
          plan,
        },
      }),
    }),

    getAllTenant: builder.query({
      query: () => ({
        url: `/tenants`,
        method: "GET",
      }),
      providesTags: ["tenant"],
    }),
    getSingleTenant: builder.query({
      query: ({ id }) => ({
        url: `/tenants/${id}`,
        method: "GET",
      }),
      providesTags: ["supplier"],
    }),
    updateTenant: builder.mutation({
      query: ({ id, data }) => ({
        url: `/tenants/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["tenant"],
    }),
    deleteTenant: builder.mutation({
      query: ({ id }) => ({
        url: `/tenants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tenant"],
    }),
    renewSubscription: builder.mutation({
      query: ({ id, plan }) => ({
        url: `/tenants/renew-subscription/${id}`,
        method: "PATCH",
        body: { plan },
      }),
      invalidatesTags: ["tenant"],
    }),
  }),
});

export const {
  useCreateTenantMutation,
  useGetAllTenantQuery,
  useUpdateTenantMutation,
  useGetSingleTenantQuery,
  useDeleteTenantMutation,
  useRenewSubscriptionMutation,
} = tenantApi;
