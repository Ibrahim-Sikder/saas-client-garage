import { baseApi } from "./baseApi";

const noteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNote: builder.mutation({
      query: (noteInfo) => ({
        url: "/notes",
        method: "POST",
        body: noteInfo,
      }),
      invalidatesTags: ["note"],
    }),

    getAllNotes: builder.query({
      query: ({
        tenantDomain,
        limit,
        page,
        customerId,
        companyId,
        showRoomId,
        searchTerm,
        isRecycled,
      }) => ({
        url: `/notes`,
        method: "GET",
        params: {
          tenantDomain,
          limit,
          page,
          searchTerm,
          isRecycled,
          ...(customerId && { customerId }),
          ...(companyId && { companyId }),
          ...(showRoomId && { showRoomId }),
        },
      }),
      providesTags: ["note"],
    }),

    getSingleNote: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/notes/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["note"],
    }),

    updateNote: builder.mutation({
      query: ({ id, tenantDomain, ...data }) => ({
        url: `/notes/${id}?tenantDomain=${tenantDomain}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["note"],
    }),

    moveToRecycleBinNote: builder.mutation({
      query: ({ id, tenantDomain }) => ({
        url: `/notes/recycle/${id}?tenantDomain=${tenantDomain}`,
        method: "PATCH",
      }),
      invalidatesTags: ["note"],
    }),

    restoreFromRecycleBinNote: builder.mutation({
      query: ({ id, tenantDomain }) => ({
        url: `/notes/restore/${id}?tenantDomain=${tenantDomain}`,
        method: "PATCH",
      }),
      invalidatesTags: ["note"],
    }),

    deleteNote: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/notes/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["note"],
    }),
  }),
});

export const {
  useCreateNoteMutation,
  useGetAllNotesQuery,
  useGetSingleNoteQuery,
  useUpdateNoteMutation,
  useMoveToRecycleBinNoteMutation,
  useRestoreFromRecycleBinNoteMutation,
  useDeleteNoteMutation,
} = noteApi;
