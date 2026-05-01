import { baseApi } from "./baseApi";

const holidayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createHoliday: builder.mutation({
      query: (holidayInfo) => ({
        url: "/holiday",
        method: "POST",
        body: holidayInfo,
      }),
      invalidatesTags: ["holiday"],
    }),

    getAllHolidays: builder.query({
      query: ({ limit, page, searchTerm }) => ({
        url: "/holiday",
        method: "GET",
        params: { limit, page, searchTerm },
      }),
      providesTags: ["holiday"],
    }),

    getSingleHoliday: builder.query({
      query: (holidayId) => ({
        url: `/holiday/${holidayId}`,
        method: "GET",
      }),
      providesTags: ["holiday"],
    }),

    updateHoliday: builder.mutation({
      query: ({ holidayId, ...data }) => ({
        url: `/holiday/${holidayId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["holiday"],
    }),

    deleteHoliday: builder.mutation({
      query: (holidayId) => ({
        url: `/holiday/${holidayId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["holiday"],
    }),
  }),
});

export const {
  useCreateHolidayMutation,
  useGetAllHolidaysQuery,
  useGetSingleHolidayQuery,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
} = holidayApi;
