import { baseApi } from "./baseApi";

const showRoomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShowRoom: builder.mutation({
      query: (showroomInfo) => ({
        url: "/showrooms",
        method: "POST",
        body: showroomInfo,
      }),
      invalidatesTags: ["showroom"],
    }),
    getAllShowRooms: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm, isRecycled }) => ({
        url: `/showrooms`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm, isRecycled },
      }),
      providesTags: ["showroom", "jobCard", "invoice", "quotation", "vehicle"],
    }),

    getSingleShowRoom: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/showrooms/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["showroom", "jobCard", "invoice", "quotation", "vehicle"],
    }),
    updateShowRoom: builder.mutation({
      query: (showroomInfo) => {
        return {
          url: `/showrooms/${showroomInfo.id}`,
          method: "PUT",
          body: showroomInfo.data,
        };
      },
      invalidatesTags: ["showroom"],
    }),

    deleteShowRoom: builder.mutation({
      query: (id) => ({
        url: `/showrooms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["showroom"],
    }),
    permanentlyDeleteShowRoom: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/showrooms/delete-permanently/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["showroom"],
    }),
    moveRecycledShowRoom: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/showrooms/recycle/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["showroom"],
    }),
    restoreFromRecycledShowRoom: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/showrooms/restore/${id}`,
        method: "PATCH",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["showroom"],
    }),
  }),
});

export const {
  useCreateShowRoomMutation,
  useGetAllShowRoomsQuery,
  useGetSingleShowRoomQuery,
  useUpdateShowRoomMutation,
  useDeleteShowRoomMutation,
  useMoveRecycledShowRoomMutation,
  useRestoreFromRecycledShowRoomMutation,
  usePermanentlyDeleteShowRoomMutation,
} = showRoomApi;
