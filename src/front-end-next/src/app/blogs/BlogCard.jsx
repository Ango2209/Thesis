import React from "react";
import Link from "next/link";

const BlogCard = ({ data }) => {

  return (
    <Link className="bg-white shadow rounded-md p-4 hover:shadow-xl transition" href={`/blogs/details/${data.id}`} key={data.id} passHref>
      <div>
        <img src={data.image} alt={data.title} className="w-full h-60 object-cover rounded-md" />
      </div>
      <div className="space-y-3 mt-4">
        <span className="px-4 py-2 rounded text-main bg-lightMain border border-gray-100 font-medium text-xs">{data.date}</span>
        <h1 className="text-lg font-medium text-text">{data.title}</h1>
        <div className="flex justify-between">
          <button className="px-8 py-3 rounded hover:text-subDeepMain text-white bg-subDeepMain border hover:bg-transparent border-subDeepMain font-medium text-xs transition">Read More</button>
          <div className="flex items-center space-x-2">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-gray-400" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
              <path d="M13 7h-2v6h6v-2h-4z"></path>
            </svg>
            <span className="text-gray-400 text-xs">{data.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
