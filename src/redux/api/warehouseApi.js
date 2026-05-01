import { baseApi } from "./baseApi";

const warehouseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createWarehouse: builder.mutation({
      query: (warehouseInfo) => ({
        url: "/warehouse",
        method: "POST",
        body: warehouseInfo,
      }),
      invalidatesTags: ["warehouse"],
    }),

    getAllWarehouses: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/warehouse",
        method: "GET",
        params: { limit, page, searchTerm, tenantDomain },

      }),
      providesTags: ["warehouse"],
    }),
    getWareHouseStocks: builder.query({
      query: ({ tenantDomain, limit, page, searchTerm }) => ({
        url: "/warehouse-stocks",
        method: "GET",
        params: { limit, page, searchTerm, tenantDomain },

      }),
      providesTags: ["warehouse"],
    }),

    getSingleWarehouse: builder.query({
      query: ({ tenantDomain, id }) => ({
        url: `/warehouse/${id}`,
        method: "GET",
        params: {
          tenantDomain,
        },
      }),
      providesTags: ["warehouse"],
    }),

    updateWarehouse: builder.mutation({
      query: ({ id, data }) => ({
        url: `/warehouse/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["warehouse"],
    }),

    removeWarehouse: builder.mutation({
      query: (warehousesInfo) => ({
        url: "/warehouse/remove-warehouse",
        method: "PATCH",
        body: warehousesInfo.data,
        params: { id: warehousesInfo.id },
      }),
      invalidatesTags: ["warehouse"],
    }),

    deleteWarehouse: builder.mutation({
      query: ({ tenantDomain, id }) => ({
        url: `/warehouse/${id}`,
        method: "DELETE",
        params: {
          tenantDomain,
        },
      }),
      invalidatesTags: ["warehouse"],
    }),
  }),
});

export const {
  useCreateWarehouseMutation,
  useGetAllWarehousesQuery,
  useGetSingleWarehouseQuery,
  useUpdateWarehouseMutation,
  useRemoveWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWareHouseStocksQuery
} = warehouseApi;
