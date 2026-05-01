import { baseApi } from "./baseApi";

const jobCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createJobCard: builder.mutation({
      query: (jobCardInfo) => ({
        url: "/jobCards",
        method: "POST",
        body: jobCardInfo,
      }),
      invalidatesTags: ["jobCard"],
    }),
    getAllJobCards: builder.query({
      query: ({ tenantDomain, id, limit, page, searchTerm, isRecycled }) => ({
        url: `/jobCards`,
        method: "GET",
        params: { tenantDomain, id, limit, page, searchTerm, isRecycled },
      }),
      providesTags: ["jobCard"],
    }),

    getSingleJobCard: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/jobCards/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["jobCard"],
    }),
    getUserDetailsForJobCard: builder.query({
      query: ({ tenantDomain, id, userType }) => ({
        url: `/jobCards/${id}/${userType}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["jobCard"],
    }),

    getSingleJobCardWithJobNo: builder.query({
      query: ({ tenantDomain, jobNo }) => ({
        url: `/jobCards/getWithJobNo`,
        method: "GET",
        params: { tenantDomain, jobNo },
      }),
      providesTags: ["jobCard"],
    }),
    updateJobCard: builder.mutation({
      query: ({ id, data, tenantDomain }) => {
        return {
          url: `/jobCards/${id}`,
          method: "PUT",
          body: { ...data, tenantDomain },
        };
      },
      invalidatesTags: ["jobCard"],
    }),

    deleteJobCard: builder.mutation({
      query: (id) => ({
        url: `/jobCards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["jobCard"],
    }),
    movetoRecycleBinJobCard: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/jobcards/recycle-bin/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["jobCard"],
    }),

    restoreFromRecycleBinJobCard: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/jobcards/recycle-bin/restore/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["jobCard"],
    }),
    permanentlyDeleteJobCard: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/jobCards/recycle-bin/delete-permanantly/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["jobCard"],
    }),
  }),
});

export const {
  useCreateJobCardMutation,
  useGetAllJobCardsQuery,
  useGetSingleJobCardQuery,
  useGetUserDetailsForJobCardQuery,
  useGetSingleJobCardWithJobNoQuery,
  useUpdateJobCardMutation,
  useDeleteJobCardMutation,
  useMovetoRecycleBinJobCardMutation,
  useRestoreFromRecycleBinJobCardMutation,
  usePermanentlyDeleteJobCardMutation,
} = jobCardApi;
