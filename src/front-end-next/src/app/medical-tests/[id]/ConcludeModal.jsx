"use client";
import Attachments from "@/app/examine/[id]/result/Attachments";
import { useUpdateMedicalTestMutation, useUploadMultipleFilesMutation } from "@/state/api";
import { useState } from "react";
import { toast } from "react-toastify";

const ConcludeModal = ({ isOpen, onClose, refetch, setAttachments, attachments, id }) => {
  const [updateMedicalTest] = useUpdateMedicalTestMutation();
  const [conclude, setConclude] = useState("");
  const [uploadMultipleFiles, { isLoading: isLoadingUpload, error: isErrorUpload }] = useUploadMultipleFilesMutation();
  let isLoading = false;
  const handleSubmit = async () => {
    isLoading = true;
    if (conclude && attachments) {
      try {
        const formData = new FormData();
        for (let i = 0; i < attachments.length; i++) {
          formData.append("files", attachments[i]);
        }
        try {
          const url = await uploadMultipleFiles(formData).unwrap();
          console.log("Uploaded URLs:", url);
          await updateMedicalTest({ id: id, updateMedicalTestDto: { attachments: url, conclude: conclude } }).unwrap();
        } catch (err) {
          isLoading = false;
          console.error("Upload failed:", err);
        }
        onClose();
        isLoading = false;
        // refetch();
      } catch (err) {
        isLoading = false;
        toast.error("Failed to create medical test result. Please check your input and try again.");
        console.error("Failed to create medical test:", err);
      }
    } else {
      isLoading = false;
      toast.error("Please fill conlude & post attachments!");
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

        <h1 className="text-2xl font-semibold mb-6">Medical Test Result</h1>

        <div className="flex flex-col gap-4">
          {/* Conclude */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Conclude <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={conclude}
              onChange={(e) => setConclude(e.target.value)}
              placeholder="Conclude ..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Attachments setSelectedFiles={setAttachments} />

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition"
              onClick={() => {
                onClose();
                setConclude("");
                setAttachments(null);
              }}
            >
              Cancel
            </button>
            <button
              className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition"
              onClick={() => {
                handleSubmit();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Save..." : "Save"}
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

export default ConcludeModal;
