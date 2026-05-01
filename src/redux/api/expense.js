import { baseApi } from "./baseApi";

const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: ({ tenantDomain, expenseInfo }) => ({
        url: `/expenses?tenantDomain=${tenantDomain}`,
        method: "POST",
        body: expenseInfo,
      }),
      invalidatesTags: ["expense"],
    }),
    getAllExpenses: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/expenses`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["expense"],
    }),

    getSingleExpense: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/expenses/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["expense"],
    }),
    updateExpense: builder.mutation({
      query: ({ tenantDomain, id, ...data }) => {
        return {
          url: `/expenses/${id}`,
          method: "PUT",
          body: data,
          params:{tenantDomain}
        };
      },
      invalidatesTags: ["expense"],
    }),

    deleteExpense: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["expense"],
    }),

    createExpenseCategory: builder.mutation({
      query: ({ tenantDomain, expenseInfo }) => ({
        url: `/expenses/expense-categories/create?tenantDomain=${tenantDomain}`,
        method: "POST",
        body: expenseInfo,
      }),
      invalidatesTags: ["expenseCategory"],
    }),

    getAllExpensesCategory: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: `/expenses/expense-categories/all`,
        method: "GET",
        params: { tenantDomain, limit, page, searchTerm },
      }),
      providesTags: ["expenseCategory"],
    }),

    getSingleExpenseCategory: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/expenses/expense-categories/${id}`,
        method: "GET",
        params: { tenantDomain },
      }),
      providesTags: ["expenseCategory"],
    }),

    updateExpenseCategory: builder.mutation({
      query: ({ tenantDomain, id, ...data }) => {
        return {
          url: `/expenses/expense-categories/update/${id}?tenantDomain=${tenantDomain}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["expenseCategory"],
    }),

    deleteExpenseCategory: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/expenses/expense-categories/${id}`,
        method: "DELETE",
        params: { tenantDomain },
      }),
      invalidatesTags: ["expenseCategory"],
    }),
  }),
});

export const {
  useCreateExpenseMutation,
  useGetAllExpensesQuery,
  useGetSingleExpenseQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useCreateExpenseCategoryMutation,
  useGetAllExpensesCategoryQuery,
  useDeleteExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useGetSingleExpenseCategoryQuery,
} = expenseApi;
