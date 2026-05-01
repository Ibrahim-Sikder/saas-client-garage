import { baseApi } from "./baseApi";

const donationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDonation: builder.mutation({
      query: ({ tenantDomain, ...donationData }) => ({
        url: "/donation",
        method: "POST",
        params: { tenantDomain }, // goes to req.query
        body: donationData, // goes to req.body
      }),
      invalidatesTags: ["donation"],
    }),

    getAllDonation: builder.query({
      query: ({ tenantDomain }) => ({
        url: `/donation`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["donation"],
    }),
    getSingleDonation: builder.query({
      query: ({ id, tenantDomain }) => ({
        url: `/donation/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["donation"],
    }),

    deleteDonation: builder.mutation({
      query: ({ id, tenantDomain }) => ({
        url: `/donation/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["donation"],
    }),
   updateDonation: builder.mutation({
  query: ({ id, tenantDomain, ...donationData }) => ({
    url: `/donation/${id}`,
    method: "PATCH",
    params: { tenantDomain },
    body: donationData,  // send updated fields
  }),
  invalidatesTags: ["donation"],
}),

  }),
});

export const {
  useCreateDonationMutation,
  useGetAllDonationQuery,
  useGetSingleDonationQuery,
  useDeleteDonationMutation,
  useUpdateDonationMutation
} = donationApi;
