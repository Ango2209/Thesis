import React, { useState } from "react";

const ImageSelector = ({ setFile }) => {
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");

  const openImageSelector = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const url = reader.result;
          setFeaturedImageUrl(url);
          setFile(file);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const clearImage = () => {
    setFeaturedImageUrl("");
    setFile(null);
  };

  return (
    <div className="mt-3">
      <label className="form-label" htmlFor="featuredImageUrl">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">Image Description</label>
        <button
          type="button"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={openImageSelector}
        >
          Select Image
        </button>
      </label>

      {featuredImageUrl && (
        <div className="relative inline-block mt-2">
          <img src={featuredImageUrl} alt="Featured" className="w-full h-auto rounded-md" />
          <button type="button" className="absolute top-0 right-0 bg-gray-300 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-red-300" onClick={clearImage}>
            X
          </button>
        </div>
      )}

      <input type="image" id="featuredImageUrl" name="featuredImageUrl" className="form-control" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} />
    </div>
  );
};

export default ImageSelector;
