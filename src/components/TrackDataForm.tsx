import React, { useState, useEffect } from "react";
import { Track } from "./TrackData";
import { RiDeleteBin6Line } from "react-icons/ri";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useFormContext } from "../context/FormContext";
import { toast } from "react-toastify";

interface Props {
  tripData: any;
  onSubmit: (data: any) => void;
  responseData: any;
}

const TrackDataForm: React.FC<Props> = ({
  tripData,
  onSubmit,
  responseData,
}) => {
  const { trackFormValues, setTrackFormValues } = useFormContext();
  const [checkedFields, setCheckedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [fixedFieldValues, setFixedFieldValues] = useState<{
    [key: string]: string;
  }>({});
  const [newFields, setNewFields] = useState<number[]>([]);
  const [addOnFieldValues, setAddOnFieldValues] = useState<{
    [key: string]: string;
  }>({});
  const [savedAddOnFields, setSavedAddOnFields] = useState<{
    [key: string]: string;
  }>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const collectionOptions = [
    "ADN_RAWDATA",
    "ATM_RAWDATA",
    "ATM_TRACKDATA",
    "BHEX_RAWDATA",
    "BHEX_TRACKDATA",
    "BSFC_ALERTDATA",
    "BSFC_RAWDATA",
    "BSFC_RESPDATA",
    "BSFC_TRACKDATA",
    "BSNL_RAWDATA",
    "COMMON_CONFIG",
    "DLVR_RAWDATA",
    "DLVR_TRACKDATA",
    "ELK_ALERTDATA",
    "ELK_RAWDATA",
    "ELK_RESPDATA",
    "ELK_TRACKDATA",
    "EX_ALERTDATA",
    "EX_RAWDATA",
    "EX_RESPDATA",
    "EX_TRACKDATA",
    "GEO_HUBS",
    "GSCS_ALERTDATA",
    "GSCS_RAWDATA",
    "GSCS_RESPDATA",
    "GSCS_TRACKDATA",
    "IMZ_ALERTDATA",
    "IMZ_PUSH_TO_CLIENT",
    "IMZ_RAWDATA",
    "IMZ_RESPDATA",
    "IMZ_TRACKDATA",
    "IMZ_TRIPS",
    "LOCATIONS",
    "LORA_ALERTDATA",
    "LORA_TRACKDATA",
    "MATERIALS",
    "NTA_ALERTDATA",
    "NTA_RAWDATA",
    "NTA_RESPDATA",
    "NTA_TRACKDATA",
    "PRAJ_ALERTDATA",
    "PRAJ_GEN_REPORT",
    "PRAJ_NONFUNC_REPORT",
    "PRAJ_RAWDATA",
    "PRAJ_REPORT",
    "PRAJ_TRACKDATA",
    "PUSH_TO_CLIENT",
    "ROUTE",
    "ROUTE_GEO",
    "TM_ALERTDATA",
    "TM_RAWDATA",
    "TM_TRACKDATA",
    "TRIPS",
    "TST_RAWDATA",
    "TST_TRACKDATA",
    "UPEX_ALERTDATA",
    "UPEX_RAWDATA",
    "UPEX_RESPDATA",
    "UPEX_TRACKDATA",
    "USER_RIGHTS",
    "WBEX_ALERTDATA",
    "WBEX_RAWDATA",
    "_RAWDATA",
    "ecom_tracks",
    "loadcalibration",
    "stops",
    "trips",
  ];

  useEffect(() => {
    if (Object.keys(tripData.tripDataMapper).length === 0) {
      setFixedFieldValues({
        ...tripData.tripDataMapper,
        geocode: "",
        lat: "",
        lng: "",
        accid: "",
        deviceid: "",
      });
    }
  }, [tripData]);

  useEffect(() => {
    if (responseData && responseData.data) {
      const { uid, project_id, authentication } = responseData.data;
      const headerValue = authentication.api_key.header_value;
      const apiKey = headerValue.substring(7);

      setTrackFormValues((prevValues) => ({
        ...prevValues,
        convoy_project_id: project_id || "",
        convoy_api_key: apiKey || "",
        convoyEndpointId: uid || "",
      }));
    }
  }, [responseData, setTrackFormValues]);

  const handleAddFields = () => {
    setNewFields([...newFields, newFields.length + 1]);
  };

  const handleCheckboxChange = (field: string) => {
    setCheckedFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleFixedFieldChange = (field: string, value: string) => {
    setFixedFieldValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "account") {
      setTrackFormValues({
        ...trackFormValues,
        [name]: value,
        account: value.split(",").map((id) => id.trim()),
      });
    } else {
      setTrackFormValues({
        ...trackFormValues,
        [name]: value,
      });
    }
  };

  const handleCollectionChange = (option: string) => {
    const newCollection = [...trackFormValues.collectionName];
    if (newCollection.includes(option)) {
      setTrackFormValues({
        ...trackFormValues,
        collectionName: newCollection.filter((item) => item !== option),
      });
    } else if (newCollection.length < 2) {
      setTrackFormValues({
        ...trackFormValues,
        collectionName: [...newCollection, option],
      });
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDeleteAddOnField = (key: string) => {
    setSavedAddOnFields((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
  };

  // console.log(responseData);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trackDataMapper: {
      [key: string]: { enabled: boolean; newKey: string };
    } = {};
    const trackDataAddOnFields: {
      [key: string]: { enabled: boolean; newKey: string };
    } = {};

    for (const key in Track) {
      if (Track.hasOwnProperty(key)) {
        trackDataMapper[key] = {
          enabled: !!checkedFields[key],
          newKey: checkedFields[key]
            ? fixedFieldValues[key] || Track[key]
            : key,
        };
      }
    }

    for (const key in savedAddOnFields) {
      if (savedAddOnFields.hasOwnProperty(key)) {
        trackDataAddOnFields[key] = {
          enabled: true,
          newKey: savedAddOnFields[key],
        };
      }
    }

    const data = {
      account: trackFormValues.account,
      collectionName: trackFormValues.collectionName,
      convoyProjectId: trackFormValues.convoy_project_id,
      convoyEndpointId: trackFormValues.convoy_endpoint_id,
      pushData: trackFormValues.pushData,
      trackDataMapper: trackDataMapper,
      trackDataAddOnFields: trackDataAddOnFields,
      tripDataMapper: tripData.tripDataMapper || {},
      tripDataAddOnFields: tripData.tripDataAddOnFields || {},
    };

    const toastId = toast.loading("Submitting...");

    try {
      const response = await fetch(
        "http://localhost:5500/api/v1.0/saveDataFeed",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      toast.update(toastId, {
        render: "Data submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });

      onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.update(toastId, {
        render: "Error submitting data.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <PerfectScrollbar>
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white border shadow-lg rounded-lg mx-auto h-[90vh] overflow-y-scroll"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Track Form
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Convey Project ID
              </label>
              <input
                type="text"
                name="project"
                value={trackFormValues.convoy_project_id || ""}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Project ID"
                aria-label="Project ID"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Convoy API Key
              </label>
              <input
                type="text"
                name="convoy_project_id"
                value={trackFormValues.convoy_api_key || ""}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="API Key"
                aria-label="Convoy API Key"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Convoy Endpoint ID
              </label>
              <input
                type="text"
                name="convoy_endpoint_id"
                value={trackFormValues.convoy_endpoint_id || ""}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Endpoint ID"
                aria-label="Convoy Endpoint ID"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Account ID
              </label>
              <input
                type="text"
                name="account"
                value={trackFormValues.account}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Account ID"
                aria-label="Account ID"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Collection Name
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  Select Collection
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10  h-[200px] overflow-y-scroll">
                    {collectionOptions.map((option) => (
                      <label key={option} className="flex items-center p-2">
                        <input
                          type="checkbox"
                          checked={
                            trackFormValues.collectionName?.includes(option) ||
                            false
                          }
                          onChange={() => handleCollectionChange(option)}
                          className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Push Data
              </label>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    className="form-check-input h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    type="radio"
                    id="all-time"
                    name="pushData"
                    value="all-times"
                    checked={trackFormValues.pushData === "all-times"}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2 text-gray-700" htmlFor="all-time">
                    All Times
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="form-check-input h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    type="radio"
                    id="during-trip"
                    name="pushData"
                    value="during-trip"
                    checked={trackFormValues.pushData === "during-trip"}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2 text-gray-700" htmlFor="during-trip">
                    During Trip
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Map Fixed Fields
              </label>
              <div className="grid grid-cols-12 gap-4">
                {Object.keys(Track).map((field) => (
                  <div key={field} className="col-span-12 flex items-center">
                    <input
                      type="checkbox"
                      id={field}
                      className="mr-2"
                      onChange={() => handleCheckboxChange(field)}
                    />
                    <label
                      htmlFor={field}
                      className="text-gray-700 text-left text-sm w-1/3"
                    >
                      {field}
                    </label>
                    <input
                      type="text"
                      className="w-2/3 block py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder={`Enter new key for ${field}`}
                      disabled={!checkedFields[field]}
                      onChange={(e) =>
                        handleFixedFieldChange(field, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Add-On Fields
              </label>
              <div className="grid grid-cols-12 gap-4">
                {Object.keys(savedAddOnFields).map((key) => (
                  <div
                    key={key}
                    className="col-span-12 flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <input
                      type="text"
                      value={savedAddOnFields[key]}
                      readOnly
                      className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteAddOnField(key)}
                      className="inline-flex justify-center py-2 text-md px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                ))}
                {newFields.map((field, index) => {
                  const keyField = `addOnField${index + 1}-1`;
                  const valueField = `addOnField${index + 1}-2`;
                  return (
                    <div
                      key={index}
                      className="col-span-12 flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={addOnFieldValues[keyField] || ""}
                        className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Key"
                        onChange={(e) =>
                          handleFixedFieldChange(keyField, e.target.value)
                        }
                      />
                      <input
                        type="text"
                        value={addOnFieldValues[valueField] || ""}
                        className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="Value"
                        onChange={(e) =>
                          handleFixedFieldChange(valueField, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveAddOnField(index)}
                        className="inline-flex justify-center py-1 px-3 text-sm border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  );
                })}

                <div className="col-span-12">
                  <button
                    type="button"
                    onClick={handleAddFields}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-12 col-span-12">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </PerfectScrollbar>
  );
};

export default TrackDataForm;
