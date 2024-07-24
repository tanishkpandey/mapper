import React, { useState } from "react";
import "./App.css";
import TripsDataForm from "./components/TripDataForm";
import TrackDataForm from "./components/TrackDataForm";
import { MdRoute } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";
import { Trip } from "./components/TripData";
import { Track } from "./components/TrackData";
import ConvoyForm from "./components/ConvoyForm";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Trips");
  const [tripData, setTripData] = useState<any>({
    TripDataMapper: Trip,
    TripDataAddOnFields: {},
  });
  const [trackData, setTrackData] = useState<any>({
    TrackDataMapper: Track,
    TrackDataAddOnFields: {},
  });

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

  return (
    <>
      <div className="max-w-[1800px] rounded flex">
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 me-4 mb-4 md:mb-0">
          <li>
            <a
              href="#"
              onClick={() => handleTabClick("Trips")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${
                activeTab === "Trips"
                  ? "text-white bg-blue-700"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <MdRoute className="text-lg" />
              Trips
            </a>
          </li>

          <li>
            <a
              href="#"
              onClick={() => handleTabClick("Track")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${
                activeTab === "Track"
                  ? "text-white bg-blue-700"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <GrLocationPin className="text-lg" />
              Track
            </a>
          </li>

          <li>
            <a
              href="#"
              onClick={() => handleTabClick("EndPointCreation")}
              className={`inline-flex items-center px-4 py-3 rounded-lg w-full gap-2 ${
                activeTab === "EndPointCreation"
                  ? "text-white bg-blue-700"
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <GrLocationPin className="text-lg" />
              Create Endpoint
            </a>
          </li>
        </ul>

        <div className="text-medium text-gray-500 rounded-lg w-full">
          {activeTab === "Trips" && (
            <div>
              <TripsDataForm
                trackData={trackData}
                onSubmit={handleTripSubmit}
              />
            </div>
          )}
          {activeTab === "Track" && (
            <div>
              <TrackDataForm tripData={tripData} onSubmit={handleTrackSubmit} />
            </div>
          )}

          {activeTab === "EndPointCreation" && (
            <div>
              <ConvoyForm />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
