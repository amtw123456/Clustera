// Sidebar.jsx
import React, { useEffect, useState } from 'react';
import WordCloudChart from './wordcloudchart.tsx';
import PieChart from './piechart.tsx'

function DataSummarySection({ summarizedDocuments, silhouetteScoreGenerated, noOfClusters, topicCoheranceGenerated, topicsGenerated, clustersGenerated, topicsGeneratedLabel }) {
    const [averageCoheranceScore, setAverageCoheranceScore] = useState(0.00);
    const [numberOfClusteredDocuments, setNumberOfClusteredDocuments] = useState(0.00);
    useEffect(() => {
        var temp = 0;
        topicCoheranceGenerated.slice(1).map((coheranceScore, index) => {
            temp += coheranceScore;
        });
        setAverageCoheranceScore(temp / (topicCoheranceGenerated.length - 1))
        temp = 0
        Array.from(Array(noOfClusters - 1), (item, index) => {
            temp += clustersGenerated[index + 1].length;
        });
        setNumberOfClusteredDocuments(temp)
    }, []);

    return (
        <div class="flex-col px-2 py-1 flex h-[785px] w-full m-3 rounded-lg bg-gray-100 drop-shadow-lg max-w-[1580px]">
            <div class="flex-row flex h-1/2">
                {/* <div class="ml-3 font-bold italic">Document Topic Distribution:</div> */}
                <div class="p-2 flex flex-col w-1/3 overflow-auto border-grey-300 border rounded-lg mt-3">
                    <div class="font-bold w-full h-[15px] text-center mb-5">Topics Summary</div>
                    <div class="w-full flex flex-col w-[480px]">
                        {topicsGenerated.slice(1).map((topics, index) => (
                            <div class="border-yellow flex flex-col w-full h-[68px] mb-1 overflow-hidden rounded-md text-teal-400 mb-1 rounded-md border-teal-400">
                                <div class="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                    <div class="flex text-base flex ml-[3px] px-1 ">Topic {index + 1}:</div>
                                    <div class="overflow-hidden flex flex-wrap">
                                        {topics.slice(0, 5).map((topic, topicIndex) => (
                                            <div class="flex ml-[3px] px-1 border font-bold text-base text-orange-400 m-1 rounded-md bg-orange-100 border-orange-400">{topic}</div>
                                        ))}
                                    </div>
                                </div>
                                <div class="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                    <div class="flex text-base flex ml-[3px] px-1 ">Topic Coherence Score: :</div>
                                    <div class='flex text-base italic rounded-md bg-green-100 border-green-400 text-green-400 px-1 border rounded-md'>{topicCoheranceGenerated[index + 1]}</div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
                <div class="ml-2 p-2 flex flex-col w-2/3 border-grey-300 border rounded-lg mt-3">
                    <div class="flex-row flex overflow-hidden">
                        <div class="w-1/2 flex flex-col px-1 overflow-auto">
                            <div class="font-bold h-[15px] text-center mb-5">Cluster Summary</div>
                            <div class="flex flex-col">
                                {Array.from(Array(noOfClusters - 1), (item, index) => (
                                    <div class="border-yellow flex flex-col w-[480px] h-[68px] mb-1 rounded-md text-teal-400 rounded-md border-teal-400">
                                        <div class="ml-5 flex flex-row flex-wrap italic font-bold text-base items-center">
                                            <div class="flex text-base flex ml-[3px] px-1 ">Cluster {index + 1} Number of documents:</div>
                                            <div class="flex flex-wrap">
                                                <div class="flex ml-[3px] px-1 border font-bold text-base text-purple-400 mt-1 rounded-md bg-purple-100 border-purple-400" >{clustersGenerated[index + 1].length} Documents</div>
                                            </div>
                                        </div>
                                        <div class="ml-5 flex flex-row flex-wrap italic font-bold text-base items-center">
                                            <div class="flex text-base flex ml-[3px] px-1 items-center">Cluster Label: </div>
                                            {
                                                topicsGeneratedLabel[index] === null ? (
                                                    <div class="font-bold italic ml-1 border rounded-md m-1 px-1 text-yellow-400 bg-yellow-100 border-yellow-400">Input Category name?</div>
                                                ) :
                                                    <div class="font-bold italic ml-1 text-yellow-400 m-1 px-1 border rounded-md bg-yellow-100 border-yellow-400">{topicsGeneratedLabel[index]}</div>
                                            }
                                            {/* <div class='flex text-base italic rounded-md bg-green-100 border-green-400 text-green-400 px-1 border rounded-md'>{topicCoheranceGenerated[innerIndex]}</div> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div class="flex flex-col w-1/2 overflow-x-auto overflow-y-hidden">
                            <div class="font-bold w-full h-[15px] text-center">Clustered Data Donut Chart</div>
                            <div class="w-full flex flex-col">
                                <PieChart clusterData={clustersGenerated} width={500} height={420} />
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <div class="flex-row flex w-full h-full my-1">

                <div class="flex flex-row w-1/4 justify-start border rounded-lg mr-1">
                    <div class="w-full">
                        <div class="flex flex-col px-4 items-center">
                            <div class="italic font-bold ">Data Summary</div>
                        </div>
                        <div class="flex flex-col px-8">
                            <div class="mt-12 flex-row flex">
                                <div class="font-bold">
                                    Silhouette score:
                                </div>
                                <div class="ml-1 italic">
                                    {silhouetteScoreGenerated}
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="flex-row flex">
                                    <div class="font-bold">
                                        Coherance Score:
                                    </div>
                                    <div class="ml-1 italic">
                                        {averageCoheranceScore}
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4">
                                <div class="flex-row flex">
                                    <div class="font-bold">
                                        Number of Unclustered Documents:
                                    </div>
                                    <div class="ml-1 italic">
                                        {clustersGenerated[0].length}
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="flex-row flex">
                                    <div class="font-bold">
                                        Number of Clustered Documents:
                                    </div>
                                    <div class="ml-1 italic">
                                        {numberOfClusteredDocuments}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row w-3/4 justify-start border rounded-lg ml-1">
                    <div class="w-full"></div>
                    {/* <WordCloudChart width={500} height={250} /> */}
                </div>
            </div>

        </div >
    );
}


export default DataSummarySection;