// src/appp/components/InputField/index.jsx
import React from "react";

const InputField = ({ label, placeholder, readOnly = false }) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-600 text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full p-3 transition duration-200 ease-in-out border ${
          readOnly
            ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:shadow-md"
        } rounded-lg`}
      />
    </div>
  );
};

export default InputField;
