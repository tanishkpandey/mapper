import React, { useState } from "react";
import { Track } from "./TrackData";
import { RiDeleteBin6Line } from "react-icons/ri";

interface FormValues {
  account: string[];
  project: string;
  collectionName: string[];
  convoy_project_id: string;
  convoy_endpoint_id: string;
  pushData: string;
}

interface AuthValues {
  basicAuthToken?: string;
  useName?: string;
  password?: string;
  tokenValue?: string;
}

const TrackDataForm: React.FC = () => {
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
  const [authMethod, setAuthMethod] = useState<string>("");
  const [authValues, setAuthValues] = useState<AuthValues>({});
  const [formValues, setFormValues] = useState<FormValues>({
    account: [],
    project: "",
    collectionName: [],
    convoy_project_id: "",
    convoy_endpoint_id: "",
    pushData: "during-trip",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string>("");

  const collectionOptions = [
    "EXCISE_TRACKDATA",
    "TRIP",
    "Collection1",
    "Collection2",
  ];

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

  const handleAddOnFieldChange = (
    index: number,
    subIndex: number,
    value: string
  ) => {
    setAddOnFieldValues((prevState) => ({
      ...prevState,
      [`addOnField${index + 1}-${subIndex + 1}`]: value,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "account") {
      setFormValues({
        ...formValues,
        [name]: value,
        account: value.split(",").map((id) => id.trim()),
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleAuthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAuthMethod(e.target.value);
    setAuthValues({});
  };

  const handleAuthValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAuthValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [name]: value,
      };

      if (
        authMethod === "BasicAuth" &&
        updatedValues.useName &&
        updatedValues.password
      ) {
        const token = btoa(
          `${updatedValues.useName}:${updatedValues.password}`
        );
        updatedValues.basicAuthToken = `Basic ${token}`;
      }

      return updatedValues;
    });
  };

  const handleCollectionChange = (option: string) => {
    const newCollection = [...formValues.collectionName];
    if (newCollection.includes(option)) {
      setFormValues({
        ...formValues,
        collectionName: newCollection.filter((item) => item !== option),
      });
    } else if (newCollection.length < 2) {
      setFormValues({
        ...formValues,
        collectionName: [...newCollection, option],
      });
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSaveAddOnField = (index: number) => {
    const keyField = `addOnField${index + 1}-1`;
    const valueField = `addOnField${index + 1}-2`;
    const key = addOnFieldValues[keyField];
    const value = addOnFieldValues[valueField];

    if (key && value) {
      setSavedAddOnFields((prevState) => ({
        ...prevState,
        [key]: value,
      }));
      setAddOnFieldValues((prevState) => ({
        ...prevState,
        [keyField]: "",
        [valueField]: "",
      }));
    }
  };

  const handleDeleteAddOnField = (key: string) => {
    setSavedAddOnFields((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const TrakDataMapper: {
      [key: string]: { enabled: boolean; newKey: string };
    } = {};

    for (const key in Track) {
      if (Track.hasOwnProperty(key)) {
        TrakDataMapper[key] = {
          enabled: !!checkedFields[key],
          newKey: checkedFields[key]
            ? fixedFieldValues[key] || Track[key]
            : key,
        };
      }
    }

    for (const key in savedAddOnFields) {
      if (savedAddOnFields.hasOwnProperty(key)) {
        TrakDataMapper[key] = {
          enabled: true,
          newKey: savedAddOnFields[key],
        };
      }
    }

    const authData: any = {
      type: authMethod === "BasicAuth" ? "Basic" : "Bearer",
    };

    if (authMethod === "BasicAuth") {
      authData.basicAuthToken = authValues.basicAuthToken;
    } else if (authMethod === "Bearer") {
      authData.tokenValue = authValues.tokenValue;
    }

    const data = {
      account: formValues.account,
      collectionName: formValues.collectionName,
      convoy_project_id: formValues.convoy_project_id,
      convoy_endpoint_id: formValues.convoy_endpoint_id,
      pushData: formValues.pushData,
      auth: authData,
      TrakDataMapper: TrakDataMapper,
    };

    console.log("Form Data:", data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white border shadow-lg rounded-lg mx-auto h-[90vh] overflow-y-scroll"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Track Form</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="mb-6">
            <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
              Convey Project ID
            </label>
            <input
              type="text"
              name="project"
              value={formValues.project}
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
              value={formValues.convoy_project_id}
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
              value={formValues.convoy_endpoint_id}
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
              value={formValues.account}
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
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  {collectionOptions.map((option) => (
                    <label key={option} className="flex items-center p-2">
                      <input
                        type="checkbox"
                        checked={formValues.collectionName.includes(option)}
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
              Authentication
            </label>
            <select
              id="authMethod"
              name="authMethod"
              value={authMethod}
              onChange={handleAuthChange}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select Authentication</option>
              <option value="BasicAuth">Basic Auth</option>
              <option value="Bearer">Token</option>
            </select>
            {authMethod === "BasicAuth" && (
              <div className="mt-4 space-y-4">
                <input
                  type="text"
                  name="useName"
                  value={authValues.useName || ""}
                  onChange={handleAuthValueChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Username"
                  aria-label="Username"
                />
                <input
                  type="password"
                  name="password"
                  value={authValues.password || ""}
                  onChange={handleAuthValueChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setGeneratedToken(authValues.basicAuthToken || "")
                  }
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Generate
                </button>
                {generatedToken && (
                  <div className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Generated Token
                    </label>
                    <p className="break-all text-sm">{generatedToken}</p>
                  </div>
                )}
              </div>
            )}
            {authMethod === "Bearer" && (
              <div className="mt-4">
                <input
                  type="text"
                  name="tokenValue"
                  value={authValues.tokenValue || ""}
                  onChange={handleAuthValueChange}
                  className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Token"
                  aria-label="Token"
                />
                <button
                  type="button"
                  onClick={() => setGeneratedToken(authValues.tokenValue || "")}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Generate Token
                </button>
                {generatedToken && (
                  <div className="mt-4 p-2 border border-gray-300 rounded-md shadow-sm">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">
                      Generated Token
                    </label>
                    <p className="break-all">{generatedToken}</p>
                  </div>
                )}
              </div>
            )}
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
                  checked={formValues.pushData === "all-times"}
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
                  checked={formValues.pushData === "during-trip"}
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
                        handleAddOnFieldChange(index, 0, e.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={addOnFieldValues[valueField] || ""}
                      className="block w-1/2 py-1 px-3 text-sm border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Value"
                      onChange={(e) =>
                        handleAddOnFieldChange(index, 1, e.target.value)
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
  );
};

export default TrackDataForm;
