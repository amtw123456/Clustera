import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../providers/AppState.js';
import NavigationBar from '../../components/navbar.js';

const AboutPage = () => {

    const { uploadedData, setUploadedData } = useContext(AppContext);
    const { preprocessedText, setPreprocessedText } = useContext(AppContext);
    const { wordCounts, setWordCounts } = useContext(AppContext);
    const { documentsProvider, setDocumentsProvider } = useContext(AppContext);

    useEffect(() => {
        console.log(documentsProvider)
        console.log(uploadedData)

    }, []);

    return (
        <div>
            <NavigationBar />
            <div>About Page</div>
        </div>
    );
};

export default AboutPage;
