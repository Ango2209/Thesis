import React,{useState, useEffect} from "react";
import { useGetBlogsQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function BlogList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState(null);
  useEffect(() => {
    // Fetch the blog data from the public folder
    fetch("/data/blogs.json")
      .then((response) => response.json())
      .then((data) => {
        setBlogs(data);
      })
      .catch((error) => console.error("Error loading blog data:", error));
  }, []);

  return (
    <>
      <div className="mb-10 px-4 sm:px-8 md:px-16 lg:px-24">
        <h2 className="font-bold text-xl">Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-7 mt-4"> */}
          {blogs?.map((blog, index) => (
            <button key={index} onClick={() => router.push(`/blog/${blog.id}`)}>
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
