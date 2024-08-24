import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Image from "next/image";

const CardRecentPatient = () => {
  const { data: dashboardmetrics, isLoading } = useGetDashboardMetricsQuery();
  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Recent Patient
          </h3>
          <hr></hr>
          <div className="over-flow-auto h-full">
            {dashboardmetrics?.recentPatients.map((patient) => {
              <div
                key={patient.patientId}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/product${
                      Math.floor(Math.random() * 3) + 1
                    }.png`}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-lg w-14 h-14"
                  />
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">
                      {patient.name}
                    </div>
                    <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        {patient.phoneNumber}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs flex items-center">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  change here
                </div>
              </div>;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CardRecentPatient;
