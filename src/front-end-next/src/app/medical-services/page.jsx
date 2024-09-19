// pages/services.js
"use client";
import { useState } from "react";
import AddServiceModal from "./AddServiceModal";
import { useGetAllServicesQuery } from "@/state/api";

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const { data: services, refetch, isLoading, error } = useGetAllServicesQuery();

  const filteredServices = services?.filter((service) => selectedFilter === "All" || service.status === selectedFilter);

  return (
    <div className="px-4 pt-6">
      {/* Floating Button */}
      <button onClick={openModal} className="fixed bottom-8 right-12 z-50 w-16 h-16 flex items-center justify-center bg-sub-main text-white rounded-full shadow-button-fb animate-bounce">
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
        </svg>
      </button>

      {/* Page Header */}
      <h1 className="text-xl font-semibold mb-4">Services</h1>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
          {/* Search Input */}
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder="Search 'teeth cleaning'"
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Filter Dropdown */}
            <div className="relative w-full">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isFilterOpen}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between text-main text-sm p-4 border bg-dry border-border font-light rounded-lg"
              >
                {selectedFilter}
                <svg className="text-xl" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
                </svg>
              </button>
              {isFilterOpen && (
                <ul className="absolute z-10 mt-2 w-full bg-white border border-border rounded-lg shadow-lg">
                  <li
                    className="cursor-pointer px-4 py-2 hover:bg-greyed"
                    onClick={() => {
                      setSelectedFilter("All");
                      setIsFilterOpen(false);
                    }}
                  >
                    All
                  </li>
                  <li
                    className="cursor-pointer px-4 py-2 hover:bg-greyed"
                    onClick={() => {
                      setSelectedFilter("Enabled");
                      setIsFilterOpen(false);
                    }}
                  >
                    Enabled
                  </li>
                  <li
                    className="cursor-pointer px-4 py-2 hover:bg-greyed"
                    onClick={() => {
                      setSelectedFilter("Disabled");
                      setIsFilterOpen(false);
                    }}
                  >
                    Disabled
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 w-full overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="bg-gray-100 rounded-md overflow-hidden">
              <tr>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Name</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Created At</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Price (Tsh)</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Status</th>
                <th className="text-start text-sm font-medium py-3 px-2 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices?.map((service, index) => (
                <tr key={index} className="border-b border-border hover:bg-greyed transitions">
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap">
                    <h4 className="text-sm font-medium">{service.name}</h4>
                  </td>
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap">{service.createdAt}</td>
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap font-semibold">{service.price}</td>
                  <td className="text-start text-sm py-4 px-2 whitespace-nowrap">
                    <span className={`text-xs font-medium ${service.status === "Enabled" ? "text-green-600" : "text-red-600"}`}>{service.status}</span>
                  </td>
                  <td className="py-2 relative">
                    <button type="button" onClick={() => toggleDropdown(index)} className="relative text-gray-600 hover:text-gray-800 focus:outline-none">
                      <div className="bg-dry border text-main text-xl py-2 px-4 rounded-lg">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                        </svg>
                      </div>

                      {/* Dropdown Menu */}
                      <div className={`absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg ${openDropdown === index ? "block" : "hidden"} z-50`}>
                        <ul>
                          <li className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm">Edit</li>
                          <li className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-sm">Delete</li>
                        </ul>
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddServiceModal isOpen={isModalOpen} onClose={closeModal} refetch={refetch} />
    </div>
  );
};

export default Services;
