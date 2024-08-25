"use client";
// src/setting/settings.js
import React, { useState } from "react";
import InputField from "../(components)/InputField";

const Settings = () => {
  const [isChangePassword, setIsChangePassword] = useState(false);
  return (
    <div className=" flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-md flex w-full max-w-8xl ">
        {/* Left Side - Profile Info */}
        <div className="w-1/3 p-6 flex flex-col items-center border-r">
          <img
            src="https://i.pravatar.cc/150"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold">Dr. Nguyen Van Ngo</h2>
          <p className="text-gray-500">Anhngole11054@gmail.com</p>
          <p className="text-gray-500">+254 712 345 678</p>
          <div className="mt-6 w-full">
            <button
              className={`w-full hover:bg-green-500 bg-gray-100 text-black-500 p-2 rounded-lg mb-4 ${
                !isChangePassword ? "bg-green-500 text-white" : "text-gray-700"
              }`}
              onClick={() => setIsChangePassword(false)}
            >
              Personal Information
            </button>
            <button
              className={`w-full hover:bg-green-500 bg-gray-100 text-black-500 p-2 rounded-lg ${
                isChangePassword ? "bg-green-500 text-white" : "text-gray-700"
              }`}
              onClick={() => setIsChangePassword(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        {!isChangePassword ? (
          <div className="w-2/3 p-6">
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Profile Image
                </label>
                <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-24 mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Drag your image here"
                    className="text-gray-400"
                  />
                </div>
                <p className="text-gray-400 text-xs">
                  Only *.jpeg and *.png images will be accepted
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <InputField label="Title" placeholder="Dr." readOnly />
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Phone Number"
                  placeholder="Enter your phone number"
                />
                <InputField label="Email" placeholder="Enter your email" />
              </div>

              <div className="flex justify-between">
                <button className="bg-red-500 text-white p-2 rounded-lg flex items-center">
                  <span className="material-icons mr-2"></span>
                  Delete Account
                </button>
                <button className="bg-green-500 text-white p-2 rounded-lg flex items-center">
                  <span className="material-icons mr-2"></span>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-2/3 p-6">
            <form>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Old Password"
                  placeholder="Enter old password"
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <InputField
                  label="New Password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <InputField
                  label="Confirm Password"
                  placeholder="Enter confirm password"
                />
              </div>
              <button className="bg-green-500 text-white p-2 rounded-lg flex items-center">
                <span className="material-icons mr-2"></span>
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
