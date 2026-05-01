import { baseApi } from "./baseApi";

const pageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPage: builder.mutation({
      query: ({tenantDomain, data}) => ({
        url: "/page",
        method: "POST",
        body: data,
        params:{tenantDomain}
      }),
      invalidatesTags: ["page"],
    }),
    getAllPages: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/page`,
        method: "GET",
        params: { limit, page, searchTerm ,tenantDomain},
      
      }),
      providesTags: ["page"],
    }),
    getSinglePage: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/page/${id}`,
        method: "GET",
       params:{tenantDomain}
      }),
      providesTags: ["page"],
    }),
    updatePage: builder.mutation({
      query: ({ tenantDomain, id, ...data }) => ({
        url: `/page/${id}`,
        method: "PATCH",
        body: data,
        params:{tenantDomain}
      }),
      invalidatesTags: ["page"],
    }),

    deletePage: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/page/${id}`,
        method: "DELETE",
         params:{tenantDomain}
      }),
      invalidatesTags: ["page"],
    }),
  }),
});

export const {
  useCreatePageMutation,
  useGetAllPagesQuery,
  useGetSinglePageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pageApi;
