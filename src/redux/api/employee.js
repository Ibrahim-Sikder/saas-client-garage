import { baseApi } from "./baseApi";

const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation({
      query: (employeeInfo) => ({
        url: "/employees",
        method: "POST",
        body: employeeInfo,
      }),
      invalidatesTags: ["employee"],
    }),
    getAllEmployees: builder.query({
      query: ({
        tenantDomain,
        id,
        limit,
        page,
        searchTerm,
        isRecycled,
        status,
      }) => ({
        url: `/employees`,
        method: "GET",
        params: {
          tenantDomain,
          id,
          limit,
          page,
          searchTerm,
          isRecycled,
          status,
        },
      }),

      providesTags: ["employee", "attendance"],
    }),

    getSingleEmployee: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/employees/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["employee"],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["employee"],
    }),

    deleteEmployee: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/employees/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["employee"],
    }),
    permenantlyDeleteEmployee: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/employees/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["employee"],
    }),
    moveRecycledEmployee: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/employees/recycle/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["employee"],
    }),
    restoreFromRecycledEmployee: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/employees/restore/${id}`,
        method: "PATCH",
        params: { tenantDomain },
      }),
      invalidatesTags: ["employee"],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetAllEmployeesQuery,
  useGetSingleEmployeeQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useMoveRecycledEmployeeMutation,
  useRestoreFromRecycledEmployeeMutation,
  usePermenantlyDeleteEmployeeMutation,
} = employeeApi;
