import React, { createContext, useState } from 'react';

export const AppContext = createContext([]);

export const AppStateProvider = ({ children }) => {
    const [uploadedData, setUploadedData] = useState([]);
    const [preprocessedText, setPreprocessedText] = useState([]);

    return (
        <AppContext.Provider value={{ uploadedData, setUploadedData, preprocessedText, setPreprocessedText }}>
            {children}
        </AppContext.Provider>
    );
};