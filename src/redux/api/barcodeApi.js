import { baseApi } from "./baseApi";

const barcodeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBarcode: builder.mutation({
      query: ({ tenantDomain, data }) => ({
        url: "/barcode",
        method: "POST",
        body: data,
        params: { tenantDomain }
      }),
      invalidatesTags: ["barcode"],
    }),
    getAllIBarcode: builder.query({
      query: ({ tenantDomain }) => ({
        url: `/barcode`,
        method: "GET",
        params: { tenantDomain }
      }),
      providesTags: ["barcode"],
    }),

    getSingleBarcode: builder.query({
      query: (id) => ({
        url: `/barcode/${id}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),
    updateBarcode: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/barcode/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["barcode"],
    }),

    deleteBarcode: builder.mutation({
      query: (id) => ({
        url: `/barcode/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["barcode"],
    }),
  }),
});

export const {
  useCreateBarcodeMutation,
  useGetAllIBarcodeQuery,
  useGetSingleBarcodeQuery,
  useUpdateBarcodeMutation,
  useDeleteBarcodeMutation,
} = barcodeApi;
