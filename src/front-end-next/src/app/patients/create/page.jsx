"use client";
import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ImageUpload from "../../(components)/ImageUpload/ImageUpload.";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "../../../styles/customDatePicker.scss";
import { useCreatePatientMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const CreatePatientPage = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    anamesis: "",
    dateOfBirth: new Date(),
    address: "",
    gender: true,
    bloodGroup: "Unknown",
  });

  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownBgOpen, setIsDropdownBgOpen] = useState(false);

  const bloodGroups = ["Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const [createPatient, { isLoading, isSuccess, isError, error }] = useCreatePatientMutation();

  const handleBloodGroupChange = (group) => {
    setFormData((prevData) => ({
      ...prevData,
      bloodGroup: group,
    }));
    setIsDropdownBgOpen(false);
  };

  const validateField = (name, value) => {
    const newError = {};

    switch (name) {
      case "fullName":
        if (!value) {
          newError.fullName = "Full name is required";
        }
        break;

      case "phoneNumber":
        if (!value) {
          newError.phoneNumber = "Phone number is required";
        } else if (!/^\d+$/.test(value)) {
          newError.phoneNumber = "Phone number must contain only numbers";
        } else if (!/^0[3|5|7|8|9][0-9]{8}$/.test(value)) {
          newError.phoneNumber = "Phone number must be valid (e.g., 0398408935)";
        }
        break;

      case "email":
        if (!value) {
          newError.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newError.email = "Email is invalid";
        }
        break;

      case "dateOfBirth":
        if (value > new Date()) {
          newError.dateOfBirth = "Date of birth cannot be in the future";
        }
        break;

      default:
        break;
    }

    return newError;
  };

  const validateForm = () => {
    const newErrors = {
      ...validateField("fullName", formData.fullName),
      ...validateField("phoneNumber", formData.phoneNumber),
      ...validateField("email", formData.email),
      ...validateField("dateOfBirth", formData.dateOfBirth),
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => {
      const { [name]: _, ...restErrors } = prevErrors;
      return {
        ...restErrors,
        ...validateField(name, value),
      };
    });
  };

  const handleGenderChange = (gender) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: gender === "Male" ? true : false,
    }));
    setIsDropdownOpen(false);
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      dateOfBirth: date,
    }));
    setErrors((prevErrors) => {
      const { dateOfBirth: _, ...restErrors } = prevErrors;
      return {
        ...restErrors,
        ...validateField("dateOfBirth", date),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const patient = new FormData();
        patient.append("fullname", formData.fullName);
        patient.append("dob", formData.dateOfBirth.toISOString());
        patient.append("address", formData.address);
        patient.append("gender", formData.gender);
        patient.append("phone", formData.phoneNumber);
        patient.append("email", formData.email);
        patient.append("blood_group", formData.bloodGroup);
        patient.append("anamesis", formData.anamesis);
        patient.append("file", selectedFile);
        await createPatient(patient).unwrap();
        setFormData({
          fullName: "",
          phoneNumber: "",
          email: "",
          anamesis: "",
          dateOfBirth: new Date(),
          address: "",
          gender: true,
          bloodGroup: "Unknown",
        });
        setSelectedFile(null);
        toast.success("Patient created successfully!");
        router.push("/patients");
      } catch (error) {
        toast.error("Failed to create patient. Please check your input and try again.");
        console.error("Failed to create patient", error);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Create Patient</title>
        <meta name="description" content="Create a new patient record" />
      </Head>
      <div className="xs:px-8 px-2">
        <div className="flex items-center gap-4 mb-8">
          <Link className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md" href="/patients">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"></path>
            </svg>
          </Link>
          <h1 className="text-xl font-semibold">Create Patient</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white my-8 rounded-xl border border-border p-6">
          <div className="flex flex-col gap-4">
            <label className="text-black text-sm">Profile Image</label>
            <ImageUpload setSelectedFile={setSelectedFile} />
            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            <div className="text-sm w-full">
              <label className="text-black text-sm">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full bg-transparent text-sm mt-3 p-4 border ${errors.fullName ? "border-red-500" : "border-border"} font-light rounded-lg focus:border focus:border-subMain`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div className="text-sm w-full">
              <label className="text-black text-sm">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full bg-transparent text-sm mt-3 p-4 border ${errors.phoneNumber ? "border-red-500" : "border-border"} font-light rounded-lg focus:border focus:border-subMain`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="text-sm w-full">
              <label className="text-black text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-transparent text-sm mt-3 p-4 border ${errors.email ? "border-red-500" : "border-border"} font-light rounded-lg focus:border focus:border-subMain`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="flex w-full flex-col gap-3">
              <p className="text-black text-sm">Gender</p>
              <div className="relative w-full">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {formData.gender ? "Male" : "Female"}
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
                  </svg>
                </button>
                {isDropdownOpen && (
                  <ul className="absolute left-0 w-full bg-white rounded-md shadow-lg py-4 px-6 ring-1 ring-border z-50">
                    <li className="cursor-pointer text-xs hover:text-subMain" onClick={() => handleGenderChange("Male")}>
                      Male
                    </li>
                    <li className="cursor-pointer text-xs hover:text-subMain" onClick={() => handleGenderChange("Female")}>
                      Female
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div className="text-sm w-full">
              <label className="text-black text-sm">Anamesis</label>
              <input
                type="text"
                name="anamesis"
                value={formData.anamesis}
                onChange={handleChange}
                className="w-full bg-transparent text-sm mt-3 p-4 border border-border font-light rounded-lg focus:border focus:border-subMain"
              />
            </div>

            <div className="flex w-full flex-col gap-3">
              <p className="text-black text-sm">Blood Group</p>
              <div className="relative w-full">
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain"
                  onClick={() => setIsDropdownBgOpen(!isDropdownBgOpen)}
                >
                  {formData.bloodGroup}
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
                  </svg>
                </button>
                {isDropdownBgOpen && (
                  <ul className="absolute left-0 w-full bg-white rounded-md shadow-lg py-4 px-6 ring-1 ring-border z-50">
                    {bloodGroups.map((group) => (
                      <li key={group} className="cursor-pointer text-xs hover:text-subMain" onClick={() => handleBloodGroupChange(group)}>
                        {group}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="text-sm w-full">
              <label className="text-black text-sm">Date of Birth</label>
              <DatePicker
                onChange={handleDateChange}
                value={formData.dateOfBirth}
                format="MM/dd/yyyy"
                className={`w-full bg-transparent text-sm p-4 border font-light rounded-lg focus:border focus:border-subMain ${errors.dateOfBirth ? "border-red-500" : "border-border"}`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
            </div>

            <div className="text-sm w-full">
              <label className="text-black text-sm">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-transparent text-sm mt-3 p-4 border border-border font-light rounded-lg focus:border focus:border-subMain"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button className="w-full flex items-center justify-center gap-4 bg-sub-main text-white text-sm font-medium px-2 py-4 rounded hover:opacity-80 transition">
                Delete Account
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-white text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8ZM6 10V20H18V10H6ZM9 12H11V18H9V12ZM13 12H15V18H13V12ZM7 5V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V5H22V7H2V5H7ZM9 4V5H15V4H9Z"></path>
                </svg>
              </button>
              <button className="w-full flex items-center justify-center gap-4 bg-sub-main text-white text-sm font-medium px-2 py-4 rounded hover:opacity-80 transition" disabled={isLoading}>
                {isLoading ? "Creating..." : "Save"}
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="text-white text-xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePatientPage;
