import { baseApi } from "./baseApi";

const employeeOvertimeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployeeOvertime: builder.mutation({
      query: (overtimeInfo) => ({
        url: "/employee-overtime",
        method: "POST",
        body: overtimeInfo,
      }),
      invalidatesTags: ["employeeOvertime"],
    }),

    getAllEmployeeOvertimes: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/employee-overtime",
        method: "GET",
        params: {tenantDomain,  limit, page, searchTerm },
      }),
      providesTags: ["employeeOvertime"],
    }),

    getSingleEmployeeOvertime: builder.query({
      query: ({tenantDomain, overtimeId}) => ({
        url: `/employee-overtime/${overtimeId}`,
        method: "GET",
        params:{tenantDomain}
      }),
      providesTags: ["employeeOvertime"],
    }),

    updateEmployeeOvertime: builder.mutation({
      query: ({ overtimeId, ...data }) => ({
        url: `/employee-overtime/${overtimeId}`,
        method: "PATCH",
        body:data,
      }),
      invalidatesTags: ["employeeOvertime"],
    }),

    deleteEmployeeOvertime: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/employee-overtime/${id}`,
        method: "DELETE",
        params:{tenantDomain}
      }),
      invalidatesTags: ["employeeOvertime"],
    }),
  }),
});

export const {
  useCreateEmployeeOvertimeMutation,
  useGetAllEmployeeOvertimesQuery,
  useGetSingleEmployeeOvertimeQuery,
  useUpdateEmployeeOvertimeMutation,
  useDeleteEmployeeOvertimeMutation,
} = employeeOvertimeApi;
