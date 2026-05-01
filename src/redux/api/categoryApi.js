import { baseApi } from "./baseApi";

const categoryapi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (incomeInfo) => ({
        url: "/category",
        method: "POST",
        body: incomeInfo,
      }),
      invalidatesTags: ["category"],
    }),

    getAllICategory: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/category`,
        method: "GET",
        params: { limit, page, searchTerm, tenantDomain },

      }),
      providesTags: ["category"],
    }),
    getSingleCategory: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/category/${id}`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["category"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["category"],
    }),

    deleteCategory: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/category/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },

      }),
      invalidatesTags: ["category"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useGetAllICategoryQuery,
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryapi;
