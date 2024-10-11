"use client";
import { useGetMedicalTestByIdQuery, useUpdateMedicalTestMutation } from "@/state/api";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateToVietnamTime } from "@/lib/dateUtils";
import ConcludeModal from "./ConcludeModal";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";

const Detail = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const { data, isError, isLoading, refetch } = useGetMedicalTestByIdQuery(id);
  const [attachments, setAttachments] = useState(null);

  const [expandedRow, setExpandedRow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateMedicalTest] = useUpdateMedicalTestMutation();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const onComplete = async () => {
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
                  await updateMedicalTest({ id: id, updateMedicalTestDto: { status: "completed" } }).unwrap();
                  toast.success("Completed medical tests");
                  router.push(`/medical-tests`);
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

  const closeModal = () => {
    setIsModalOpen(false);
    setAttachments(null);
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
            <Link className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md" href="/medical-tests">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"></path>
              </svg>
            </Link>
          </div>
          <h3 className="text-lg font-semibold">Medical Test</h3>
          <button
            type="button"
            className={`${!data?.conclude ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded focus:outline-none`}
            disabled={!data?.conclude}
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
              <div className="font-semibold bg-gray-100 border border-gray-300 p-2 rounded">Status:</div>
              <div className="bg-white border border-gray-300 p-2 rounded">
                <span className={`${getStatusClass(data?.status)} px-2 py-1 rounded-full text-sm`}>{data?.status.charAt(0).toUpperCase() + data?.status.slice(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h3 className="text-lg font-semibold mb-2">Medical Test Request Information</h3>

            <button
              onClick={openModal}
              type="button"
              className={`${data?.conclude ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded focus:outline-none`}
              disabled={data?.conclude}
            >
              Create Result
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            {/* Grid for the overall layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Doctor Request and Specialized - Less Prominent Group */}
              <div className="col-span-2">
                <div className="flex flex-col md:flex-row md:space-x-4 bg-gray-100 p-4 rounded-lg border border-gray-300">
                  {/* Doctor Request */}
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="font-semibold text-gray-600 p-2 rounded">Doctor Request:</div>
                    <div className="text-gray-700 p-2 rounded">{`${data?.doctor?.doctor_id} - ${data?.doctor?.fullname}`}</div>
                  </div>

                  {/* Specialized */}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-600 p-2 rounded">Specialized:</div>
                    <div className="text-gray-700 p-2 rounded">Data test</div>
                  </div>
                </div>
              </div>

              {/* Service - Highlighted */}
              <div className="col-span-1">
                <div className="font-semibold bg-blue-100 border border-blue-400 p-2 rounded">Service:</div>
                <div className="bg-white border border-blue-400 p-2 rounded text-blue-700 font-bold">{data?.service?.name}</div>
              </div>

              {/* Created At - Highlighted */}
              <div className="col-span-1">
                <div className="font-semibold bg-blue-100 border border-blue-400 p-2 rounded">Created At:</div>
                <div className="bg-white border border-blue-400 p-2 rounded text-blue-700 font-bold">{formatDateToVietnamTime(data?.createdAt)}</div>
              </div>

              {/* Initial Diagnosis - Highlighted */}
              <div className="col-span-1">
                <div className="font-semibold bg-blue-100 border border-blue-400 p-2 rounded">Initial Diagnosis:</div>
                <div className="bg-white border border-blue-400 p-2 rounded text-blue-700 font-bold">{data?.initialDiagnosis}</div>
              </div>

              {/* Notes - Highlighted */}
              <div className="col-span-1">
                <div className="font-semibold bg-blue-100 border border-blue-400 p-2 rounded">Notes:</div>
                <div className="bg-white border border-blue-400 p-2 rounded text-blue-700 font-bold">{data?.notes}</div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Conclude</th>
                  <th className="py-2 px-4 border-b text-center">Attachments</th>
                  <th className="py-2 px-4 border-b text-center w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                <>
                  <tr>
                    <td className="py-2 px-4 border-b">{data?.conclude ? data?.conclude : <span className="text-gray-500">No conclusion yet</span>}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <button type="button" onClick={() => setExpandedRow(!expandedRow)} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18m-7 5h7" />
                        </svg>
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b text-center w-20">
                      <button type="button" onClick={() => setExpandedRow(!expandedRow)} className="text-gray-500 hover:text-gray-700">
                        <Pencil />
                      </button>
                    </td>
                  </tr>
                  {expandedRow && (
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
              </tbody>
            </table>
          </div>
        </div>
        <ConcludeModal id={id} isOpen={isModalOpen} onClose={closeModal} setAttachments={setAttachments} attachments={attachments} refetch={refetch} />
      </div>
    </main>
  );
};

export default Detail;
