import { baseApi } from "./baseApi";

const metaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMeta: builder.query({
      query: ({ tenantDomain }) => ({
        url: `/meta`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["meta"],
    }),
    accountSummary: builder.query({
      query: ({ tenantDomain }) => ({
        url: `/meta/accounting-summary`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["meta"],
    }),
    allCustomer: builder.query({
      query: ({
        tenantDomain,
        page = 1,
        limit = 10,
        searchTerm = "",
        isRecycled = false,
      }) => ({
        url: `/meta/allcustomer`,
        method: "GET",
        params: {
          tenantDomain,
          page,
          limit,
          searchTerm,
          isRecycled,
        },
      }),
      providesTags: ["meta"],
    }),
  }),
});

export const { useGetAllMetaQuery, useAllCustomerQuery, useAccountSummaryQuery } = metaApi;
