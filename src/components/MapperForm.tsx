import React, { useState } from "react";

// Example fields from the JSON
const fields = {
  dummyField1: " ",
  dummyField2: " ",
  dummyField3: " ",
  dummyField4: " ",
  dummyField5: " ",
  dummyField6: " ",
  dummyField7: " ",
  dummyField8: " ",
};

const MapperForm: React.FC = () => {
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

  const [formValues, setFormValues] = useState({
    convoyApiKey: "",
    convoyEndpointId: "",
    projectId: "",
    collectionName: "",
    pushData: "during-trip",
  });

  const handleAddFields = () => {
    setNewFields([...newFields, newFields.length + 1]);
  };

  const handleSave = (index: number) => {
    console.log(`Saving fields at index ${index}`);
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
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formValues,
      fixedFields: fixedFieldValues,
      addOnFields: addOnFieldValues,
    };
    console.log("Form Data:", data);
  };

  console.log(formValues);
  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Mapper Form</h2>
      <div className="grid grid-cols-12 gap-6">
        <div className="md:col-span-6 col-span-12">
          <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
            Convoy API Key
          </label>
          <input
            type="text"
            name="convoyApiKey"
            value={formValues.convoyApiKey}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="API Key"
            aria-label="Convoy API Key"
          />
        </div>

        <div className="md:col-span-6 col-span-12">
          <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
            Convoy Endpoint ID
          </label>
          <input
            type="text"
            name="convoyEndpointId"
            value={formValues.convoyEndpointId}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Endpoint ID"
            aria-label="Convoy Endpoint ID"
          />
        </div>

        <div className="md:col-span-6 col-span-12">
          <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
            Project ID
          </label>
          <input
            type="text"
            name="projectId"
            value={formValues.projectId}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Project ID"
            aria-label="Project ID"
          />
        </div>

        <div className="md:col-span-6 col-span-12">
          <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
            Collection Name
          </label>
          <select
            id="inputState1"
            name="collectionName"
            value={formValues.collectionName}
            onChange={handleInputChange}
            className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Collection</option>
            <option value="Collection1">Collection1</option>
            <option value="Collection2">Collection2</option>
          </select>
        </div>

        <div className="col-span-12">
          <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
            Push Data
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                className="form-check-input h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                type="radio"
                id="all-time"
                name="pushData"
                value="all-time"
                checked={formValues.pushData === "all-time"}
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

        <div className="md:col-span-6 col-span-12">
          <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
            Map Fixed Fields
          </label>
          <div className="grid grid-cols-12 gap-4">
            {Object.keys(fields).map((field) => (
              <div key={field} className="col-span-12 flex items-center">
                <input
                  type="checkbox"
                  id={field}
                  className="mr-2"
                  onChange={() => handleCheckboxChange(field)}
                />
                <label htmlFor={field} className="text-gray-700 text-sm w-1/3">
                  {field}
                </label>
                <input
                  type="text"
                  className="w-2/3 block p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder={`Enter value for ${field}`}
                  disabled={!checkedFields[field]}
                  onChange={(e) =>
                    handleFixedFieldChange(field, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-6 col-span-12">
          <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
            Add-On Fields
          </label>
          <div className="grid grid-cols-12 gap-4">
            {newFields.map((field, index) => (
              <div
                key={index}
                className="col-span-12 flex items-center space-x-2"
              >
                <input
                  type="text"
                  className="block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder={`Field ${index + 1} - 1`}
                  onChange={(e) =>
                    handleAddOnFieldChange(index, 0, e.target.value)
                  }
                />
                <input
                  type="text"
                  className="block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder={`Field ${index + 1} - 2`}
                  onChange={(e) =>
                    handleAddOnFieldChange(index, 1, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleSave(index)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </div>
            ))}
            <div className="col-span-12">
              <button
                type="button"
                onClick={handleAddFields}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add
              </button>
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
      </div>
    </form>
  );
};

export default MapperForm;
