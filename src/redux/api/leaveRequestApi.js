import { baseApi } from "./baseApi";

const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLeaveRequest: builder.mutation({
      query: (expenseInfo) => ({
        url: "/leave-requests",
        method: "POST",
        body: expenseInfo,
      }),
      invalidatesTags: ["leave"],
    }),

    getAllELeaveRequest: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/leave-requests`,
        method: "GET",
        params: {tenantDomain,  limit, page, searchTerm },
      }),
      providesTags: ["leave"],
    }),

    getSingleLeaveRequest: builder.query({
      query: ({tenantDomain,leaveRequestsId}) => ({
        url: `/leave-requests/${leaveRequestsId}`,
        method: "GET",
         params:{tenantDomain}
      }),
      providesTags: ["leave"],
    }),

    getLeaveRequestByEmployeeId: builder.query({
      query: ({tenantDomain, employeeId}) => ({
        url: `/leave-requests/employeeId?employeeId=${employeeId}`,
        method: "GET",
        params:{tenantDomain}
      }),
      providesTags: ["leave"],
    }),
    
    updateLeaveRequest: builder.mutation({
      query: ({ id, ...data }) => {
        return {
          url: `/leave-requests/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["leave"],
    }),

    deleteLeaveRequest: builder.mutation({
      query: ({tenantDomain,id}) => ({
        url: `/leave-requests/${id}`,
        method: "DELETE",
         params:{tenantDomain}
      }),
      invalidatesTags: ["leave"],
    }),
  }),
});

export const {
  useCreateLeaveRequestMutation,
  useGetAllELeaveRequestQuery,
  useGetSingleLeaveRequestQuery,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
  useGetLeaveRequestByEmployeeIdQuery
} = leaveApi;


