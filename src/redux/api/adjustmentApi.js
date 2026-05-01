import { baseApi } from "./baseApi";

const adjustmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdjustment: builder.mutation({
      query: ({ tenantDomain, data }) => ({
        url: "/adjustment",
        method: "POST",
        body: data,
        params: { tenantDomain }
      }),
      invalidatesTags: ["adjustment"],
    }),
    getAllIAdjustment: builder.query({
      query: ({ tenantDomain, limit, page }) => ({
        url: `/adjustment`,
        method: "GET",
        params: { tenantDomain, limit, page },
      }),
      providesTags: ["adjustment"],
    }),



    getSingleAdjustment: builder.query({
      query: (id) => ({
        url: `/adjustment/${id}`,
        method: "GET",
      }),
      providesTags: ["adjustment"],
    }),
    updateAdjustment: builder.mutation({
      query: ({ id, tenantDomain, ...data }) => ({
        url: `/adjustment/${id}`,
        method: "PATCH",
        body: data,
        params: { tenantDomain }
      }),
      invalidatesTags: ["adjustment"],
    }),

    deleteAdjustment: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/adjustment/${id}`,
        method: "DELETE",
        params: { tenantDomain }
      }),
      invalidatesTags: ["adjustment"],
    }),
  }),
});

export const {
  useCreateAdjustmentMutation,
  useGetAllIAdjustmentQuery,
  useGetSingleAdjustmentQuery,
  useUpdateAdjustmentMutation,
  useDeleteAdjustmentMutation,
} = adjustmentApi;
