import { baseApi } from "./baseApi";

const warrantyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
createWarranty: builder.mutation({
  query: ({ tenantDomain, ...data }) => ({
    url: `/warranties`,
    method: "POST",
    body: data, 
    params: { tenantDomain },
  }),
  invalidatesTags: ["warranty"],
}),


    getAllWarranty: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/warranties`,
        method: "GET",
        params: { limit, page, searchTerm, tenantDomain },
      }),
      providesTags: ["warranty"],
    }),

    getSingleWarranty: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/warranties/${id}`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["warranty"],
    }),

    updateWarranty: builder.mutation({
      query: ({ tenantDomain, id, ...data }) => ({
        url: `/warranties/${id}`,
        method: "PATCH",
        body: data,
        params: { tenantDomain },
      }),
      invalidatesTags: ["warranty"],
    }),

    deleteWarranty: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/warranties/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["warranty"],
    }),
  }),
});

export const {
  useCreateWarrantyMutation,
  useGetAllWarrantyQuery,
  useGetSingleWarrantyQuery,
  useUpdateWarrantyMutation,
  useDeleteWarrantyMutation,
} = warrantyApi;
