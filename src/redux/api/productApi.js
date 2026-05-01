import { baseApi } from "./baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (incomeInfo) => ({
        url: "/products",
        method: "POST",
        body: incomeInfo,
      }),
      invalidatesTags: ["products"],
    }),

    getAllIProduct: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm, isRecycled }) => ({
        url: "/products",
        method: "GET",
        params: { limit, page, searchTerm, isRecycled, tenantDomain },

      }),

      providesTags: ["products"],
    }),
    getSingleProduct: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/products/${id}`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    deleteProduct: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/products/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllIProductQuery,
  useGetSingleProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
