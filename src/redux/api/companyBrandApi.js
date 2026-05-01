import { baseApi } from "./baseApi";

const companyBrandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCompanyBrand: builder.mutation({
      query: ({ tenantDomain, ...brandInfo }) => ({
        url: "/company-brand",
        method: "POST",
        body: brandInfo,
        headers: {
          "x-tenant-domain": tenantDomain,
        },
      }),
      invalidatesTags: ["company-brand"],
    }),

    getAllCompanyBrands: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/company-brand`,
        method: "GET",
        params: { limit, page, searchTerm },
        headers: {
          "x-tenant-domain": tenantDomain,
        },
      }),
      providesTags: ["company-brand"],
    }),

    getSingleCompanyBrand: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/company-brand/${id}`,
        method: "GET",
        headers: {
          "x-tenant-domain": tenantDomain,
        },
      }),
      providesTags: ["company-brand"],
    }),

    updateCompanyBrand: builder.mutation({
      query: ({ tenantDomain, id, ...data }) => ({
        url: `/company-brand/${id}`,
        method: "PATCH",
        body: data,
        headers: {
          "x-tenant-domain": tenantDomain,
        },
      }),
      invalidatesTags: ["company-brand"],
    }),

    deleteCompanyBrand: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/company-brand/${id}`,
        method: "DELETE",
        headers: {
          "x-tenant-domain": tenantDomain,
        },
      }),
      invalidatesTags: ["company-brand"],
    }),
  }),
});

export const {
  useCreateCompanyBrandMutation,
  useGetAllCompanyBrandsQuery,
  useGetSingleCompanyBrandQuery,
  useUpdateCompanyBrandMutation,
  useDeleteCompanyBrandMutation,
} = companyBrandApi;
