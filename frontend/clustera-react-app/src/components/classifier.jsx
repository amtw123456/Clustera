import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../providers/AppState.jsx';
import Scatterplot from "./scatterplot_folder/Scatterplot";
import { data } from "./scatterplot_folder/data";


function Classifier({ summarizedDocuments, noOfClusters, clustersPredicted, topicsGenerated, clustersGenerated, tsneParameters, documentTopicDistributionThreshold, classifierModel }) {
    const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

    const ldaClassifyDocument = async () => {
        var responseData
        try {
            const response = await fetch(REACT_APP_BACKEND_API_URL + 'ldaclassifydocuments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "lda_trained_classifier": classifierModel,
                    "documents": ["shoddy", "crossing", "choose"]
                }),
            });

            responseData = await response.json();

        } catch (error) {
            console.error('Error during text preprocessing:', error);
        } finally {
            console.log(responseData['lda_classifier_result'])
        }
    };

    return (
        classifierModel ? (
            <div class="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Classifier has been trained</div>
                <div class="text-center text-blue-600 text-xl underline-offset-4">Classifier has been trained</div>
                <div class="flex justify-center mt-12">
                    <button onClick={() => ldaClassifyDocument()}>{ }
                        < div class="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Classify Documents
                        </div>
                    </button>
                </div>
            </div>
        ) :
            <div class="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Train your classifier</div>
                <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Train classifier button in the Sidebar!</div>
            </div>)
}


export default Classifier