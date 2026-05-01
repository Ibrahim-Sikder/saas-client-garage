import { baseApi } from "./baseApi";

const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAttendance: builder.mutation({
      query: (attendanceInfo) => ({
        url: "/attendances",
        method: "POST",
        body: attendanceInfo,
      }),
      invalidatesTags: ["attendance", "employee"],
    }),

    getTodayAttendance: builder.query({
      query: ({ tenantDomain }) => ({
        url: `/attendances/today`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["attendance"],
    }),
    getAllAttendances: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/attendances`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["attendance"],
    }),
    getAllEmployeeAttendances: builder.query({
      query: ({
        tenantDomain,
        limit,
        page,
        searchTerm,
        startDate,
        endDate,
        month,
        year,
        status,
      }) => {
        const params = new URLSearchParams();

        if (tenantDomain) params.append("tenantDomain", tenantDomain);
        if (limit) params.append("limit", String(limit));
        if (page) params.append("page", String(page));
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (startDate) params.append("startDate", startDate.toString().trim());
        if (endDate) params.append("endDate", endDate.toString().trim());
        if (month) params.append("month", month);
        if (year) params.append("year", year);
        if (status) params.append("status", status);
        const queryString = params.toString();
        return {
          url: `/attendances/all?${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["attendance"],
    }),

    getSingleAttendance: builder.query({
      query: ({ tenantDomain, date }) => ({
        url: `/attendances/${date}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["attendance"],
    }),

    deleteAttendance: builder.mutation({
      query: ({ tenantDomain, date, id }) => ({
        url: "/attendances/remove",
        method: "DELETE",
        params: { tenantDomain, date, id },
      }),
      invalidatesTags: ["attendance"],
    }),
  }),
});

export const {
  useCreateAttendanceMutation,
  useGetTodayAttendanceQuery,
  useGetAllAttendancesQuery,
  useGetSingleAttendanceQuery,
  useDeleteAttendanceMutation,
  useGetAllEmployeeAttendancesQuery,
} = attendanceApi;
