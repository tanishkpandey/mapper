import React, { useState } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import axios from "axios";

interface AuthValues {
  basicAuthToken?: string;
  useName?: string;
  password?: string;
  tokenValue?: string;
}

interface ConvoyFormProps {
  setResponseData: (data: any) => void;
}

const ConvoyForm: React.FC<ConvoyFormProps> = ({ setResponseData }) => {
  const [authMethod, setAuthMethod] = useState<string>("");
  const [authValues, setAuthValues] = useState<AuthValues>({});
  const [generatedToken, setGeneratedToken] = useState<string>("");
  const [formValues, setFormValues] = useState({
    convoyUrl: "https://convoy.imztech.io",
    url: "",
    support_email: "",
    secret: "",
    rate_limit: "",
    rate_limit_duration: "",
    owner_id: "01J3A1HF8GWDJF0Z1XQGDKN8FE",
    name: "",
    is_disabled: false,
    apiKey: "",
    endpointId: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    if (name === "rate_limit_duration") {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: `${value}s`,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authHeaderValue =
      authMethod === "BasicAuth"
        ? `Basic ${btoa(`${authValues.useName}:${authValues.password}`)}`
        : `Bearer ${authValues.tokenValue}`;

    const payload = {
      advanced_signatures: true,
      appID: "01J3K08ESQ1SJC08RY9PY87KQJ",
      authentication: {
        api_key: {
          header_name: "Authorization",
          header_value: `Bearer ${formValues.apiKey}`,
        },
        type: "api_key",
      },
      description: "this",
      http_timeout: 10,
      is_disabled: formValues.is_disabled,
      name: formValues.name,
      owner_id: "01J3K07Y3NC9VR5W7A3HYFKPJM",
      rate_limit: parseInt(formValues.rate_limit),
      rate_limit_duration: parseInt(formValues.rate_limit_duration),
      secret: formValues.secret,
      slack_webhook_url: "",
      support_email: formValues.support_email,
      url: formValues.url,
    };

    try {
      const response = await axios.post(
        `https://convoy.imztech.io/api/v1/projects/01J3J24Z3FWTVW6FXJR6X5PT1J/endpoints`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${formValues.apiKey}`,
          },
        }
      );

      console.log("Response data:", response.data);
      setResponseData(response.data);
    } catch (error) {
      console.error("Error:", error);
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

      if (authMethod === "BasicAuth" && updatedValues.useName && updatedValues.password) {
        const token = btoa(`${updatedValues.useName}:${updatedValues.password}`);
        updatedValues.basicAuthToken = `Basic ${token}`;
        setGeneratedToken(updatedValues.basicAuthToken);
        setFormValues((prevValues) => ({
          ...prevValues,
          secret: updatedValues.basicAuthToken,
        }));
      } else if (authMethod === "Bearer") {
        setFormValues((prevValues) => ({
          ...prevValues,
          secret: value,
        }));
      }

      return updatedValues;
    });
  };

  return (
    <PerfectScrollbar>
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white border shadow-lg rounded-lg mx-auto h-[90vh] overflow-y-scroll"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Convoy Configuration Form
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Convoy URL
              </label>
              <input
                type="text"
                name="convoyUrl"
                disabled
                value={formValues.convoyUrl}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Convoy URL"
                aria-label="Convoy URL"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Webhook URL
              </label>
              <input
                type="text"
                name="url"
                value={formValues.url}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Webhook URL"
                aria-label="Webhook URL"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Support Email
              </label>
              <input
                type="email"
                name="support_email"
                value={formValues.support_email}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Support Email"
                aria-label="Support Email"
              />
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
                Secret
              </label>
              <input
                type="text"
                name="secret"
                disabled
                value={formValues.secret}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Secret"
                aria-label="Secret"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Rate Limit
              </label>
              <input
                type="number"
                name="rate_limit"
                value={formValues.rate_limit}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Rate Limit"
                aria-label="Rate Limit"
              />
            </div>
          </div>

          <div>
            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Rate Limit Duration (in seconds)
              </label>
              <input
                type="text"
                name="rate_limit_duration"
                value={formValues.rate_limit_duration.replace("s", "")}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Rate Limit Duration"
                aria-label="Rate Limit Duration"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Owner ID
              </label>
              <input
                type="text"
                name="owner_id"
                disabled
                value="01J3A1HF8GWDJF0Z1XQGDKN8FE"
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Owner ID"
                aria-label="Owner ID"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Name"
                aria-label="Name"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Disabled
              </label>
              <input
                type="checkbox"
                name="is_disabled"
                checked={formValues.is_disabled}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span>True</span>
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                API Key
              </label>
              <input
                type="text"
                name="apiKey"
                value={formValues.apiKey}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="API Key"
                aria-label="API Key"
              />
            </div>

            <div className="mb-6">
              <label className="text-left block text-gray-700 font-medium mb-2 text-sm">
                Endpoint ID
              </label>
              <input
                type="text"
                name="endpointId"
                value={formValues.endpointId}
                onChange={handleInputChange}
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Endpoint ID"
                aria-label="Endpoint ID"
              />
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

export default ConvoyForm;
