"use client";

import { useRouter } from "next/navigation";
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

function BlogDetail({ params }) {
  const { id } = params;
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{blogs[id - 1].title}</h1>
      <time
        datetime={blogs[id - 1].date}
        className="block text-xs text-gray-500"
      >
        {new Date(blogs[id - 1].date).toLocaleDateString()}
      </time>

      <img
        alt=""
        src={blogs[id - 1].image}
        className="mt-4 h-64 w-full object-cover"
      />

      <p className="mt-4 text-gray-700">{blogs[id - 1].description}</p>
    </div>
  );
}

export default BlogDetail;
