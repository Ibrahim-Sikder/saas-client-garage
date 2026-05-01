import { baseApi } from "./baseApi";
const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPermission: builder.mutation({
      query: ({ userId, tenantDomain, data }) => ({
        url: `/permission/${userId}`,
        method: "POST",
        body: data,
        params: { tenantDomain },
      }),
      invalidatesTags: ["permission"],
    }),

    getAllPermissions: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/permission/my-permissions",
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["permission"],
    }),

    getAllUserPermissions: builder.query({
      query: ({ tenantDomain, limit, page, sortBy, sortOrder, role, user, searchTerm }) => ({
        url: "/permission/user-permissions",
        method: "GET",
        params: {
          tenantDomain,
          limit,
          page,
          sortBy,
          sortOrder,
          role,
          user,
          searchTerm
        },
      }),
      providesTags: ["permission"],
    }),
    getSinglePermission: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/permission/single/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["permission"],
    }),

    updatePermission: builder.mutation({
      query: ({ userId, tenantDomain, id, data }) => ({
        url: `/permission/${userId}/${id}`,
        method: "PUT",
        body: data,
        params: { tenantDomain },
      }),
      invalidatesTags: ["permission"],
    }),
    updateMultiplePermissions: builder.mutation({
      query: ({ tenantDomain, permissionUpdates }) => ({
        url: `/permission/batch-update?tenantDomain=${tenantDomain}`,
        method: 'PATCH',
        body: permissionUpdates,
      }),
      invalidatesTags: ['Permission'],
    }),

    createMultiplePermissions: builder.mutation({
      query: ({ tenantDomain, permissionData }) => ({
        url: `/permission/batch-create?tenantDomain=${tenantDomain}`,
        method: 'POST',
        body: permissionData,
      }),
      invalidatesTags: ['Permission'],
    }),


    deletePermission: builder.mutation({
      query: ({ userId, tenantDomain, id }) => ({
        url: `/permission/user/${userId}/${id}`,
        method: 'DELETE',
        params: { tenantDomain },
      }),
      invalidatesTags: ['Permission'],
    }),
    deleteMultiplePermissions: builder.mutation({
      query: ({ userId, tenantDomain, permissionIds }) => ({
        url: `/permission/user/${userId}/batch-delete`,
        method: 'POST',
        params: { tenantDomain },
        body: { permissionIds },
      }),
      invalidatesTags: ['Permission'],
    }),

  }),
});

export const {
  useCreatePermissionMutation,
  useGetAllPermissionsQuery,
  useGetSinglePermissionQuery,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useUpdateMultiplePermissionsMutation,
  useCreateMultiplePermissionsMutation,
  useGetAllUserPermissionsQuery,
  useDeleteMultiplePermissionsMutation
} = permissionApi;
