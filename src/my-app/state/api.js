import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:4000",
    baseUrl: "http://34.121.32.167:3002",
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (patient) => ({
        url: "/patients",
        method: "POST",
        body: patient,
      }),
    }),
    getDoctors: build.query({
      query: () => "/doctors",
    }),
    getDoctorById: build.query({
      query: (id) => `/doctors/${id}`,
    }),
    getAppointmentsById: build.query({
      query: (id) => `/appointments/${id}`,
    }),
    cancelAppointment: build.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
    }),
    addBookingAppointment: build.mutation({
      query: (appointment) => ({
        url: "/appointments",
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
      query: (id) => `/appointments/patient/${id}`,
    }),

    updateAppointmentDate: build.mutation({
      query: ({ id, data }) => ({
        url: `/appointments/${id}`,
        method: "PATCH",
        body: {
          date_of_visit: data.date_of_visit,
          start_time: data.start_time,
        },
      }),
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
  useCreateUserMutation,
  useUpdateAppointmentDateMutation,
} = api;
