import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getDashboardMetrics: build.query({
      query: () => "dashboard",
    }),
    getProducts: build.query({
      query: (search) => ({
        url: "/products",
        params: search ? { search } : {},
      }),
    }),
    createProduct: build.mutation({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
    }),
    getPatient: build.query({
      query: (id) => `/patients/${id}`,
    }),
    getExpensesByCategory: build.query({
      query: () => "/expenses",
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetPatientQuery,
  useGetExpensesByCategoryQuery,
} = api;
