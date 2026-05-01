import { baseApi } from "./baseApi";

const incomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createIncome: builder.mutation({
      query: ({ tenantDomain, incomeInfo }) => ({
        url: `/incomes?tenantDomain=${tenantDomain}`,
        method: "POST",
        body: incomeInfo,
      }),
      invalidatesTags: ["income"],
    }),
    getAllIncomes: builder.query({
      query: ({tenantDomain,  limit, page }) => ({
        url: `/incomes`,
        method: "GET",
        params: {tenantDomain,  limit, page },
      }),
      providesTags: ["income"],
    }),

    getSingleIncome: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/incomes/${id}`,
        method: "GET",
        params:{tenantDomain}
      }),
      providesTags: ["income"],
    }),
   updateIncome: builder.mutation({
  query: ({ id, tenantDomain, ...data }) => ({
    url: `/incomes/${id}?tenantDomain=${tenantDomain}`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: ["income"],
}),

    deleteIncome: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/incomes/${id}`,
        method: "DELETE",
         params:{tenantDomain}
      }),
      invalidatesTags: ["income"],
    }),
  }),
});

export const {
  useCreateIncomeMutation,
  useGetAllIncomesQuery,
  useGetSingleIncomeQuery,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
} = incomeApi;
