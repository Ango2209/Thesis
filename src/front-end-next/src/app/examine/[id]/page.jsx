"use client";
import { useGetAppointmentQuery, useGetMedicaRecordsQuery } from "@/state/api";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Detail = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const { data, isError, isLoading } = useGetAppointmentQuery(id);
  const { data: mrData, isError: isError2, isLoading: isLoading2 } = useGetMedicaRecordsQuery(data?.patient?._id);

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  console.log(mrData);
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
          <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50" disabled>
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
                <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-sm">In Consultation</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <h3 className="text-lg font-semibold">Medical Record</h3>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">Create a medical service request</button>
              <Link className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none" href={`/examine/${id}/result`}>
                Examination results
              </Link>
            </div>
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
                      <td className="py-2 px-4 border-b">{data.record_date}</td>
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
                                  <th className="py-2 px-4 border-b text-center">Instruction</th>
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
      </div>
    </main>
  );
};

export default Detail;
