"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";
import styles from "../../../styles/blog.module.scss";
import { useCreateBlogMutation, useUploadImagesMutation } from "@/state/api";
import Spinner from "../../(components)/Spinner";
import ImageUpload from "../../(components)/ImageUpload/ImageUpload.";
import Link from "next/link";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const Blog = () => {
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([
    {
      name: "Preventive Dentistry",
      slug: "preventive-dentistry",
    },
    {
      name: "Restorative Dentistry",
      slug: "restorative-dentistry",
    },
    {
      name: "Cosmetic Dentistry",
      slug: "cosmetic-dentistry",
    },
    {
      name: "Orthodontics",
      slug: "orthodontics",
    },
    {
      name: "Periodontics",
      slug: "periodontics",
    },
    {
      name: "Oral Surgery",
      slug: "oral-surgery",
    },
    {
      name: "Pediatric Dentistry",
      slug: "pediatric-dentistry",
    },
    {
      name: "Prosthodontics",
      slug: "prosthodontics",
    },
    {
      name: "Endodontics",
      slug: "endodontics",
    },
    {
      name: "Oral Medicine",
      slug: "oral-medicine",
    },
    {
      name: "Geriatric Dentistry",
      slug: "geriatric-dentistry",
    },
    {
      name: "Holistic Dentistry",
      slug: "holistic-dentistry",
    },
    {
      name: "Sedation Dentistry",
      slug: "sedation-dentistry",
    },
    {
      name: "Dental Public Health",
      slug: "dental-public-health",
    },
  ]);
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState({});

  const [createBlog, { isLoading, error }] = useCreateBlogMutation();
  const [uploadImages, { data, upError = error, isLoadingUpload = isLoading }] = useUploadImagesMutation();

  function generateSlug(title) {
    const slug = title
      .toLowerCase() // Convert the title to lowercase
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/[^\w\-]+/g, "") // Remove non-word characters except dashes
      .replace(/\-\-+/g, "-") // Replace multiple consecutive dashes with a single dash
      .replace(/^\-+/, "") // Remove dashes from the beginning
      .replace(/\-+$/, ""); // Remove dashes from the end
    return slug;
  }

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!slug.trim()) newErrors.slug = "Slug is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!content.trim()) newErrors.content = "Content is required";
    if (selectedCategories.length === 0) newErrors.selectedCategories = "At least one category must be selected";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function uploadImagesInContent(content) {
    const base64Images = content.match(/data:image\/[a-zA-Z]+;base64,[^\s"]+/g) || [];

    if (base64Images.length === 0) {
      return { base64Images, imageUrls: null };
    }

    try {
      const imageUrls = await uploadImages(base64Images).unwrap();
      return { base64Images, imageUrls };
    } catch (error) {
      console.error("Error uploading images:", error);
      return { base64Images, imageUrls: null };
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (validate()) {
      // replace content
      const { base64Images, imageUrls } = await uploadImagesInContent(content);
      let updatedContent = content;
      if (base64Images.length > 0) {
        base64Images.forEach((base64Image, index) => {
          updatedContent = updatedContent.replace(base64Image, imageUrls[index]);
        });
      }
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("content", updatedContent);
      formData.append("categories", JSON.stringify(selectedCategories));
      formData.append("isVisible", isPublic);
      formData.append("authorObjid", "66c326e038ca0fcd63974456");
      formData.append("authorModel", "Doctor");
      if (file) {
        formData.append("file", file);
      }
      try {
        await createBlog(formData).unwrap();
        alert("Blog created successfully!");
      } catch (err) {
        console.error("Failed to create blog:", err);
        alert("Failed to create blog");
      }
    }
  }

  const handleCategoryChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCategories(value);
    if (value.length > 0) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.selectedCategories;
        return newErrors;
      });
    }
  };

  function handleTitle(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
    if (newTitle.trim()) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.title;
        delete newErrors.slug;
        return newErrors;
      });
    }
  }

  const handleChange = (setter) => (e) => {
    setter(e.target.value);

    if (e.target.value.trim()) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (e.target.value.trim()) delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleContent = (value) => {
    setContent(value);

    if (value.trim()) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  //Custom Tool Bar
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "color", "image"],
      [{ "code-block": true }],
      ["clean"],
    ],
  };
  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "indent", "image", "code-block", "color"];
  return (
    <div>
      <div className="flex items-center gap-4 mb-2">
        <Link className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md" href="/blogs">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"></path>
          </svg>
        </Link>
        <h1 className="text-xl font-semibold">Create Blog</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 p-2 gap-4">
        {/* Blog Editor */}
        <div className="w-full max-w-3xl p-5 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
          <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5 ">Blog Editor</h2>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {/* Title */}
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
                  Blog Title
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleTitle}
                    type="text"
                    value={title}
                    name="title"
                    id="title"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Type the Course title"
                  />
                  {errors.title && <p className="text-red-500">{errors.title}</p>}
                </div>
              </div>
              {/* Slug */}
              <div className="sm:col-span-2">
                <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
                  Blog Slug
                </label>
                <div className="mt-2">
                  <input
                    onChange={handleChange(setSlug)}
                    type="text"
                    value={slug}
                    name="slug"
                    id="slug"
                    autoComplete="slug"
                    className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                    placeholder="Type the Course title"
                  />
                  {errors.slug && <p className="text-red-500">{errors.slug}</p>}
                </div>
              </div>
              {/* ImageSelector */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">Image Description</label>
                <ImageUpload setSelectedFile={setFile} />
              </div>
              {/* Description */}
              <div className="sm:col-span-2">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Blog Description
                </label>
                <textarea
                  id="description"
                  rows="4"
                  name="description"
                  onChange={handleChange(setDescription)}
                  value={description}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 "
                  placeholder="Write your thoughts here..."
                ></textarea>
                {errors.description && <p className="text-red-500">{errors.description}</p>}
              </div>
              {/* Categories */}
              <div className="sm:col-span-2">
                <label htmlFor="categories" className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">
                  Categories
                </label>
                <select id="categories" multiple value={selectedCategories} onChange={handleCategoryChange} className="block mt-1 w-full border border-gray-300 rounded-md">
                  {categories.map((category) => (
                    <option key={category.slug} value={JSON.stringify(category)}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.selectedCategories && <p className="text-red-500">{errors.selectedCategories}</p>}
              </div>
              {/* Content */}
              <div className="sm:col-span-2">
                <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Blog Content
                </label>
                <ReactQuill theme="snow" value={content} onChange={handleContent} modules={modules} formats={formats} />
                {errors.content && <p className="text-red-500">{errors.content}</p>}
              </div>
            </div>
            {/* visible */}
            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input id="visibility" type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} className="form-checkbox h-4 w-4 text-purple-600" />
                <label htmlFor="visibility" className="ml-2 text-sm font-medium text-gray-900">
                  {isPublic ? "Public" : "Private"}
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 hover:bg-purple-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span>Create Blog Post</span>
            </button>
          </form>
        </div>

        {/* Blog View */}
        <div className={`${styles.blogview}  w-full max-w-3xl p-8 my-6 bg-white border border-gray-200 rounded-lg shadow mx-auto`}>
          <h2 className="text-3xl font-bold border-b border-gray-400 pb-2 mb-5 ">Preview</h2>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Title */}
            <div className="sm:col-span-2">
              <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">Blog Title</h2>
              <div className="mt-2">
                <p className="text-2xl font-bold">{title}</p>
              </div>
            </div>
            {/* Slug */}
            <div className="sm:col-span-2">
              <h2 className="block text-sm font-medium leading-6 text-gray-900 mb-2 ">Blog Slug</h2>
              <div className="mt-2">
                <p>{slug}</p>
              </div>
            </div>
            {/* Description */}
            <div className="sm:col-span-2">
              <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog Description</h2>
              <p>{description}</p>
            </div>
            <div className="sm:col-span-full">
              <h2 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Blog Content</h2>
              {parse(content)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
