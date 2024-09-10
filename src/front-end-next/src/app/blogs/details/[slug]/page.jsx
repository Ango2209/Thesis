"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const BlogDetail = ({ params }) => {
  const router = useRouter();
  const { slug } = params;
  console.log(slug);

  //   const [blog, setBlog] = useState(null);

  //   const fetchBlogDetail = async () => {
  //     const res = await fetch(`/api/blogs/${slug}`);
  //     const data = await res.json();
  //     setBlog(data);
  //   };

  //   useEffect(() => {
  //     if (slug) {
  //       fetchBlogDetail();
  //     }
  //   }, [slug]);

  const blog = {
    title: "Best SSD 2024: Top Solid-state Drives for Your Pc",
    postedAt: "2023-11-30",
    author: "Admin",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/codemacketi.appspot.com/o/1808a578-6b69-4f34-813f-322cad91fdf9.jpeg?alt=media",
    content: `
      <p>In the world of modern computing, the performance of your storage drive can make or break your overall experience. With faster read and write speeds, SSDs (Solid-state Drives) have revolutionized data storage, outperforming traditional hard drives in almost every aspect.</p>
      <h2>The Best SSDs for 2024</h2>
      <ul>
        <li>Samsung 980 Pro</li>
        <li>Western Digital Black SN850</li>
        <li>Kingston KC3000</li>
        <li>Corsair MP600 Pro XT</li>
      </ul>
      <p>Choosing the right SSD for your PC will depend on several factors, including your budget, your storage needs, and the kind of performance you're aiming for.</p>
    `,
  };

  const formattedDate = new Date(blog.postedAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 mb-2">
        <Link className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md" href="/blogs">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"></path>
          </svg>
        </Link>
      </div>
      {/* title */}
      <h1 className="font-semibold text-xl sm:text-3xl text-black sm:leading-relaxed leading-relaxed">{blog.title}</h1>

      <div className="flex sm:w-auto w-full items-center mt-4">
        <div className="w-10 text-lg h-10 text-white rounded-full bg-subDeepMain mr-4 flex-colo">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
            <path d="M13 7h-2v6h6v-2h-4z"></path>
          </svg>
        </div>
        <p className="font-light text-sm">
          Posted: (<span className="font-semibold"> {formattedDate} </span>)
        </p>
      </div>

      {/* image */}
      <figure className="sm:my-8 my-4">
        <div className="lazyload-wrapper">
          <img title={blog.title} src={blog.imageUrl} className="w-full object-cover md:h-[700px] h-auto rounded-md box-small" alt={blog.title} />
        </div>
      </figure>

      {/* Content*/}
      <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
    </div>
  );
};

export default BlogDetail;
