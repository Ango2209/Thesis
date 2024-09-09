import React from "react";
import Link from "next/link";

const CreateButton = ({ href = "/" }) => {
  return (
    <Link href={href} className="fixed bottom-8 right-12 z-50 w-16 h-16 flex items-center justify-center bg-sub-main text-white rounded-full shadow-button-fb animate-bounce">
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-2xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
      </svg>
    </Link>
  );
};

export default CreateButton;
