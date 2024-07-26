// App.tsx
import React, { useState } from "react";
import "./App.css";
import TrackDataForm from "./components/TrackDataForm";
import ConvoyForm from "./components/ConvoyForm";
import { MdRoute } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";
import { Trip } from "./components/TripData";
import { Track } from "./components/TrackData";
import TripsDataForm from "./components/TripDataForm";
import { FormProvider, useFormContext } from "./context/FormContext";

import CombinedDataForm from "./components/CombinedDataForm";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("EndPointCreation");
  const [tripData, setTripData] = useState<any>({
    tripDataMapper: Trip,
    tripDataAddOnFields: {},
  });
  const [trackData, setTrackData] = useState<any>({
    trackDataMapper: Track,
    trackDataAddOnFields: {},
  });
  const [responseData, setResponseData] = useState(null);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleTripSubmit = (data: any) => {
    setTripData(data);
    console.log("Trip Form Data:", data);
  };

  const handleTrackSubmit = (data: any) => {
    setTrackData(data);
    console.log("Track Form Data:", data);
  };

  const handleCombinedSubmit = (data: any) => {
    console.log("Combined Form Data:", data);
  };

  const handleSaveConfiguration = () => {
    const { tripFormValues, trackFormValues, combinedValues } =
      useFormContext();
    console.log("Trip Form Data:", tripFormValues);
    console.log("Track Form Data:", trackFormValues);
    console.log("Combiled Data:", combinedValues);
  };

  return (
    <FormProvider>
      {/*  <ToastContainer /> */}
      <div className="rounded flex">
        <ul className="flex-column space-y space-y-4 text-sm font-medium w-[200px] text-gray-500 me-4 mb-4 md:mb-0">
          <li>
            <a
              href="#"
              onClick={() => handleTabClick("EndPointCreation")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${activeTab === "EndPointCreation"
                ? "text-white bg-blue-700"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <GrLocationPin className="text-lg" />
              Create Endpoint
            </a>
          </li>

          {/* <li>
            <a
              href="#"
              onClick={() => handleTabClick("Trips")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${activeTab === "Trips"
                ? "text-white bg-blue-700"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <MdRoute className="text-lg" />
              Trips
            </a>
          </li> */}

          {/* <li>
            <a
              href="#"
              onClick={() => handleTabClick("Track")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${activeTab === "Track"
                ? "text-white bg-blue-700"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <GrLocationPin className="text-lg" />
              Track
            </a>
          </li> */}

          <li>
            <a
              href="#"
              onClick={() => handleTabClick("Combined")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${activeTab === "Combined"
                ? "text-white bg-blue-700"
                : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <GrLocationPin className="text-lg" />
              Combined
            </a>
          </li>

          {/* <li>
            <a
              onClick={handleSaveConfiguration}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 text-white bg-green-600 cursor-pointer`}
            >
              Save Configuration
            </a>
          </li> */}
        </ul>

        <div className="text-medium text-gray-500 rounded-lg w-full">
          {activeTab === "Trips" && (
            <div>
              <TripsDataForm
                trackData={trackData}
                onSubmit={handleTripSubmit}
                responseData={responseData}
              />
            </div>
          )}

          {activeTab === "Track" && (
            <div>
              <TrackDataForm
                tripData={tripData}
                onSubmit={handleTrackSubmit}
                responseData={responseData}
              />
            </div>
          )}

          {activeTab === "EndPointCreation" && (
            <div>
              <ConvoyForm setResponseData={setResponseData} />
            </div>
          )}
          {activeTab === "Combined" && (
            <div>
              <CombinedDataForm
                onSubmit={handleCombinedSubmit}
                responseData={responseData}
              />
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default App;
