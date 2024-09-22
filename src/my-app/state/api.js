import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:4000",
    baseUrl: "http://35.225.140.192:3002",
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    getDoctors: build.query({
      query: () => "/doctors",
    }),
    getDoctorById: build.query({
      query: (id) => `/doctors/${id}`,
    }),
    getAppointmentsById: build.query({
      query: (id) => `/appointment/${id}`,
    }),
    cancelAppointment: build.mutation({
      query: (id) => ({
        url: `/appointment/${id}`,
        method: "DELETE",
      }),
    }),
    addBookingAppointment: build.mutation({
      query: (appointment) => ({
        url: "/appointment",
        method: "POST",
        body: appointment,
      }),
    }),
    addNotification: build.mutation({
      query: (notification) => ({
        url: "/notifications",
        method: "POST",
        body: notification,
      }),
    }),
    getAppointmentsPatientId: build.query({
      query: (id) => `/appointment/patient/${id}`,
    }),
    getMedicalRecords: build.query({
      query: (id) => `patients/${id}/medical-records`,
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetAppointmentsByIdQuery,
  useCancelAppointmentMutation,
  useAddBookingAppointmentMutation,
  useAddNotificationMutation,
  useGetAppointmentsPatientIdQuery,
  useGetMedicalRecordsQuery,
} = api;
