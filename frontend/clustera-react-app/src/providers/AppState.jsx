import React, { createContext, useState } from 'react';

export const AppContext = createContext([]);

export const AppStateProvider = ({ children }) => {
    const [uploadedData, setUploadedData] = useState([]);
    const [preprocessedText, setPreprocessedText] = useState([]);
    const [wordCounts, setWordCounts] = useState([]);
    // const [topicsGenerated, setTopicsGenerated] = useState([]);
    const [documentsProvider, setDocumentsProvider] = useState([]);
    const [clustersProvider, setClustersProvider] = useState([]);
    const [classifierModel, setClassifierModel] = useState(true);

    return (
        <AppContext.Provider value={
            {
                uploadedData, setUploadedData,
                preprocessedText, setPreprocessedText,
                wordCounts, setWordCounts,
                documentsProvider, setDocumentsProvider,
                clustersProvider, setClustersProvider,
                classifierModel, setClassifierModel
            }
        }>
            {children}
        </AppContext.Provider>
    );
};