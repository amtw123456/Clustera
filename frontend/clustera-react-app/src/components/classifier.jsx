import React, { useEffect, useState, useContext } from "react";
import { AppContext } from '../providers/AppState.jsx';
import Scatterplot from "./scatterplot_folder/Scatterplot";


function Classifier({ topicsGenerated, classifierModel, topicsGeneratedLabel, documentCountPerCluster, clustersGenerated, summarizedDocuments }) {
    const REACT_APP_BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

    const [classifierResult, setClassifierResult] = useState([0]);
    const [classifierResultDistribution, setClassifierResultDistribution] = useState();
    const [classifierCosineSimilarityResult, setClassifierCosineSimilarityResult] = useState(Array.from({ length: Object.keys(clustersGenerated).length - 1 }, () => ([0])))
    const [topClassifierCosineSimilarityResult, setTopClassifierCosineSimilarityResult] = useState(0)
    const [isClassifierLoading, setIsClassifierLoading] = useState();
    const [classifierLabels, setClassifierLabels] = useState([]);

    const { includeClusterProvider, setIncludeClusterProvider } = useContext(AppContext);

    useEffect(() => {
        console.log(includeClusterProvider)
    }, [includeClusterProvider]);

    const handleincludeClusterProviderChange = (index) => {
        const newCheckboxes = [...includeClusterProvider];
        newCheckboxes[index] = !newCheckboxes[index];
        setIncludeClusterProvider(newCheckboxes);
    };

    useEffect(() => {
        // console.log(classifierCosineSimilarityResult)
    }, [classifierCosineSimilarityResult]);

    const ldaClassifyDocument = async () => {
        var responseData
        var classifierTextInput = document.getElementById("classifierTextInput");
        setIsClassifierLoading(true)

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
            setClassifierLabels(responseData['classifier_labels'])
            setClassifierResult(responseData['lda_classifier_result'])
            setClassifierResultDistribution(responseData['lda_classifier_result_destribution'])
            setIsClassifierLoading(false)
        }
    };

    const determineCosineSimilarityToClusters = async () => {
        const classifierDocumentClusterId = []
        const classifierTopicDistribution = Array.from({ length: Object.keys(clustersGenerated).length - 1 }, () => ([]))
        const classifierDocumentsText = Array.from({ length: Object.keys(clustersGenerated).length - 1 }, () => ([]))
        var responseData
        var classifierTextInput = document.getElementById("classifierTextInput");
        // summarizedDocuments

        summarizedDocuments.map((document, index) => {
            if (document.includeToClusterBool && document.clusterId !== 0) {
                classifierDocumentsText[document.clusterId - 1].push(document.pDocument)
                classifierTopicDistribution[document.clusterId - 1].push(document.documentTopicDistribution)
            }
        })

        try {
            const response = await fetch(REACT_APP_BACKEND_API_URL + 'cosinesimilarity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "clusters_documents": classifierDocumentsText,
                    "documents": [classifierTextInput.value]
                }),
            });

            responseData = await response.json();
        } catch (error) {
            console.error('Error during text preprocessing:', error);
        } finally {
            setClassifierCosineSimilarityResult(responseData['document_cosine_similarity'])
            setTopClassifierCosineSimilarityResult(responseData['document_cosine_similarity'].indexOf(Math.max(...responseData['document_cosine_similarity'])))
        }

    }
    const Rectangle = ({ percentage, index }) => {
        const filledWidth = `${percentage}%`;
        // console.log(includeClusterProvider[index])
        return (
            <div className="w-[1100px] h-8 bg-gray-300 rounded">
                {
                    classifierResult[0] === (classifierLabels[index - 1]) ? (
                        < div className="h-full bg-green-400 rounded" style={{ width: filledWidth }}>
                            <div className="ml-1 text-white text-sm p-1">{percentage}%</div>
                        </div>
                    ) :
                        < div className="h-full bg-blue-600 rounded" style={{ width: filledWidth }}>
                            <div className="ml-1 text-white text-sm p-1">{percentage}%</div>
                        </div>
                }
            </div >
        );
    };

    return (
        classifierModel ? (
            <div className="flex-1 px-5 w-full ">
                <div className="ml-4 font-bold">Classifier Labels</div>
                <div className="w-full overflow-hidden">
                    <div className="flex-row flex-wrap flex mt-1">
                        {
                            topicsGenerated.slice(1).map((topics, index) => (
                                includeClusterProvider[index] && clustersGenerated[index + 1].length - documentCountPerCluster[index + 1] ? (
                                    <div className="border flex flex-col w-80 mx-2 h-[130px] overflow-auto rounded-md text-teal-400 mb-2 rounded-md bg-teal-100 border-teal-400 px-1">
                                        <div className="flex text-sm flex px-1 items-center justify-center">
                                            Cluster {index + 1}
                                        </div>
                                        <div className="flex flex-row flex-wrap max-w-[500px] font-bold text-base justify-center">
                                            <div className="flex items-center">
                                                {
                                                    topicsGeneratedLabel[index] === null ? (
                                                        <>Unlabeled Cluster</>
                                                    ) :
                                                        <>{topicsGeneratedLabel[index]}</>
                                                }

                                            </div>
                                        </div>
                                        <div className="flex text-sm flex px-1 items-center justify-center">Trained with {clustersGenerated[index + 1].length - documentCountPerCluster[index + 1]} / {clustersGenerated[index + 1].length} documents</div>
                                        <div className="overflow-auto flex flex-wrap items-center justify-center">
                                            {
                                                topics.slice(0, 7).map((topic, topicIndex) => (
                                                    <div className="flex ml-[3px] px-1 border font-bold text-sm text-teal-400 m-1 rounded-md bg-teal-100 border-teal-400">{topic}</div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ) :
                                    clustersGenerated[index + 1].length - documentCountPerCluster[index + 1] ? (
                                        <div className="border flex flex-col w-80 mx-2 h-[130px] overflow-auto rounded-md text-red-400 mb-2 rounded-md bg-red-100 border-red-400 px-1">
                                            <div className="flex text-sm flex px-1 items-center justify-center">Cluster {index + 1}</div>
                                            <div className="flex flex-row flex-wrap max-w-[500px] font-bold text-base justify-center">

                                                {
                                                    topicsGeneratedLabel[index] === null ? (
                                                        <>Unlabeled Cluster</>
                                                    ) :
                                                        <>{topicsGeneratedLabel[index]}</>
                                                }
                                            </div>
                                            <div className="flex text-sm flex px-1 items-center justify-center">Trained with {clustersGenerated[index + 1].length - documentCountPerCluster[index + 1]} / {clustersGenerated[index + 1].length} documents</div>
                                            <div className="overflow-auto flex flex-wrap items-center justify-center">
                                                {
                                                    topics.slice(0, 7).map((topic, topicIndex) => (
                                                        <div className="flex ml-[3px] px-1 border font-bold text-sm text-red-400 m-1 rounded-md bg-red-100 border-red-400">{topic}</div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ) :
                                        (
                                            <div className="border flex flex-col w-80 mx-2 h-[130px] overflow-auto rounded-md text-gray-400 mb-2 rounded-md bg-gray-100 border-gray-400 px-1">
                                                <div className="flex text-sm flex px-1 items-center justify-center">Cluster {index + 1}</div>
                                                <div className="flex flex-row flex-wrap max-w-[500px] font-bold text-base justify-center">

                                                    {
                                                        topicsGeneratedLabel[index] === null ? (
                                                            <>Unlabeled Cluster</>
                                                        ) :
                                                            <>{topicsGeneratedLabel[index]}</>
                                                    }
                                                </div>
                                                <div className="flex text-sm flex px-1 items-center justify-center">Trained with {clustersGenerated[index + 1].length - documentCountPerCluster[index + 1]} / {clustersGenerated[index + 1].length} documents</div>
                                                <div className="overflow-auto flex flex-wrap items-center justify-center">
                                                    {
                                                        topics.slice(0, 7).map((topic, topicIndex) => (
                                                            <div className="flex ml-[3px] px-1 border font-bold text-sm text-gray-400 m-1 rounded-md bg-gray-100 border-gray-400">{topic}</div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )
                            ))
                        }
                    </div>
                </div>
                <div className="flex mt-5 ml-3">
                    <textarea id="classifierTextInput" className="p-2 border rounded-md focus:border-blue-500 focus:outline-none" placeholder="Enter a text to classify" rows="4" cols="180"></textarea>
                </div>

                <div className="flex ml-3 mt-6">
                    <button onClick={() => { ldaClassifyDocument(); determineCosineSimilarityToClusters() }}>
                        {
                            isClassifierLoading ? (
                                <svg aria-hidden="true" role="status" className="inline w-5 h-5 me-3 text-white animate-spin fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            ) : (
                                < div className="text-white block py-2 px-5 text-black border-blue-500 text-white px-12 py-2 bg-blue-500 rounded-lg text-sm font-bold cursor-pointer hover:bg-blue-700">
                                    Classify Documents
                                </div>
                            )
                        }
                    </button>
                </div >

                <div className="flex ml-3 mt-6">
                    <div className="flex-col flex items-center">
                        {
                            classifierResult !== undefined ? (
                                <div className="justify-center flex border w-[150px] font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400">
                                    {classifierResult}
                                </div>

                            ) :
                                <div className="justify-center flex border w-[150px] font-bold text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400">
                                    {0}
                                </div>
                        }
                        <div className="flex flex-col h-1/2">
                            {
                                classifierResultDistribution !== undefined ? (
                                    classifierResultDistribution.map((topicDistributionList, outerIndex) => (
                                        topicDistributionList.map((topicDistribution, index) => (
                                            <>
                                                {
                                                    topicsGeneratedLabel[index] === null ? (
                                                        topClassifierCosineSimilarityResult === (classifierLabels[index] - 1) ? (
                                                            <div className="font-bold italic ml-1">Cluster {classifierLabels[index]} | Cosine Similarity: {classifierCosineSimilarityResult[classifierLabels[index] - 1]}</div>
                                                        ) :
                                                            <div className="ml-1">Cluster {classifierLabels[index]} | Cosine Similarity: {classifierCosineSimilarityResult[classifierLabels[index] - 1]}</div>
                                                        // <div className="font-bold   ml-1">Cluster {index + 1} | Cosine Similarity: {classifierCosineSimilarityResult[index]}</div>
                                                    ) :
                                                        topClassifierCosineSimilarityResult === (classifierLabels[index] - 1) ? (
                                                            <div className="font-bold italic ml-1">{topicsGeneratedLabel[classifierLabels[index] - 1]} | Cosine Similarity: {classifierCosineSimilarityResult[classifierLabels[index] - 1]}</div>
                                                        ) :
                                                            <div className="ml-1">{topicsGeneratedLabel[classifierLabels[index] - 1]} | Cosine Similarity: {classifierCosineSimilarityResult[classifierLabels[index] - 1]}</div>
                                                }
                                                <Rectangle percentage={(topicDistribution * 100).toFixed(2)} index={index + 1} />
                                            </>
                                            // <div className="px-2 py-1 flex border font-bold text-yellow-400 m-1 rounded-md bg-yellow-100 border-yellow-400">{index + 1}: {(topicDistribution * 100).toFixed(2)}%</div>
                                            // <div><Rectangle percentage={50} /></div>
                                        ))
                                    ))
                                ) :
                                    topicsGenerated.slice(1).map((topicDistributionList, index) => (
                                        <>
                                            {
                                                topicsGeneratedLabel[index] === null ? (
                                                    <div className="font-bold ml-1">Cluster {index + 1} | Cosine Similarity: {classifierCosineSimilarityResult[index]}</div>
                                                ) :
                                                    <div className="font-bold ml-1">{topicsGeneratedLabel[index]} | Cosine Similarity: {classifierCosineSimilarityResult[index]}</div>
                                            }
                                            <Rectangle percentage={0} />
                                        </>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div >
        ) :
            <div className="flex-1">
                <div className="text-center mt-80 text-gray-600 text-sm, dark:text-gray-400">Train your classifier</div>
                <div className="text-center text-blue-600 text-xl underline-offset-4">Please press the Train classifier button in the Sidebar!</div>
            </div>
    )
}


export default Classifier