// Sidebar.jsx
import React from 'react';

function DataSummarySection({ summarizedDocuments, noOfClusters, topicCoheranceGenerated, topicsGenerated }) {
    return (
        <div class="h-[785px] w-full pt-1 m-3 rounded-lg bg-gray-100 drop-shadow-lg overflow-hidden">

            {/* <div class="ml-3 font-bold italic">Document Topic Distribution:</div> */}
            <div class="ml-2 p-2 flex flex-col h-1/2 w-1/4 overflow-auto border-grey-300 border rounded-lg mt-3">
                <div class="font-bold w-full h-[15px] text-center mb-5">Topics Summary</div>
                <div class="w-full flex flex-col">
                    {topicsGenerated.map((topics, innerIndex) => (
                        <div class="border-black border flex flex-col w-full h-[55px] mb-1 overflow-hidden rounded-md" key={innerIndex}>
                            <div class="flex flex-row flex-wrap italic w-[500px] overflow">
                                <div class="flex pl-3 text-base">Topic {innerIndex}:</div>
                                <div class="overflow-hidden flex flex-wrap">
                                    {topics.slice(0, 5).map((topic, topicIndex) => (
                                        <div class="flex ml-[3px] text-base" key={topicIndex}>{topic}</div>
                                    ))}
                                </div>
                            </div>
                            <div class='flex ml-3 text-base italic'>Topic Coherence Score: {topicCoheranceGenerated[innerIndex]}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}


export default DataSummarySection;