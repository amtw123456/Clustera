import React, { createContext, useState } from 'react';

export const AppContext = createContext([]);

export const AppStateProvider = ({ children }) => {
    const [uploadedData, setUploadedData] = useState([]);
    const [preprocessedText, setPreprocessedText] = useState([]);
    const [wordCounts, setWordCounts] = useState([]);
    // const [topicsGenerated, setTopicsGenerated] = useState([]);
    const [documentsProvider, setDocumentsProvider] = useState([]);

    return (
        <AppContext.Provider value={
            {
                uploadedData, setUploadedData,
                preprocessedText, setPreprocessedText,
                wordCounts, setWordCounts,
                documentsProvider, setDocumentsProvider
            }
        }>
            {children}
        </AppContext.Provider>
    );
};