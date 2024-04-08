// Sidebar.jsx
import React from 'react';
import WordCloudChart from './wordcloudchart.jsx';
import DonutChart from './donutchart.tsx'
import { data } from "./data1.ts";

function DataSummarySection({ summarizedDocuments, noOfClusters, topicCoheranceGenerated, topicsGenerated, clustersGenerated }) {
    return (
        <div class="flex-col px-2 py-1 flex h-[785px] w-full m-3 rounded-lg bg-gray-100 drop-shadow-lg max-w-[1580px]">
            <div class="flex-row flex h-1/2">
                {/* <div class="ml-3 font-bold italic">Document Topic Distribution:</div> */}
                <div class="p-2 flex flex-col w-1/3 overflow-auto border-grey-300 border rounded-lg mt-3">
                    <div class="font-bold w-full h-[15px] text-center mb-5">Topics Summary</div>
                    <div class="w-full flex flex-col">
                        {topicsGenerated.map((topics, innerIndex) => (
                            <div class="border-yellow border flex flex-col w-full h-[68px] mb-1 overflow-hidden rounded-md text-teal-400 mb-1 rounded-md bg-teal-100 border-teal-400">
                                <div class="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                    <div class="flex text-base flex ml-[3px] px-1 ">Topic {innerIndex}:</div>
                                    <div class="overflow-hidden flex flex-wrap">
                                        {topics.slice(0, 5).map((topic, topicIndex) => (
                                            <div class="flex ml-[3px] px-1 border font-bold text-base text-orange-400 m-1 rounded-md bg-orange-100 border-orange-400" key={topicIndex}>{topic}</div>
                                        ))}
                                    </div>
                                </div>
                                <div class="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                    <div class="flex text-base flex ml-[3px] px-1 ">Topic Coherence Score: :</div>
                                    <div class='flex text-base italic rounded-md bg-green-100 border-green-400 text-green-400 px-1 border rounded-md'>{topicCoheranceGenerated[innerIndex]}</div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
                <div class="ml-2 p-2 flex flex-col w-2/3 overflow-auto border-grey-300 border rounded-lg mt-3">
                    <div class="flex-row flex">
                        <div class="w-1/2 flex flex-col">
                            <div class="font-bold w-full h-[15px] text-center mb-5">Clustered Summary</div>
                            <div class="w-full flex flex-col">
                                {Array.from(Array(noOfClusters), (item, index) => (
                                    <div class="border-yellow border flex flex-col w-full h-[68px] mb-1 overflow-hidden rounded-md text-teal-400 mb-1 rounded-md bg-teal-100 border-teal-400">
                                        <div class="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                            <div class="flex text-base flex ml-[3px] px-1 ">Cluster {index} Number of documents:</div>
                                            <div class="overflow-hidden flex flex-wrap">
                                                <div class="flex ml-[3px] px-1 border font-bold text-base text-purple-400 m-1 rounded-md bg-purple-100 border-purple-400" >{clustersGenerated[index].length} Documents</div>
                                            </div>
                                        </div>
                                        <div class="ml-5 flex flex-row flex-wrap italic w-[500px] overflow font-bold text-base items-center">
                                            <div class="flex text-base flex ml-[3px] px-1 ">Cluster Category Label: NaN</div>
                                            {/* <div class='flex text-base italic rounded-md bg-green-100 border-green-400 text-green-400 px-1 border rounded-md'>{topicCoheranceGenerated[innerIndex]}</div> */}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                        <div class="flex flex-col w-1/2">
                            <div class="font-bold w-full h-[15px] text-center">Clustered Data Donut Chart</div>
                            <div class="w-full flex flex-col">
                                <DonutChart data={data} width={500} height={400} />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div class="flex-row flex w-full h-full bg-green-200 my-2">
                <div class="flex flex-row w-1/2 justify-start mt-3">
                    <div class="flex bg-red-200 p-3 rounded-lg">
                        redredredredredredredred
                    </div>
                </div>
                <div class="flex flex-row w-1/2 justify-start mt-3">
                    <div class="flex bg-red-200 p-3 rounded-lg">
                        redredredredredredredred
                        <div class="h-1/3 flex"><WordCloudChart /></div>
                    </div>
                </div>
            </div>

        </div>
    );
}


export default DataSummarySection;