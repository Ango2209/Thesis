import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
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
        url: "/appointments/create",
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
    updateAppointmentStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/appointments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
    createInvoice: build.mutation({
      query: (createInvoiceDto) => ({
        url: "/invoices",
        method: "POST",
        body: createInvoiceDto,
      }),
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
  useUpdateAppointmentStatusMutation,
  useCreateInvoiceMutation,
} = api;
