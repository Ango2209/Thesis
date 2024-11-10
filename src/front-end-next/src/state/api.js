import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    baseUrl: "http://192.168.1.141:3002",
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
    createPatient: build.mutation({
      query: (patient) => ({
        url: "/patients/create",
        method: "POST",
        body: patient,
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
    getAppointmentsDoctorId: build.query({
      query: (doctorId) => `/appointment/doctor/${doctorId}`,
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
    getAppointmentsByStatusAndDate: build.query({
      query: ({ statuses, date, page = 1, limit = 10 }) => ({
        url: "/appointments/filter",
        params: { statuses, date, page, limit },
      }),
    }),
    getAppointment: build.query({
      query: (id) => `/appointments/${id}`,
    }),
    updateAppointmentStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/appointments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
    updateIsExamined: build.mutation({
      query: (id) => ({
        url: `/appointments/${id}/examined`,
        method: "PATCH",
      }),
    }),
    searchMedicines: build.query({
      query: (search) => ({
        url: "/medicines/search",
        params: search ? { name: search } : {},
      }),
    }),
    addMedicalRecord: build.mutation({
      query: ({ patientId, record }) => ({
        url: `/patients/${patientId}/medical-records`,
        method: "POST",
        body: record,
      }),
    }),
    createService: build.mutation({
      query: (createServiceDto) => ({
        url: "/services",
        method: "POST",
        body: createServiceDto,
      }),
    }),

    getAllServices: build.query({
      query: () => "/services",
    }),

    getServiceById: build.query({
      query: (id) => `/services/${id}`,
    }),
    getServicesByStatus: build.query({
      query: (status) => `/services/status/${status}`,
    }),

    updateService: build.mutation({
      query: ({ id, updateServiceDto }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: updateServiceDto,
      }),
    }),

    deleteService: build.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
    }),
    getMedicalTests: build.query({
      query: ({ statuses, date, page = 1, limit = 10 }) => ({
        url: "/medical-tests",
        params: { statuses, date, page, limit },
      }),
    }),
    getMedicalTestsByAppointmentId: build.query({
      query: (appointmentId) => `/medical-tests/appointment/${appointmentId}`,
    }),
    getMedicalTestById: build.query({
      query: (id) => `/medical-tests/${id}`,
    }),
    createMedicalTest: build.mutation({
      query: (createMedicalTestDto) => ({
        url: "/medical-tests",
        method: "POST",
        body: createMedicalTestDto,
      }),
    }),
    updateMedicalTest: build.mutation({
      query: ({ id, updateMedicalTestDto }) => ({
        url: `/medical-tests/${id}`,
        method: "PUT",
        body: updateMedicalTestDto,
      }),
    }),

    getPrescriptionsByDate: build.query({
      query: ({ date, page = 1, limit = 10 }) => ({
        url: "/patients/prescriptions",
        params: { date, page, limit },
      }),
    }),
    uploadMultipleFiles: build.mutation({
      query: (files) => ({
        url: "/upload/multiple",
        method: "POST",
        body: files,
      }),
    }),

    checkMedicinesAvailability: build.mutation({
      query: (medicinesToCheck) => ({
        url: "/medicines/check-medicines-availability",
        method: "POST",
        body: medicinesToCheck,
      }),
    }),

    lockMedicines: build.mutation({
      query: (medicinesToCheck) => ({
        url: "/medicines/lock-medicines",
        method: "POST",
        body: medicinesToCheck,
      }),
    }),

    unlockMedicines: build.mutation({
      query: (medicinesToUnlock) => ({
        url: "/medicines/unlock-medicines",
        method: "POST",
        body: medicinesToUnlock,
      }),
    }),
    createInvoice: build.mutation({
      query: (createInvoiceDto) => ({
        url: "/invoices",
        method: "POST",
        body: createInvoiceDto,
      }),
    }),
    reduceMedicines: build.mutation({
      query: (medicinesToCheck) => ({
        url: "medicines/reduce-medicines",
        method: "POST",
        body: medicinesToCheck,
      }),
    }),
    changeToPaid: build.mutation({
      query: (id) => ({
        url: `/invoices/${id}/change-to-paid`,
        method: "PATCH",
      }),
    }),
    login: build.mutation({
      query: (loginDto) => ({
        url: "/auth/signIn",
        method: "POST",
        body: loginDto,
      }),
    }),
    signUp: build.mutation({
      query: (signUpDto) => ({
        url: "/auth/register",
        method: "POST",
        body: signUpDto,
      }),
    }),
    getLast7DaysRevenue: build.query({
      query: () => "/invoices/last-7-days-revenue",
    }),
    getMonthlyRevenueByYear: build.query({
      query: (year) => ({
        url: "/invoices/monthly-revenue",
        params: year,
      }),
    }),
    getRecentPatient: build.query({
      query: () => "/appointments/recent-patients",
    }),
    getLast7DaysfinishedAppointments: build.query({
      query: () => "/appointments/finished-appointments-stats",
    }),
    getTopItems: build.query({
      query: ({ startDate, endDate, type }) => ({
        url: "/invoices/top-items",
        params: { startDate, endDate, type },
      }),
    }),
    exportMedicinesToExcel: build.query({
      query: ({ startDate, endDate }) => ({
        url: `/invoices/medicines-excel?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const today = new Date().toLocaleDateString().replace(/\//g, "-");
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Medicines_Report_${today}.xlsx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        },
      }),
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
  useCreatePatientMutation,
  useGetAppointmentsByStatusAndDateQuery,
  useGetAppointmentQuery,
  useUpdateAppointmentStatusMutation,
  useSearchMedicinesQuery,
  useAddMedicalRecordMutation,
  useCreateServiceMutation,
  useGetAllServicesQuery,
  useGetServiceByIdQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesByStatusQuery,
  useGetMedicalTestsQuery,
  useGetMedicalTestByIdQuery,
  useCreateMedicalTestMutation,
  useUpdateMedicalTestMutation,
  useGetMedicalTestsByAppointmentIdQuery,
  useUploadMultipleFilesMutation,
  useUpdateIsExaminedMutation,
  useGetPrescriptionsByDateQuery,
  useCheckMedicinesAvailabilityMutation,
  useUnlockMedicinesMutation,
  useLockMedicinesMutation,
  useCreateInvoiceMutation,
  useReduceMedicinesMutation,
  useChangeToPaidMutation,
  useLoginMutation,
  useSignUpMutation,
  useGetLast7DaysRevenueQuery,
  useGetMonthlyRevenueByYearQuery,
  useGetRecentPatientQuery,
  useGetLast7DaysfinishedAppointmentsQuery,
  useGetTopItemsQuery,
  useLazyExportMedicinesToExcelQuery,
} = api;
