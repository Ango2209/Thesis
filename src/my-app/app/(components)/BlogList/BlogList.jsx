import React from "react";
import { useGetBlogsQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function BlogList() {
  const router = useRouter();
  const blogs = [
    {
      id: 1,
      title: "How to position your furniture for positivity",
      date: "2022-10-10",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 2,
      title: "The benefits of a minimalist lifestyle",
      date: "2022-10-11",
      description: "Explore the advantages of living with less.",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080",
    },
    {
      id: 3,
      title: "10 tips for a productive home office",
      date: "2022-10-12",
      description: "Maximize your productivity with these simple tips.",
      image:
        "https://images.unsplash.com/photo-1588702547927-4c8b8c1c1c1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&w=1080",
    },
  ];

  return (
    <>
      <div className="mb-10 px-4 sm:px-8 md:px-16 lg:px-24">
        <h2 className="font-bold text-xl">Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-4"> */}
          {blogs.map((blog) => (
            <button onClick={() => router.push(`/blog/${blog.id}`)}>
              <article
                key={blog.id}
                className="overflow-hidden rounded-lg shadow transition hover:shadow-lg"
              >
                <img
                  alt=""
                  src={blog.image}
                  className="h-56 w-full object-cover"
                />
                <div className="bg-white p-4 sm:p-6">
                  <time
                    datetime={blog.date}
                    className="block text-xs text-gray-500"
                  >
                    {new Date(blog.date).toLocaleDateString()}
                  </time>
                  <h3 className="mt-0.5 text-lg text-gray-900">{blog.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                    {blog.description}
                  </p>
                </div>
              </article>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default BlogList;
