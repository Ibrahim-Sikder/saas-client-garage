import { baseApi } from "./baseApi";

const stockCountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStockCount: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: "/stock",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response) => {
        return {
          data: response.data,

        };
      },
      providesTags: ["stocks"],
    }),
    getSingleStockCount: builder.query({
      query: (id) => {
        return {
          url: `/stock/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["stocks"],
    }),
    updateStockCount: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/stock/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["stocks"],
    }),

    createStockCount: builder.mutation({
      query: (formData) => {
        return {
          url: "/stock",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["stocks"],
    }),

    deleteStockCount: builder.mutation({
      query: (id) => {
        return {
          url: `/stock/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["stocks"],
    }),
  }),
  overrideExisting: true,
});

export const {
useGetAllStockCountQuery,
useCreateStockCountMutation,
useDeleteStockCountMutation, 
useGetSingleStockCountQuery,
useUpdateStockCountMutation
} = stockCountApi;
