import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormContextType {
    tripFormValues: any;
    trackFormValues: any;
    setTripFormValues: React.Dispatch<React.SetStateAction<any>>;
    setTrackFormValues: React.Dispatch<React.SetStateAction<any>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tripFormValues, setTripFormValues] = useState<any>({});
    const [trackFormValues, setTrackFormValues] = useState<any>({});

    return (
        <FormContext.Provider value={{ tripFormValues, setTripFormValues, trackFormValues, setTrackFormValues }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};
