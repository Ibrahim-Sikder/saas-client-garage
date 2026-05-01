import { baseApi } from "./baseApi";

const unitApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUnit: builder.mutation({
      query: (incomeInfo) => ({
        url: "/unit",
        method: "POST",
        body: incomeInfo,
      }),
      invalidatesTags: ["unit"],
    }),

    getAllIUnit: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/unit`,
        method: "GET",
        params: { limit, page, searchTerm, tenantDomain },

      }),
      providesTags: ["unit"],
    }),

    getSingleUnit: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/unit/${id}`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["unit"],
    }),
    updateUnit: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/unit/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["unit"],
    }),

    deleteUnit: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/unit/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["unit"],
    }),
  }),
});

export const {
  useCreateUnitMutation,
  useGetAllIUnitQuery,
  useGetSingleUnitQuery,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
