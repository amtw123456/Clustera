import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../providers/AppState.jsx';
import Scatterplot from "./scatterplot_folder/Scatterplot";
import { data } from "./scatterplot_folder/data";


function Classifier({ summarizedDocuments, noOfClusters, clustersPredicted, topicsGenerated, clustersGenerated, tsneParameters, documentTopicDistributionThreshold, classifierModel }) {
    const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

    const [classifierResult, setClassifierResult] = useState();
    const [classifierResultDistribution, setClassifierResultDistribution] = useState();

    const ldaClassifyDocument = async () => {
        var responseData
        var classifierTextInput = document.getElementById("classifierTextInput");

        try {
            const response = await fetch(REACT_APP_BACKEND_API_URL + 'ldaclassifydocuments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "lda_trained_classifier": classifierModel,
                    "documents": [classifierTextInput.value]
                }),
            });

            responseData = await response.json();

        } catch (error) {
            console.error('Error during text preprocessing:', error);
        } finally {
            setClassifierResult(responseData['lda_classifier_result'])
            setClassifierResultDistribution(responseData['lda_classifier_result_destribution'])
            console.log(classifierResult)
            console.log(classifierResultDistribution)
        }
    };

    return (
        classifierModel ? (
            <div class="flex-1 px-5 w-full items-center ">
                <div class="text-center font-bold">Classifier Labels</div>
                <div class="w-full overflow-hidden justify-center">
                    <div class="flex-row flex-wrap flex mt-4 justify-center">
                        {topicsGenerated.map((topics, innerIndex) => (
                            <div class="border flex flex-col w-80 mx-3 my-1 h-[100px] overflow-auto rounded-md text-teal-400 mb-1 rounded-md bg-teal-100 border-teal-400 justify-center px-2">
                                <div class="flex flex-row flex-wrap italic max-w-[500px] mt-2 font-bold text-base justify-center">
                                    <div>Cluster {innerIndex}: Cluster Label</div>
                                    <div class="flex text-sm flex px-1"></div>
                                    <div class="overflow-auto flex flex-wrap items-center">
                                        {
                                            topics.slice(0, 7).map((topic, topicIndex) => (
                                                <div class="flex ml-[3px] px-1 border font-bold text-sm text-orange-400 m-1 rounded-md bg-orange-100 border-orange-400" key={topicIndex}>{topic}</div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div class="justify-center flex mt-5">
                    <textarea id="classifierTextInput" class="p-2 border rounded-md focus:border-blue-500 focus:outline-none" placeholder="Enter a text to classify" rows="4" cols="140"></textarea>
                </div>

                <div class="flex justify-center mt-12">
                    <button onClick={() => ldaClassifyDocument()}>{ }
                        < div class="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                            Classify Documents
                        </div>
                    </button>
                </div>

                <div class="flex justify-center mt-6">
                    <div class="flex-col flex items-center">
                        {
                            classifierResult !== undefined ? (

                                <div class="justify-center flex border w-[150px] font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400">
                                    {classifierResult}
                                </div>

                            ) :
                                <></>
                        }
                        <div className="flex flex-row">
                            {
                                classifierResultDistribution !== undefined ? (
                                    classifierResultDistribution.map((topicDistributionList, index) => (
                                        topicDistributionList.map((topicDistribution, index) => (
                                            <div class="px-2 py-1 flex border font-bold text-yellow-400 m-1 rounded-md bg-yellow-100 border-yellow-400">{index}: {(topicDistribution * 100).toFixed(2)}%</div>
                                        ))
                                    ))
                                ) :
                                    <></>
                            }
                        </div>
                    </div>
                </div>



            </div >
        ) :
            <div class="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Train your classifier</div>
                <div class="text-center text-blue-600 text-xl underline-offset-4">Please press the Train classifier button in the Sidebar!</div>
            </div>
    )
}


export default Classifier