import { baseApi } from "./baseApi";

const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (companyInfo) => ({
        url: "/companies",
        method: "POST",
        body: companyInfo,
      }),
      invalidatesTags: ["company"],
    }),
    getAllCompanies: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm, isRecycled }) => ({
        url: `/companies`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm, isRecycled },
      }),
      providesTags: ["company", "jobCard", "invoice", "quotation", "vehicle"],
    }),

    getSingleCompany: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/companies/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["company", "jobCard", "invoice", "quotation", "vehicle"],
    }),

    updateCompany: builder.mutation({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [
        "company",
        "jobCard",
        "invoice",
        "quotation",
        "vehicle",
      ],
    }),

    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/companies/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        "company",
        "jobCard",
        "invoice",
        "quotation",
        "vehicle",
      ],
    }),
    permanentlyDeleteCompany: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/companies/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: [
        "company",
        "jobCard",
        "invoice",
        "quotation",
        "vehicle",
      ],
    }),
    moveRecycledCompany: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/companies/recycle/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: [
        "company",
        "jobCard",
        "invoice",
        "quotation",
        "vehicle",
      ],
    }),

    restoreFromRecycledCompany: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/companies/restore/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: [
        "company",
        "jobCard",
        "invoice",
        "quotation",
        "vehicle",
      ],
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useGetAllCompaniesQuery,
  useGetSingleCompanyQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useMoveRecycledCompanyMutation,
  useRestoreFromRecycledCompanyMutation,
  usePermanentlyDeleteCompanyMutation,
} = companyApi;
