"use client";
import { useGetAppointmentQuery, useGetMedicalTestsByAppointmentIdQuery, useGetMedicaRecordsQuery, useUpdateAppointmentStatusMutation } from "@/state/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MedicalServiceRequest from "./MedicalServiceRequest";
import { formatDateToVietnamTime } from "@/lib/dateUtils";
import { toast } from "react-toastify";

const Detail = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const { data, isError, isLoading, refetch: refetchAppointment } = useGetAppointmentQuery(id);
  const { data: mrData, isError: isError2, refetch: refetchMr, isLoading: isLoading2 } = useGetMedicaRecordsQuery(data?.patient?._id);
  const { data: serviceRqData, error, refetch, isLoadingServiceRq, isError: isErrorServiceRq } = useGetMedicalTestsByAppointmentIdQuery(id);
  const [updateAppointmentStatus] = useUpdateAppointmentStatusMutation();
  const [expandedRow, setExpandedRow] = useState(null);
  const [expandedRowFile, setExpandedRowFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refetchAppointment();
    refetchMr();
  }, [router.query?.timestamp]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const toggleRowFile = (index) => {
    setExpandedRowFile(expandedRowFile === index ? null : index);
  };

  const checkAllServiceCompleted = () => {
    if (serviceRqData?.length === 0) return true;
    return serviceRqData?.every((item) => item.status === "completed");
  };

  const onComplete = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <h3 className="text-lg font-semibold">Do you want to complete?</h3>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="bg-gray-300 p-2 rounded"
              onClick={() => {
                closeToast();
              }}
            >
              No, thanks
            </button>
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={async () => {
                try {
                  closeToast();
                  await updateAppointmentStatus({ id: id, status: "finished" }).unwrap();
                  toast.success("Completed examine");
                  router.push(`/examine`);
                } catch (error) {
                  toast.error("Oops, an error occurred. Please try again later");
                }
              }}
            >
              Yes
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "awaiting payment":
        return "bg-orange-100 text-orange-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "waiting":
        return "bg-yellow-100 text-yellow-800";
      case "examining":
        return "bg-cyan-100 text-cyan-800";
      case "awaiting results":
        return "bg-orange-100 text-orange-800";
      case "finished":
        return "bg-green-100 text-green-800";
      case "medicined":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 mb-2">
            <Link className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md" href="/examine">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"></path>
              </svg>
            </Link>
          </div>
          <h3 className="text-lg font-semibold">Examination details</h3>
          <button
            type="button"
            className={`${!data?.isExamined || data?.status === "finished" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded focus:outline-none`}
            disabled={!data?.isExamined}
            onClick={onComplete}
          >
            Complete
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Field Names */}
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Patient:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">{data?.patient?.fullname}</div>
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Date of Birth:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">{new Date(data?.patient?.dob).toLocaleDateString()}</div>
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Anamesis:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">{data?.patient?.anamesis}</div>
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Blood Group:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">{data?.patient?.blood_group}</div>

              {/* Additional Fields */}
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Phone:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">{data?.patient?.phone}</div>
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Appointment Time:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">
                {new Date(data?.date_of_visit).toLocaleDateString()} | {data?.start_time}
              </div>

              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Specialty:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">{data?.specialized}</div>
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Status:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">
                <span className={`${getStatusClass(data?.status)} px-2 py-1 rounded-full text-sm`}>{data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h3 className="text-lg font-semibold">Medical Service Request</h3>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button
                onClick={openModal}
                type="button"
                className={`${data?.isExamined ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded focus:outline-none`}
                disabled={data?.isExamined}
              >
                Create a medical service request
              </button>
              <Link
                href={`/examine/${id}/result`}
                className={`${
                  checkAllServiceCompleted() && !data?.isExamined ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed pointer-events-none"
                } text-white px-4 py-2 rounded focus:outline-none`}
              >
                Examination results
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Create at</th>
                  <th className="py-2 px-4 border-b text-left">Service Name</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                  <th className="py-2 px-4 border-b text-left">Initial Diagnosis</th>
                  <th className="py-2 px-4 border-b text-left">Notes</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Conclude</th>
                  <th className="py-2 px-4 border-b text-center">Attachments</th>
                </tr>
              </thead>
              <tbody>
                {serviceRqData?.length <= 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No requests have been created yet
                    </td>
                  </tr>
                )}
                {isLoadingServiceRq && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}
                {isErrorServiceRq && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Error loading data
                    </td>
                  </tr>
                )}
                {serviceRqData?.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{formatDateToVietnamTime(data.createdAt)}</td>
                      <td className="py-2 px-4 border-b">{data.service?.name}</td>
                      <td className="py-2 px-4 border-b">{data.service?.price}</td>
                      <td className="py-2 px-4 border-b">{data.initialDiagnosis}</td>
                      <td className="py-2 px-4 border-b ">{data.notes}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusClass(data.status)}`}>{data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}</span>
                      </td>
                      <td className="py-2 px-4 border-b">{data.conclude ? data.conclude : <span className="text-gray-500">No conclusion yet</span>}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button type="button" onClick={() => toggleRowFile(index)} className="text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-7 5h7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expandedRowFile === index && (
                      <tr>
                        <td colSpan="8" className="px-4 py-2 border-b">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-lg font-semibold mb-2">Attachments</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {data.attachments?.length > 0 ? (
                                data.attachments.map((attachment, attachmentIndex) => {
                                  const fileName = attachment.split("/").pop();
                                  const fileFormat = fileName.split(".").pop().toUpperCase();

                                  return (
                                    <div key={attachmentIndex} className="bg-white border p-4 rounded-lg shadow-sm">
                                      <div className="flex items-center justify-between">
                                        <p className="text-gray-700 font-medium">{fileName}</p>

                                        <span className="ml-2 text-gray-500 text-sm uppercase">{fileFormat}</span>
                                      </div>

                                      <a href={attachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
                                        View / Download
                                      </a>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-gray-500">No attachments available.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h3 className="text-lg font-semibold">Medical Record</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Appointment Date</th>
                  <th className="py-2 px-4 border-b text-left">Doctor</th>
                  <th className="py-2 px-4 border-b text-left">Result</th>
                  <th className="py-2 px-4 border-b text-left">Notes</th>
                  <th className="py-2 px-4 border-b text-center">Prescription</th>
                  <th className="py-2 px-4 border-b text-center">Materials</th>
                  <th className="py-2 px-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading2 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}
                {isError2 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Error loading data
                    </td>
                  </tr>
                )}
                {mrData?.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td className="py-2 px-4 border-b">{formatDateToVietnamTime(data.record_date)}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex items-center">
                          <div>
                            <div className="font-semibold">{data.doctor.fullname}</div>
                            <a href={`tel:${data.doctor.phone}`} className="text-blue-500">
                              {data.doctor.phone}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b">{data.diagnosis}</td>
                      <td className="py-2 px-4 border-b">{data?.notes}</td>
                      <td className="py-2 px-4 border-b text-center">
                        <button type="button" className="text-blue-500 hover:text-blue-700" onClick={() => toggleRow(index)}>
                          {expandedRow === index ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                            </svg>
                          )}
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button type="button" className="text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-7 5h7" />
                          </svg>
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button type="button" className="text-green-500 hover:text-green-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l-5 5 5 5M6 12h13" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr>
                        <td colSpan="7" className="px-4 py-2 border-b">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-lg font-semibold mb-4">Prescription Details</h4>
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="py-2 px-4 border-b text-left">Medicine Name</th>
                                  <th className="py-2 px-4 border-b text-center">Dosage</th>
                                  <th className="py-2 px-4 border-b text-center">Instraction</th>
                                  <th className="py-2 px-4 border-b text-center">Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                {data.prescriptions.map((item, index) => (
                                  <tr key={index}>
                                    <td className="py-2 px-4 border-b">{item.itemName}</td>
                                    <td className="py-2 px-4 border-b text-center">{item.dosage}</td>
                                    <td className="py-2 px-4 border-b text-center">{item.instraction}</td>
                                    <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <MedicalServiceRequest
          isOpen={isModalOpen}
          onClose={closeModal}
          doctorId={data?.doctor?._id}
          doctorName={data?.doctor?.fullname}
          patientId={data?.patient?._id}
          patientName={data?.patient?.fullname}
          appointmentId={id}
          refetch={refetch}
          updateAppointmentStatus={updateAppointmentStatus}
        />
      </div>
    </main>
  );
};

export default Detail;
