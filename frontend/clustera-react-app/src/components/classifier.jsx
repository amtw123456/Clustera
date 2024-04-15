import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../providers/AppState.jsx';
import Scatterplot from "./scatterplot_folder/Scatterplot";
import { data } from "./scatterplot_folder/data";


function Classifier({ summarizedDocuments, noOfClusters, clustersPredicted, topicsGenerated, clustersGenerated, tsneParameters, documentTopicDistributionThreshold, classifierModel }) {
    // const { classifierModel, setClassfierModel } = useContext(AppContext);

    // useEffect(() =>
    //     console.log(classifierModel)
    // )

    return (
        classifierModel ? (
            <div class="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Train your classifier</div>
                <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Train classifier button in the Sidebar!</div>
            </div>
        ) :
            <div class="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Classifier has been trained</div>
                <div class="text-center text-blue-600 text-xl underline-offset-4">Classifier has been trained</div>
            </div>
    )



}


export default Classifier