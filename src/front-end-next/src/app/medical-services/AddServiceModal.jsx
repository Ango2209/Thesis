"use client";
import { useCreateServiceMutation } from "@/state/api";
import { useState } from "react";
import { toast } from "react-toastify";

const AddServiceModal = ({ isOpen, onClose, refetch }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [createService, { isLoading, error }] = useCreateServiceMutation();

  const handleSubmit = async () => {
    if (name && parseInt(price) > 0 && description) {
      try {
        await createService({ name, price, status: isDisabled ? "Disabled" : "Enabled", description }).unwrap();
        toast.success("Service created successfully!");
        refetch();
        setName("");
        setPrice(0);
        setDescription("");
        onClose();
      } catch (err) {
        toast.error("Failed to create service. Please check your input and try again.");
        console.error("Failed to create service:", err);
      }
    } else {
      toast.error("Please fill all required fields");
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="w-full max-w-2xl md:max-w-3xl bg-white rounded-lg shadow-lg p-6 mx-4 md:mx-8 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h1 className="text-2xl font-semibold mb-6">New Service</h1>

        <div className="flex flex-col gap-4">
          {/* Service Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write description here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Toggle Disabled */}
          <div className="flex items-center gap-2">
            <button
              className={`relative inline-flex items-center p-1 w-12 h-6 rounded-full cursor-pointer transition-colors ${isDisabled ? "bg-gray-300" : "bg-blue-500"}`}
              onClick={() => setIsDisabled(!isDisabled)}
            >
              <span aria-hidden="true" className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${isDisabled ? "translate-x-0" : "translate-x-6"}`}></span>
            </button>
            <p className="text-sm text-gray-700">{isDisabled ? "Disabled" : "Enabled"}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition"
              onClick={() => {
                onClose();
                setName("");
                setPrice(0);
                setDescription("");
              }}
            >
              Cancel
            </button>
            <button
              className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition"
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
              <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;
