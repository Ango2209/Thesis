// pages/services.js
"use client";
import { useState } from "react";
import AddServiceModal from "./AddServiceModal";
import { useGetAllServicesQuery } from "@/state/api";
import { DollarSign } from "lucide-react";
import { formatDateToVietnamTime } from "@/lib/dateUtils";
import ReactPaginate from "react-paginate";

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const { data: services, refetch, isLoading, error } = useGetAllServicesQuery();

  const filteredServices = services?.filter((service) => selectedFilter === "All" || service.status === selectedFilter);

  return (
    <div className="px-4 pt-6">
      {/* Page Header */}
      <h1 className="text-xl font-semibold mb-4">Payment</h1>

      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Search Input */}
          <div className="min-w-[200px]">
            <input
              type="text"
              placeholder="Search ..."
              className="h-12 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date and Buttons */}
          <div className="flex items-center space-x-4">
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

        {/* Table */}
        <div className="mt-8 w-full overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-100 rounded-md overflow-hidden">
              <tr>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">#</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Patient</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Service Name</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Created At</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Price</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Status</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices?.map((service, index) => (
                <tr key={index} className="border-b border-border hover:bg-greyed transitions">
                  <td className="px-4 py-2 text-start">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="px-4 py-2">
                    <div className="text-sm">
                      <p className="font-semibold">AC</p>
                      <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                      <a href={`tel:0988787887`} className="text-blue-500">
                        09098989898
                      </a>
                    </div>
                  </td>
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap">
                    <h4 className="text-sm font-medium">{service.name}</h4>
                  </td>
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap">{service.createdAt}</td>
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap font-semibold">{service.price}</td>
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap">
                    <span className={`text-xs font-medium ${service.status === "Enabled" ? "text-green-600" : "text-red-600"}`}>{service.status}</span>
                  </td>
                  <td className="py-2">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={openModal}
                        className="bg-blue-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none flex items-center space-x-2"
                      >
                        <DollarSign  className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <ReactPaginate
          previousLabel={"← "}
          nextLabel={" →"}
          pageCount={10}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center items-center space-x-2"}
          previousLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          nextLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-500 text-white py-2 rounded-md"}
          pageLinkClassName={"px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"}
        />
      </div>
      <AddServiceModal isOpen={isModalOpen} onClose={closeModal} refetch={refetch} />
    </div>
  );
};

export default Payments;