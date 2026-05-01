import { baseApi } from "./baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (data) => ({
        url: "/user",
        method: "POST",
        body: data,
      }),
    }),

    deleteUser: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/user/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["user"],
    }),
    getAllUser: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm, isRecycled }) => ({
        url: `/user`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm, isRecycled },
      }),
      providesTags: ["user"],
    }),
    getUserPermission: builder.query({
      query: ({ tenantDomain, userId }) => ({
        url: `/user/${userId}/permissions`,
        method: "GET",
        params: { tenantDomain, },
      }),
      providesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data, tenantDomain }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
        params: { tenantDomain },
      }),
      invalidatesTags: ["user"],
    }),
    getAllContactUser: builder.query({
      query: ({ limit, page, searchTerm }) => ({
        url: `/contact`,
        method: "GET",
        params: { limit, page, searchTerm },
      }),
      providesTags: ["contact"],
    }),
    deleteContactUser: builder.mutation({
      query: ({ id }) => ({
        url: `/contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contact"],
    }),
    moveUserToRecycleBin: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/user/recycle/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["user"],
    }),

    restoreUser: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/user/restore/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["user"],
    }),

    permanentlyDeleteUser: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/user/permanent/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["user"],
    }),

  }),
});

export const {
  useCreateUserMutation,
  useGetAllUserQuery,
  useDeleteUserMutation,
  useGetAllContactUserQuery,
  useDeleteContactUserMutation,
  useUpdateUserMutation,
  useGetUserPermissionQuery,
  useMoveUserToRecycleBinMutation,
  useRestoreUserMutation,
  usePermanentlyDeleteUserMutation
} = userApi;
