"use client";
import {
  useCheckMedicinesAvailabilityMutation,
  useGetAppointmentsByStatusAndDateQuery,
  useGetPrescriptionsByDateQuery,
  useUnlockMedicinesMutation,
  useUpdateAppointmentStatusMutation,
} from "@/state/api";
import { Eye, CircleX } from "lucide-react";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import MedicineTable from "./PrescriptionDetail";
import SellMedicineModal from "./SellMedicineModal";
import QrCodeModal from "./QrCodeModal";

const SellMedicine = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [record, setRecord] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkMedicinesAvailability, { isLoading: isLoadingCheck }] = useCheckMedicinesAvailabilityMutation();
  const [medicines, setMedicines] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [unlockMedicines, { isLoading: isLoadingUnLock }] = useUnlockMedicinesMutation();

  const [isOpenQrCodeModal, setIsOpenQrCodeModal] = useState(false);
  const openQrCodeModal = () => setIsOpenQrCodeModal(true);
  const closeQrCodeModal = () => setIsOpenQrCodeModal(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, refetch, isLoading, isError } = useGetPrescriptionsByDateQuery({
    date: selectedDate,
    page: currentPage,
    limit: 10,
  });

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  };

  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];
    setSelectedDate(tomorrowDate);
  };

  const onPrescribe = async () => {
    const medicinesToCheck = record?.prescriptions.map((med) => ({
      medicineId: med.medicineId,
      quantityToUse: med.quantity,
      dosage: med.dosage,
      instraction: med.instraction,
    }));

    const data = await checkMedicinesAvailability(medicinesToCheck).unwrap();

    if (data.unavailable.length > 0) {
      const unavailableMedicines = data.unavailable.map((med) => `- ${med.name}: Available ${med.availableQuantity || 0}, Required ${med.quantityToUse}`).join("\n");

      // Hiển thị toast xác nhận người dùng
      toast.info(
        <div className="space-y-4">
          <p className="text-lg font-semibold">The following medicines are not available in sufficient quantity:</p>
          <pre className="bg-gray-100 p-2 rounded-md whitespace-pre-wrap">{unavailableMedicines}</pre>
          <p>Do you want to continue with the available medicines only?</p>
          <div className="flex justify-end space-x-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600" onClick={() => handleConfirm(true, data)}>
              Yes
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" onClick={() => handleConfirm(false)}>
              No
            </button>
          </div>
        </div>,
        {
          autoClose: false,
          closeOnClick: false,
        }
      );
      return;
    }
    setMedicines(data.available);
    openModal();
  };

  const handleConfirm = (confirmed, data) => {
    if (confirmed) {
      setMedicines(data.available);
      openModal();
    }
    toast.dismiss();
  };

  const handleViewDetail = (record) => {
    setRecord(record);
    setSelectedRowId(record.record_id);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-4">
          <h3 className="text-xl font-semibold mb-4 lg:mb-0">Prescriptions List</h3>
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex space-x-2">
              <button onClick={handleToday} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none">
                Today
              </button>
              <button onClick={handleTomorrow} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">
                Tomorrow
              </button>
            </div>
            <input type="date" value={selectedDate} onChange={handleDateChange} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* Cột Trái: Bảng */}
        <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 border-r text-center w-12">#</th>
                <th className="px-2 py-2 border-r text-left">Patient</th>
                <th className="px-2 py-2 border-r text-left">Doctor prescribes</th>
                <th className="px-2 py-2 text-center w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Error loading data
                  </td>
                </tr>
              )}
              {data?.data?.map((prescription, index) => (
                <tr className={`border-b ${selectedRowId === prescription.record_id ? "bg-blue-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <td className="px-2 py-2 text-center">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="px-2 py-2">
                    <div className="text-sm">
                      <p className="font-semibold">{prescription.patient.patient_id}</p>
                      <p className="font-semibold">{prescription.patient.fullname}</p>
                      <a href={`tel:${prescription.patient.phone}`} className="text-blue-500">
                        {prescription.patient.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-sm">
                      <p className="font-semibold">{prescription.doctor?.doctor_id}</p>
                      <p className="font-semibold">{prescription.doctor?.fullname}</p>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <div className="relative group">
                        <button
                          onClick={() => {
                            handleViewDetail(prescription);
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          <Eye />
                        </button>
                        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-2 bg-gray-700 text-white text-sm rounded hidden group-hover:block">View</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 shadow rounded-lg p-4 border border-gray-200 flex flex-col justify-between h-full">
          <div>
            <h2 className="text-xl font-semibold mb-4">Prescription Detail</h2>
            <MedicineTable record={record} />
          </div>

          {/* Nút ở góc dưới bên phải */}
          <div className="flex justify-end mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition" onClick={() => onPrescribe()}>
              Prescribe
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <ReactPaginate
          previousLabel={"← "}
          nextLabel={" →"}
          pageCount={data?.totalPages}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center items-center space-x-2"}
          previousLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          nextLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-500 text-white py-2 rounded-md"}
          pageLinkClassName={"px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"}
        />
      </div>
      <SellMedicineModal
        isOpen={isModalOpen}
        onClose={closeModal}
        record={record}
        medicines={medicines}
        setMedicines={setMedicines}
        openQrCodeModal={openQrCodeModal}
        setInvoice={setInvoice}
      ></SellMedicineModal>
      {isOpenQrCodeModal ? <QrCodeModal unlockMedicines={unlockMedicines} isOpen={isOpenQrCodeModal} onClose={closeQrCodeModal} invoice={invoice} /> : ""}
    </div>
  );
};

export default SellMedicine;
