import { baseApi } from "./baseApi";

const roleApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createRole: builder.mutation({
            query: ({ tenantDomain, data }) => ({
                url: "/role",
                method: "POST",
                body: data,
                params: { tenantDomain },
            }),
            invalidatesTags: ["role"],
        }),
        getAllRoles: builder.query({
            query: ({ tenantDomain, limit, page, searchTerm }) => ({
                url: "/role",
                method: "GET",
                params: { tenantDomain, limit, page, searchTerm },
            }),
            providesTags: ["role"],
        }),
        getSingleRole: builder.query({
            query: ({ tenantDomain, id }) => ({
                url: `/role/${id}`,
                method: "GET",
                params: { tenantDomain },
            }),
            providesTags: ["role"],
        }),
        updateRole: builder.mutation({
            query: ({ tenantDomain, id, ...data }) => ({
                url: `/role/${id}`,
                method: "PATCH",
                body: data,
                params: { tenantDomain },
            }),
            invalidatesTags: ["role"],
        }),
        deleteRole: builder.mutation({
            query: ({ tenantDomain, id }) => ({
                url: `/role/${id}`,
                method: "DELETE",
                params: { tenantDomain },
            }),
            invalidatesTags: ["role"],
        }),
    }),
});

export const {
    useCreateRoleMutation,
    useGetAllRolesQuery,
    useGetSingleRoleQuery,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} = roleApi;
