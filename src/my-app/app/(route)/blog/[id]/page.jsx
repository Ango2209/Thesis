"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function BlogDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    // Fetch the blog data from the public folder
    fetch("/data/blogs.json")
      .then((response) => response.json())
      .then((data) => {
        // Find the blog by id
        const foundBlog = data.find((blog) => blog.id === parseInt(id));
        setBlog(foundBlog);
      })
      .catch((error) => console.error("Error loading blog data:", error));
  }, [id]);

  if (!blog) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{blog.title}</h1>
      <time
        dateTime={blog.date}
        className="block text-xs text-gray-500"
      >
        {new Date(blog.date).toLocaleDateString()}
      </time>

      <img
        alt={blog.title}
        src={blog.image}
        className="mt-4 h-256 w-128 object-cover rounded"
      />

      <p className="mt-4 text-gray-700">{blog.description}</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">By {blog.author}</h2>
      </div>

      <article className="mt-6 text-gray-700 whitespace-pre-line">
        {blog.content}
      </article>
    </div>
  );
}


export default BlogDetail;