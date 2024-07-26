import React, { useEffect, useState } from "react";
import { Track } from "./TrackData";
import { Trip } from "./TripData";
import { RiDeleteBin6Line } from "react-icons/ri";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  onSubmit: (data: any) => void;
  responseData: any;
}

const initializeDataMapper = (fields: string[]) => {
  const mapper: any = {};
  fields.forEach(field => {
    mapper[field] = {
      enabled: false,
      newKey: field
    };
  });
  return mapper;
};

const CombinedDataForm: React.FC<Props> = ({ onSubmit, responseData }) => {
  const [formData, setFormData] = useState({
    convoyProjectId: "",
    convoyApiKey: "",
    convoyEndpointId: "",
    account: [],
    collectionName: [],
    pushData: "",
    wrapper: "",
    mapFixedFields: {},
    addOnFields: initializeDataMapper([]), // Initialize empty for add-on fields
    trackDataMapper: initializeDataMapper(Object.keys(Track)),
    tripDataMapper: initializeDataMapper(Object.keys(Trip))
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showTrackFields, setShowTrackFields] = useState(true);
  const [newFields, setNewFields] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    if (responseData && responseData.data) {
      const { uid, project_id, authentication } = responseData.data;
      const headerValue = authentication.api_key.header_value;
      const apiKey = headerValue.substring(7);

      setFormData(prevData => ({
        ...prevData,
        convoyProjectId: project_id || "",
        convoyApiKey: apiKey || "",
        convoyEndpointId: uid || ""
      }));
    }
  }, [responseData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "account") {
      setFormData((prevData) => ({
        ...prevData,
        account: value.split(",").map(item => item.trim()),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    if (name === "collectionName") {
      setFormData((prevData) => ({
        ...prevData,
        collectionName: checked
          ? [...prevData.collectionName, value]
          : prevData.collectionName.filter((item) => item !== value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    const toastId = toast.loading("Submitting...");

    try {
      const response = await fetch(
        "http://localhost:5500/api/v1.0/saveDataFeed",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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

      onSubmit(formData);
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


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleTrackFields = () => {
    setShowTrackFields(!showTrackFields);
  };

  const handleFieldCheckboxChange = (field: string, type: "track" | "trip", checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [`${type}DataMapper`]: {
        ...prevData[`${type}DataMapper`],
        [field]: {
          ...prevData[`${type}DataMapper`][field],
          enabled: checked
        }
      }
    }));
  };

  const handleFieldKeyChange = (field: string, type: "track" | "trip", value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [`${type}DataMapper`]: {
        ...prevData[`${type}DataMapper`],
        [field]: {
          ...prevData[`${type}DataMapper`][field],
          newKey: value
        }
      }
    }));
  };

  const handleAddFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFields = [...newFields];
    updatedFields[index] = { ...updatedFields[index], [name]: value };
    setNewFields(updatedFields);
  };

  const handleSaveAddOnField = (index: number) => {
    const field = newFields[index];
    setFormData((prevData) => ({
      ...prevData,
      addOnFields: {
        ...prevData.addOnFields,
        [field.key]: { enabled: true, newKey: field.value }
      },
    }));
    setNewFields([{ key: "", value: "" }]); // Clear the new field input after saving
  };

  const handleDeleteAddOnField = (key: string) => {
    setFormData((prevData) => {
      const updatedFields = { ...prevData.addOnFields };
      delete updatedFields[key];
      return {
        ...prevData,
        addOnFields: updatedFields,
      };
    });
  };

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

  return (
    <PerfectScrollbar>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white border shadow-lg rounded-lg mx-auto h-[90vh] overflow-y-scroll"
      >
        <h2 className="text-2xl font-semibold mb-6 text-blue-700">
          Combined Data Form
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Convoy Project ID
              </label>
              <input
                type="text"
                name="convoyProjectId"
                value={formData.convoyProjectId}
                onChange={handleInputChange}
                className="block w-full p-2 border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Project ID"
                aria-label="Project ID"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Convoy API Key
              </label>
              <input
                type="text"
                name="convoyApiKey"
                value={formData.convoyApiKey}
                onChange={handleInputChange}
                className="block w-full p-2 border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="API Key"
                aria-label="Convoy API Key"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Convoy Endpoint ID
              </label>
              <input
                type="text"
                name="convoyEndpointId"
                value={formData.convoyEndpointId}
                onChange={handleInputChange}
                className="block w-full p-2 border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Endpoint ID"
                aria-label="Convoy Endpoint ID"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Account ID
              </label>
              <input
                type="text"
                name="account"
                value={formData.account.join(", ")}
                onChange={handleInputChange}
                className="block w-full p-2 border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Account ID (comma separated)"
                aria-label="Account ID"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Collection Name
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="block w-full p-2 border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 bg-blue-100 text-blue-700"
                >
                  Select Collection
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 h-[200px] overflow-y-scroll">
                    {collectionOptions.map((option) => (
                      <label key={option} className="flex items-center p-2">
                        <input
                          type="checkbox"
                          name="collectionName"
                          value={option}
                          checked={formData.collectionName.includes(option)}
                          onChange={handleCheckboxChange}
                          className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-blue-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Push Data
              </label>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <input
                    className="form-check-input h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    type="radio"
                    name="pushData"
                    value="all-time"
                    checked={formData.pushData === "all-time"}
                    onChange={handleInputChange}
                    id="all-time"
                  />
                  <label className="ml-2 text-blue-700" htmlFor="all-time">
                    All Times
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    className="form-check-input h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                    type="radio"
                    name="pushData"
                    value="during-trip"
                    checked={formData.pushData === "during-trip"}
                    onChange={handleInputChange}
                    id="during-trip"
                  />
                  <label className="ml-2 text-blue-700" htmlFor="during-trip">
                    During Trip
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Wrapper
              </label>
              <div className="grid gap-4 mt-4">
                <textarea
                  name="wrapper"
                  value={formData.wrapper}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter JSON here`}
                ></textarea>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Map Fixed Fields
              </label>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 flex justify-center mb-6">
                  <button
                    type="button"
                    onClick={toggleTrackFields}
                    className={`px-4 py-2 mr-2 ${showTrackFields ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'} rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105`}
                  >
                    Track Fields
                  </button>
                  <button
                    type="button"
                    onClick={toggleTrackFields}
                    className={`px-4 py-2 ${!showTrackFields ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-700'} rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105`}
                  >
                    Trip Fields
                  </button>
                </div>

                <div className="col-span-12 max-h-[400px] overflow-y-auto">
                  {showTrackFields ? (
                    <div className="mb-6">
                      <div className="grid grid-cols-12 gap-4">
                        {Object.keys(Track).map((field) => (
                          <div key={field} className="col-span-12 flex items-center space-x-4">
                            <input
                              type="checkbox"
                              id={field}
                              checked={formData.trackDataMapper[field].enabled}
                              onChange={(e) => handleFieldCheckboxChange(field, "track", e.target.checked)}
                              className="mr-2 form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label htmlFor={field} className="text-blue-700 text-left text-sm w-1/3">
                              {field}
                            </label>
                            <input
                              type="text"
                              value={formData.trackDataMapper[field].newKey}
                              onChange={(e) => handleFieldKeyChange(field, "track", e.target.value)}
                              className="w-2/3 block py-1 px-3 text-sm border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              placeholder={`Enter new key for ${field}`}
                              disabled={!formData.trackDataMapper[field].enabled}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="grid grid-cols-12 gap-4">
                        {Object.keys(Trip).map((field) => (
                          <div key={field} className="col-span-12 flex items-center space-x-4">
                            <input
                              type="checkbox"
                              id={field}
                              checked={formData.tripDataMapper[field].enabled}
                              onChange={(e) => handleFieldCheckboxChange(field, "trip", e.target.checked)}
                              className="mr-2 form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label htmlFor={field} className="text-blue-700 text-left text-sm w-1/3">
                              {field}
                            </label>
                            <input
                              type="text"
                              value={formData.tripDataMapper[field].newKey}
                              onChange={(e) => handleFieldKeyChange(field, "trip", e.target.value)}
                              className="w-2/3 block py-1 px-3 text-sm border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              placeholder={`Enter new key for ${field}`}
                              disabled={!formData.tripDataMapper[field].enabled}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-left block text-blue-700 font-medium mb-2 text-sm">
                Add-On Fields
              </label>
              <div className="grid grid-cols-12 gap-4 max-h-[500px] overflow-y-auto">
                {Object.keys(formData.addOnFields).map((key) => (
                  <div
                    key={key}
                    className="col-span-12 flex items-center space-x-4"
                  >
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="block w-1/2 py-1 px-3 text-sm border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <input
                      type="text"
                      value={formData.addOnFields[key].newKey}
                      readOnly
                      className="block w-1/2 py-1 px-3 text-sm border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteAddOnField(key)}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                ))}
                {newFields.map((field, index) => {
                  return (
                    <div
                      key={index}
                      className="col-span-12 flex items-center space-x-4"
                    >
                      <input
                        type="text"
                        name="key"
                        value={field.key}
                        onChange={(e) => handleAddFieldChange(index, e)}
                        className="block w-1/2 py-1 px-3 text-sm border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="Key"
                      />
                      <input
                        type="text"
                        name="value"
                        value={field.value}
                        onChange={(e) => handleAddFieldChange(index, e)}
                        className="block w-1/2 py-1 px-3 text-sm border border-blue-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="Value"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveAddOnField(index)}
                        className="inline-flex justify-center py-1 px-3 text-sm border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        Save
                      </button>
                    </div>
                  );
                })}

                <div className="col-span-12">
                  <button
                    type="button"
                    onClick={() => setNewFields([...newFields, { key: "", value: "" }])}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
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

export default CombinedDataForm;
