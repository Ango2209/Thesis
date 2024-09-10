"use client";
import React, { useState } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/navigation";
import CreateButton from "../(components)/CreateButton/CreateButton";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

  const blogs = [
    {
      id: "656f1c6573097946a0c6cfef",
      image: "https://firebasestorage.googleapis.com/v0/b/codemacketi.appspot.com/o/57b67492-d6fa-44f4-9d26-b3562b117886.jpeg?alt=media",
      title: "5 Best Computer Science Projects",
      date: "Dec 5, 2023",
      readTime: "2min Read",
    },
    {
      id: "656f16cd4af2adfe6584487e",
      image: "https://firebasestorage.googleapis.com/v0/b/codemacketi.appspot.com/o/f9b677a5-c4ca-433f-8cb5-eb06ceeb64cb.jpeg?alt=media",
      title: "5 Coding Projects to Make You Stand Out During a Job Interview",
      date: "Dec 5, 2023",
      readTime: "3min Read",
    },
  ];

  const blogsPerPage = 6;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="container mx-auto py-2 md:py-8 px-2 xl:px-32">
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 ${activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
        >
          All blogs
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "mine" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}
          onClick={() => {
            setActiveTab("mine");
            setCurrentPage(1);
          }}
        >
          My blog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
        {blogs.map((blog) => (
          <BlogCard data={blog} />
        ))}
      </div>

      <div className="mt-8">
        <ReactPaginate
          previousLabel={"← "}
          nextLabel={" →"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"flex justify-center items-center space-x-2"}
          previousLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          nextLinkClassName={"px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-600 transition"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
          activeClassName={"bg-blue-500 text-white px-4 py-2 rounded-md"}
          pageLinkClassName={"px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"}
        />
      </div>
      <CreateButton href="/blogs/create" />
    </div>
  );
};

export default BlogList;
