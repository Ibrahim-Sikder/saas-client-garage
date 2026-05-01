import { baseApi } from "./baseApi";

const salaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSalary: builder.mutation({
      query: (salaryInfo) => ({
        url: "/salary",
        method: "POST",
        body: salaryInfo,
      }),
      invalidatesTags: ["salary", "employee"],
    }),

    partialyPayment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/salary/${id}/payment`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["salary", "employee"],
    }),

    getAllSalary: builder.query({
      query: ({ tenantDomain, searchTerm, month, year, day, limit, page }) => ({
        url: `/salary/all`,
        method: "GET",
        params: { tenantDomain, searchTerm, month, year, day, limit, page },
      }),
      providesTags: ["salary"],
    }),
    getSalaryByMonth: builder.query({
      query: ({ tenantDomain, month }) => ({
        url: '/salary/salary-month',
        method: "GET",
        params: { tenantDomain, month },
      }),
      providesTags: ["salary"],
    }),

    getSingleSalary: builder.query({
      query: ({ tenantDomain, id, month, year, day }) => ({
        url: `/salary/single/${id}`,
        method: "GET",
        params: { tenantDomain, month, year, day },
      }),
    }),

    updateSalary: builder.mutation({
      query: ({ id, data, tenantDomain }) => ({
        url: `/salary/${id}`,
        method: "PATCH",
        body: data,
        params: { tenantDomain },
      }),
      providesTags: ["salary"],
    }),

    deleteSalary: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/salary/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["salary"],
    }),
    getSalaryForProfile: builder.query({
      query: ({ tenantDomain, id, limit, page, month, year, day }) => ({
        url: "/salary/all-salary",
        method: "GET",
        params: { tenantDomain, id, limit, page, month, year, day },
      }),
      invalidatesTags: ["salary"],
    }),
  }),
});

export const {
  useCreateSalaryMutation,
  useGetAllSalaryQuery,
  useGetSingleSalaryQuery,
  useGetSalaryForProfileQuery,
  usePartialyPaymentMutation,
  useDeleteSalaryMutation,
  useUpdateSalaryMutation,
  useGetSalaryByMonthQuery
} = salaryApi;
