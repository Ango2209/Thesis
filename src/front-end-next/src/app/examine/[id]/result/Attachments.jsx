"use client";
import React, { useState, useRef } from "react";

const Attachments = ({ setSelectedFiles }) => {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validFormats = ["image/jpeg", "image/png", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    processFiles(selectedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setSelectedFiles(newFiles);
  };

  const processFiles = (files) => {
    const validFiles = files.filter((file) => validFormats.includes(file.type));
    if (validFiles.length === 0) {
      setError("Invalid file type. Only JPEG, PNG, PDF, and Word documents are allowed.");
      return;
    }

    setFiles((prevFiles) => {
      const allFiles = [...prevFiles, ...validFiles];
      setSelectedFiles(allFiles);
      setError(null);
      return allFiles;
    });
  };

  return (
    <div className="relative w-full">
      <p className="text-black text-sm font-medium">Attachments</p>
      <div className="mb-4">
        <div className="flex flex-wrap gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative mb-2 p-2 border rounded bg-white shadow w-32 h-32 flex items-center justify-center">
              {file.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 rounded p-2">
                  <svg
                    className="text-gray-600 h-12 w-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {file.type === "application/pdf" ? <path d="M12 8v4M12 12v4M16 12v4m-4-4h8M6 12v4m4-4H2m4-4h4m4 0h4m4 0h4m4 0h4"></path> : <path d="M5 3v18l14-9L5 3z"></path>}
                  </svg>
                  <span className="text-gray-600 text-xs text-center">{file.name}</span>
                </div>
              )}
              <button
                type="button"
                className="absolute top-0 right-0 bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-red-400"
                onClick={() => handleRemoveFile(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Drag-and-drop area */}
      <div
        className={`px-6 pt-5 pb-6 border-2 ${dragOver ? "border-blue-500" : "border-dashed"} rounded-md cursor-pointer flex flex-col items-center justify-center`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".jpeg, .png, .jpg, .pdf, .doc, .docx" multiple />
        <span className="flex items-center justify-center mb-2">
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-3xl text-subMain"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 16 12 12 8 16"></polyline>
            <line x1="12" y1="12" x2="12" y2="21"></line>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
          </svg>
        </span>
        <p className="text-sm text-center">Drag your files here or click to select</p>
        <em className="text-xs text-gray-400 text-center">(Only *.jpeg, *.png, *.jpg, *.pdf, *.doc, and *.docx files will be accepted)</em>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Attachments;
