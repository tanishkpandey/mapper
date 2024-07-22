import React, { useState } from "react";
import "./App.css";
import TripsDataForm from "./components/TripDataForm";
import TrackDataForm from "./components/TrackDataForm";
import { MdRoute } from "react-icons/md";
import { GrLocationPin } from "react-icons/gr";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Trips");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="max-w-[1800px]  rounded flex">
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500  me-4 mb-4 md:mb-0">
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
                  ? "text-white bg-blue-700 "
                  : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <GrLocationPin className="text-lg" />
              Track
            </a>
          </li>
        </ul>
        <div className="text-medium text-gray-500  rounded-lg w-full">
          {activeTab === "Trips" && (
            <div>
              <TripsDataForm />
            </div>
          )}
          {activeTab === "Track" && (
            <div>
              <TrackDataForm />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
