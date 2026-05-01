import { baseApi } from "./baseApi";

const companyProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCompanyProfile: builder.mutation({
      query: ({ tenantDomain, data }) => ({
        url: `/company-profile/create`,
        method: "POST",
        body: data,
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["companyProfile"],
    }),

    getCompanyProfile: builder.query({
      query: ({ tenantDomain }) => ({
        url: `/company-profile`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["companyProfile"],
    }),

    updateCompanyProfile: builder.mutation({
      query: ({ tenantDomain, id, data }) => ({
        url: `/company-profile/update/${id}`,
        method: "PUT",
        body: data,
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["companyProfile"],
    }),
  }),
});

export const {
  useCreateCompanyProfileMutation,
  useGetCompanyProfileQuery,
  useUpdateCompanyProfileMutation,
} = companyProfileApi;
