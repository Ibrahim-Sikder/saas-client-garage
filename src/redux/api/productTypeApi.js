import { baseApi } from "./baseApi";

const productTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductType: builder.mutation({
      query: ({ tenantDomain, data }) => ({
        url: "/product-type",
        method: "POST",
        body: data,
        params: { tenantDomain }
      }),
      invalidatesTags: ["productType"],
    }),
    getAllIProductType: builder.query({
      query: ({ tenantDomain }) => ({
        url: '/product-type',
        method: "GET",
        params: { tenantDomain }
      }),
      providesTags: ["productType"],
    }),

    getSingleProductType: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/product-type/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["productType"],
    }),
    updateProductType: builder.mutation({
      query: ({ id, data, tenantDomain }) => ({
        url: `/product-type/${id}`,
        method: "PATCH",
        body: data,
        params: { tenantDomain }
      }),
      invalidatesTags: ["productType"],
    }),

    deleteProductType: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/product-type/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["productType"],
    }),
  }),
});

export const {
  useCreateProductTypeMutation,
  useGetAllIProductTypeQuery,
  useGetSingleProductTypeQuery,
  useUpdateProductTypeMutation,
  useDeleteProductTypeMutation,
} = productTypeApi;
