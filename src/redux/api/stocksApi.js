import { baseApi } from "./baseApi";

const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStocks: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/stocks",
        method: "GET",
        params: {tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["stocks"],
    }),
    getSingleStock: builder.query({
      query: (id) => ({
        url: `/stocks/${id}`,
        method: "GET",
      }),
      providesTags: ["stocks"],
    }),
    createStock: builder.mutation({
      query: (stockData) => ({
        url: "/stocks",
        method: "POST",
        body: stockData,
      }),
      invalidatesTags: ["stocks"],
    }),
    updateStock: builder.mutation({
      query: ({ id, data }) => ({
        url: `/stocks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["stocks"],
    }),
    deleteStock: builder.mutation({
      query: (id) => ({
        url: `/stocks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["stocks"],
    }),
  }),
});

export const {
  useGetAllStocksQuery,
  useGetSingleStockQuery,
  useCreateStockMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = stockApi;
