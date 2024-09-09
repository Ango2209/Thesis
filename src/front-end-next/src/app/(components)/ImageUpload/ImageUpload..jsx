"use client";
import React, { useState, useRef } from "react";

const ImageUpload = ({ setSelectedFile }) => {
  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validFormats = ["image/jpeg", "image/png"];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (validFormats.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          setError(null);
          setSelectedFile(file);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Invalid file type. Only JPEG and PNG images are allowed.");
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      if (validFormats.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
          setError(null);
          setSelectedFile(file);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Invalid file type. Only JPEG and PNG images are allowed.");
      }
    }
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

  const handleRemoveImage = () => {
    setImage(null);
    setSelectedFile(null);
  };

  return (
    <div className="flex gap-3 flex-col w-full">
      {/* <p className="text-sm">Profile Image</p> */}
      <div className="w-full text-center grid grid-cols-12 gap-4">
        <div
          className={`px-6 lg:col-span-10 sm:col-span-8 col-span-12 pt-5 pb-6 border-2 ${dragOver ? "border-blue-500" : "border-dashed"} rounded-md cursor-pointer`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept=".jpeg, .png, .jpg" />
          <span className="mx-auto flex justify-center">
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
          <p className="text-sm mt-2">Drag your image here or click to select</p>
          <em className="text-xs text-gray-400">(Only *.jpeg and *.png images will be accepted)</em>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="lg:col-span-2 sm:col-span-4 col-span-12 h-32 relative">
          <img src={image || "http://placehold.it/300x300"} alt="preview" className="w-full h-full object-contain rounded" />
          {image ? (
            <button
              type="button"
              className="absolute top-0 right-0 bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-red-400"
              onClick={handleRemoveImage}
            >
              X
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
