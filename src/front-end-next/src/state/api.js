import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:4000",
    baseUrl: "http://localhost:3002",
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
    getPatients: build.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/patients",
        params: { page, limit },
      }),
    }),
    getMedicaRecords: build.query({
      query: (id) => `patients/${id}/medical-records`,
    }),
    getDoctors: build.query({
      query: () => "/doctors",
    }),
    getDoctor: build.query({
      query: (id) => `/doctors/${id}`,
    }),

    getExpensesByCategory: build.query({
      query: () => "/expenses",
    }),
    createBlog: build.mutation({
      query: (newBlog) => ({
        url: "/blogs/create",
        method: "POST",
        body: newBlog,
      }),
    }),
    uploadImages: build.mutation({
      query: (base64Images) => ({
        url: "/upload/images",
        method: "POST",
        body: base64Images,
      }),
    }),
    getMedicines: build.query({
      query: () => "/medicines",
    }),
    getMedicinesAvailable: build.query({
      query: () => "/medicines/available",
    }),
    getBatchesByMedicineId: build.query({
      query: (medicineId) => `/medicines/${medicineId}/batches`,
    }),
    addBatchs: build.mutation({
      query: (batchs) => ({
        url: "/batches",
        method: "POST",
        body: batchs,
      }),
    }),
    getNotificationsByDoctorId: build.query({
      query: (doctorId) => `/notifications/doctor/${doctorId}`,
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useGetPatientQuery,
  useGetExpensesByCategoryQuery,
  useGetPatientsQuery,
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useGetMedicaRecordsQuery,
  useCreateBlogMutation,
  useUploadImagesMutation,
  useGetMedicinesQuery,
  useGetMedicinesAvailableQuery,
  useGetBatchesByMedicineIdQuery,
  useAddBatchsMutation,
  useGetNotificationsByDoctorIdQuery,
} = api;
