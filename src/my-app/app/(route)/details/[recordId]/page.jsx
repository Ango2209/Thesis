import React from "react";
import DoctorDetail from "../_components/DoctorDetail";
import DoctorSuggestionList from "../_components/DoctorSuggestionList";

function Details({ params }) {
  const { recordId } = params;

  return (
    <div className="p-5 md:px-20">
      <h2 className="font-bold text-[22px]">Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Doctor Detail*/}
        <div className="col-span-3">
          <DoctorDetail recordId={recordId} />
        </div>
        <div>
          <DoctorSuggestionList />
        </div>
      </div>
    </div>
  );
}

export default Details;
