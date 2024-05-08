// ClusteraApp.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Upload } from "./Upload";
import { Link } from "react-router-dom";
import NavigationBar from '../../components/navbar.jsx';
import { AppContext } from '../../providers/AppState.jsx'

const HomePage = () => {

    const { uploadedData, setUploadedData } = useContext(AppContext);
    const { preprocessedText, setPreprocessedText } = useContext(AppContext);
    const { documentsProvider, setDocumentsProvider } = useContext(AppContext);
    const { clustersProvider, setClustersProvider } = useContext(AppContext);
    const { classifierModel, setClassifierModel } = useContext(AppContext);
    const { includeClusterProvider, setIncludeClusterProvider } = useContext(AppContext);
    const { includeAllClustersProvider, setIncludeAllClustersProvider } = useContext(AppContext);

    useEffect(() => {
        setUploadedData([])
        setPreprocessedText([])
        setDocumentsProvider([])
        setClustersProvider([])
        setClassifierModel(false)
        setIncludeClusterProvider([true])
        setIncludeAllClustersProvider(true)

    }, []);


    return (
        <div>
            <NavigationBar>
            </NavigationBar>
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h3 className="w-3/5 font-bold mx-auto bg-gradient-to-r from-yellow-500 from-10% to-pink-500 to-90% text-transparent bg-clip-text text-[40px]">Home</h3>
                <h1 className="w-1/5 font-bold mx-auto bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-transparent bg-clip-text text-[88px]">Clustera</h1>
                <div className="text-[15px] font-bold text-black-700">An application that allows you to Cluster, Categorize and Classify Textual Documents</div>
                <Upload>
                </Upload>
            </div>
        </div>
    );
};

export default HomePage;
