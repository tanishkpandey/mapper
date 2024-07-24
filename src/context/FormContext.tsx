// interface FormValues {
//   convoyUrl: string;
//   url: string;
//   support_email: string;
//   secret: string;
//   rate_limit: string;
//   rate_limit_duration: string;
//   owner_id: string;
//   name: string;
//   is_disabled: boolean;
//   apiKey: string;
//   endpointId: string;
//   collectionName: string[];
//   convoy_project_id: string;
//   convoy_endpoint_id: string;
//   pushData: string;
//   project: string;
//   account: string;
//   tripData: any; // Add tripData
//   trackData: any; // Add trackData
// }

// interface FormContextType {
//   formValues: FormValues;
//   setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
// }

// const FormContext = createContext<FormContextType | undefined>(undefined);

// export const useFormContext = (): FormContextType => {
//   const context = useContext(FormContext);
//   if (!context) {
//     throw new Error("useFormContext must be used within a FormProvider");
//   }
//   return context;
// };

// export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [formValues, setFormValues] = useState<FormValues>({
//     convoyUrl: "http://103.20.214.75:5005",
//     url: "",
//     support_email: "",
//     secret: "",
//     rate_limit: "",
//     rate_limit_duration: "",
//     owner_id: "01J3A1HF8GWDJF0Z1XQGDKN8FE",
//     name: "",
//     is_disabled: false,
//     apiKey: "",
//     endpointId: "",
//     collectionName: [],
//     tripData: {
//       TripDataMapper: {},
//       TripDataAddOnFields: {},
//     },
//     trackData: {
//       TrackDataMapper: {},
//       TrackDataAddOnFields: {},
//     },
//   });

//   return (
//     <FormContext.Provider value={{ formValues, setFormValues }}>
//       {children}
//     </FormContext.Provider>
//   );
// };
